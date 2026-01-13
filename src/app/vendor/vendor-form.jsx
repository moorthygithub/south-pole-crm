import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiMutation } from "@/hooks/useApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { VENDOR_API } from "@/constants/apiConstants";

const INITIAL_STATE = {
  vendor_alias: "",
  vendor_short: "",
  vendor_name: "",
  vendor_address: "",
  vendor_city: "",
  vendor_state: "",
  vendor_pincode: "",
  vendor_contact_person: "",
  vendor_mobile1: "",
  vendor_mobile2: "",
  vendor_landline: "",
  vendor_fax: "",
  vendor_remarks: "",
  vendor_bank: "",
  vendor_branch: "",
  vendor_account_name: "",
  vendor_account_no: "",
  vendor_ifscode: "",
  vendor_tin_no: "",
  vendor_gst_no: "",
  vendor_status: "Active",
};

const numberFields = [
  "vendor_pincode",
  "vendor_mobile1",
  "vendor_mobile2",
  "vendor_landline",
  "vendor_account_no",
];

const VendorForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const { trigger, loading } = useApiMutation();
  const {
    trigger: fetchVendor,
    loading: loadingData,
    error,
  } = useApiMutation();

  const { state } = useMasterQueries(["state"]);
  const {
    data: stateData,
    loading: loadingState,
    error: stateError,
    refetch: refetchState,
  } = state;

  useEffect(() => {
    if (!isEdit) return;

    const fetchData = async () => {
      try {
        const res = await fetchVendor({ url: VENDOR_API.getById(id) });
        setFormData({ ...INITIAL_STATE, ...res.data });
      } catch {
        toast.error("Failed to load Vendor data");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (name, value) => {
    let valStr = value !== null && value !== undefined ? String(value) : "";

    if (name === "vendor_mobile1" || name === "vendor_mobile2") {
      if (!/^\d*$/.test(valStr) || valStr.length > 10) return;
    }

    if (numberFields.includes(name) && !/^\d*$/.test(valStr)) return;

    setFormData((p) => ({ ...p, [name]: valStr }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.vendor_short.trim())
      newErrors.vendor_short = "Vendor short name is required";
    if (!formData.vendor_name.trim())
      newErrors.vendor_name = "Vendor name is required";
    if (!formData.vendor_state.trim())
      newErrors.vendor_state = "Vendor state is required";

    if (formData.vendor_mobile1 && formData.vendor_mobile1.length !== 10)
      newErrors.vendor_mobile1 = "Mobile 1 must be 10 digits";
    if (formData.vendor_mobile2 && formData.vendor_mobile2.length !== 10)
      newErrors.vendor_mobile2 = "Mobile 2 must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStateChange = (value) => {
    setFormData((p) => ({ ...p, vendor_state: value }));
    setErrors((p) => ({ ...p, vendor_state: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await trigger({
        url: isEdit ? VENDOR_API.updateById(id) : VENDOR_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 201) {
        toast.success(
          res.message ??
            (isEdit ? "Updated successfully" : "Created successfully")
        );
        navigate("/master/vendor");
        await queryClient.invalidateQueries(["vendor-list"]);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (error || stateError) {
    return (
      <ApiErrorPage
        onRetry={() => {
          if (stateError) refetchState();
        }}
      />
    );
  }

  const isLoading = loading || loadingData || loadingState;

  return (
    <>
      {isLoading && <LoadingBar />}

      <PageHeader
        icon={User}
        title={isEdit ? "Edit Vendor" : "Create Vendor"}
        rightContent={
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
      />

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Basic Info */}
          <Field
            label="Vendor Alias"
            name="vendor_alias"
            value={formData.vendor_alias}
            onChange={handleChange}
          />
          <Field
            label="Short Name"
            name="vendor_short"
            value={formData.vendor_short}
            onChange={handleChange}
            error={errors.vendor_short}
            required
          />
          <Field
            label="Vendor Name"
            name="vendor_name"
            value={formData.vendor_name}
            onChange={handleChange}
            error={errors.vendor_name}
            required
          />
          <Field
            label="Address"
            name="vendor_address"
            value={formData.vendor_address}
            onChange={handleChange}
          />
          <Field
            label="City"
            name="vendor_city"
            value={formData.vendor_city}
            onChange={handleChange}
          />

          {/* State */}
          <div>
            <Label>State *</Label>
            <Select
              value={formData.vendor_state}
              onValueChange={handleStateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {stateData?.data?.map((s) => (
                  <SelectItem key={s.state_name} value={s.state_name}>
                    {s.state_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vendor_state && (
              <p className="text-xs text-red-500">{errors.vendor_state}</p>
            )}
          </div>

          {/* Contacts */}
          <Field
            label="Pincode"
            name="vendor_pincode"
            value={formData.vendor_pincode}
            onChange={handleChange}
          />
          <Field
            label="Contact Person"
            name="vendor_contact_person"
            value={formData.vendor_contact_person}
            onChange={handleChange}
          />
          <Field
            label="Mobile 1"
            name="vendor_mobile1"
            value={formData.vendor_mobile1}
            onChange={handleChange}
            error={errors.vendor_mobile1}
          />
          <Field
            label="Mobile 2"
            name="vendor_mobile2"
            value={formData.vendor_mobile2}
            onChange={handleChange}
            error={errors.vendor_mobile2}
          />
          <Field
            label="Landline"
            name="vendor_landline"
            value={formData.vendor_landline}
            onChange={handleChange}
          />
          <Field
            label="Fax"
            name="vendor_fax"
            value={formData.vendor_fax}
            onChange={handleChange}
          />
          <Field
            label="Remarks"
            name="vendor_remarks"
            value={formData.vendor_remarks}
            onChange={handleChange}
          />

          {/* Bank Info */}
          <Field
            label="Bank"
            name="vendor_bank"
            value={formData.vendor_bank}
            onChange={handleChange}
          />
          <Field
            label="Branch"
            name="vendor_branch"
            value={formData.vendor_branch}
            onChange={handleChange}
          />
          <Field
            label="Account Name"
            name="vendor_account_name"
            value={formData.vendor_account_name}
            onChange={handleChange}
          />
          <Field
            label="Account No"
            name="vendor_account_no"
            value={formData.vendor_account_no}
            onChange={handleChange}
          />
          <Field
            label="IFSC"
            name="vendor_ifscode"
            value={formData.vendor_ifscode}
            onChange={handleChange}
          />
          <Field
            label="TIN No"
            name="vendor_tin_no"
            value={formData.vendor_tin_no}
            onChange={handleChange}
          />
          <Field
            label="GST No"
            name="vendor_gst_no"
            value={formData.vendor_gst_no}
            onChange={handleChange}
          />

          {/* Status */}
          {isEdit && (
            <div>
              <Label>Status</Label>
              <Select
                value={formData.vendor_status}
                onValueChange={(v) => handleChange("vendor_status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="Inactive">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

// Reusable Field Component
const Field = ({ label, name, value, onChange, error, required }) => (
  <div>
    <Label>
      {label} {required && <span>*</span>}
    </Label>
    <Input value={value} onChange={(e) => onChange(name, e.target.value)} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default VendorForm;
