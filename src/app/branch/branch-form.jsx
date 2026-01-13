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
import { Textarea } from "@/components/ui/textarea";
import { BRANCH_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const INITIAL_STATE = {
  branch_short: "",
  branch_name: "",
  branch_name_short: "",
  branch_address: "",
  branch_crop_address: "",
  branch_spice_board: "",
  branch_iec: "",
  branch_apeda: "",
  branch_gst: "",
  branch_state: "",
  branch_state_no: "",
  branch_state_short: "",
  branch_scheme: "",
  branch_pan_no: "",
  branch_ecgcncb: "",
  branch_ecgc_policy: "",
  branch_reg_no: "",
  branch_status: "Active",
  branch_port_of_loading: "",
  branch_prereceipts: "",
  branch_rbi_no: "",
  branch_email_id: "",
  branch_mobile_no: "",
  branch_tin_no: "",
  branch_fssai_no: "",
  branch_sign_name: "",
  branch_sign_no: "",
  branch_sign_name1: "",
  branch_sign_no1: "",
  branch_sign_name2: "",
  branch_sign_no2: "",
};

const numberFields = [
  "branch_spice_board",
  "branch_iec",
  "branch_apeda",
  "branch_gst",
  "branch_state_no",
  "branch_ecgcncb",
  "branch_ecgc_policy",
  "branch_reg_no",
  "branch_prereceipts",
  "branch_rbi_no",
  "branch_tin_no",
  "branch_fssai_no",
  "branch_sign_no",
  "branch_sign_no1",
  "branch_sign_no2",
];

const Field = ({ label, name, value, onChange, error, required }) => (
  <div>
    <Label>
      {label} {required && <span>*</span>}
    </Label>
    <Input value={value} onChange={(e) => onChange(name, e.target.value)} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const BranchForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const { trigger, loading } = useApiMutation();
  const {
    trigger: fetchBranch,
    loading: loadingData,
    error,
  } = useApiMutation();

  const { state, prereceipt, port, scheme } = useMasterQueries([
    "state",
    "prereceipt",
    "port",
    "scheme",
  ]);

  const {
    data: stateData,
    loading: loadingState,
    error: stateError,
    refetch: refetchState,
  } = state;
  const {
    data: prereceiptsData,
    loading: loadingPreReceipts,
    error: prereceiptError,
    refetch: refetchPreReceipts,
  } = prereceipt;
  const {
    data: portData,
    loading: loadingPort,
    error: portError,
    refetch: refetchPort,
  } = port;
  const {
    data: schemeData,
    loading: loadingScheme,
    error: schemeError,
    refetch: refetchScheme,
  } = scheme;

  useEffect(() => {
    if (!isEdit) return;

    const fetchData = async () => {
      try {
        const res = await fetchBranch({
          url: BRANCH_API.getById(id),
        });
        setFormData({ ...INITIAL_STATE, ...res.data });
      } catch {
        toast.error("Failed to load Company");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (name, value) => {
    const valStr = value !== null && value !== undefined ? String(value) : "";

    if (name === "branch_mobile_no" && !/^\d*$/.test(valStr)) return;
    if (numberFields.includes(name) && !/^\d*\.?\d*$/.test(valStr)) return;

    setFormData((p) => ({ ...p, [name]: valStr }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.branch_short || formData.branch_short.trim() === "") {
      newErrors.branch_short = "Company short name is required";
    }

    if (!formData.branch_name || formData.branch_name.trim() === "") {
      newErrors.branch_name = "Company name is required";
    }

    if (
      !formData.branch_name_short ||
      formData.branch_name_short.trim() === ""
    ) {
      newErrors.branch_name_short = "Company prefix is required";
    }

    if (!formData.branch_address || formData.branch_address.trim() === "") {
      newErrors.branch_address = "Company address is required";
    }

    if (!formData.branch_iec || formData.branch_iec.trim() === "") {
      newErrors.branch_iec = "IEC code is required";
    }

    if (!formData.branch_gst || formData.branch_gst.trim() === "") {
      newErrors.branch_gst = "GST number is required";
    }

    if (!formData.branch_pan_no || formData.branch_pan_no.trim() === "") {
      newErrors.branch_pan_no = "PAN number is required";
    }

    if (!formData.branch_state || formData.branch_state === "") {
      newErrors.branch_state = "State is required";
    }

    if (!formData.branch_state_no || formData.branch_state_no === "") {
      newErrors.branch_state_no = "State Code is required";
    }

    if (!formData.branch_state_short || formData.branch_state_short === "") {
      newErrors.branch_state_short = "State Short is required";
    }

    if (!formData.branch_prereceipts || formData.branch_prereceipts === "") {
      newErrors.branch_prereceipts = "Pre Receipt is required";
    }

    if (
      formData.branch_email_id &&
      !/^\S+@\S+\.\S+$/.test(formData.branch_email_id)
    ) {
      newErrors.branch_email_id = "Invalid email";
    }

    if (formData.branch_mobile_no && formData.branch_mobile_no.length !== 10) {
      newErrors.branch_mobile_no = "Must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStateChange = (value) => {
    const s = stateData?.data?.find((i) => i.state_name == value);
    console.log(s, "s");

    setFormData((p) => ({
      ...p,
      branch_state: value,
      branch_state_no: Number(s?.state_no) || "",
      branch_state_short: s?.state_short_name || "",
    }));
    console.log(formData, "formsda");
    setErrors((p) => ({
      ...p,
      branch_state: "",
      branch_state_no: "",
      branch_state_short: "",
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await trigger({
        url: isEdit ? BRANCH_API.updateById(id) : BRANCH_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 201) {
        toast.success(
          res.message ??
            (isEdit ? "Updated successfully" : "Created successfully")
        );

        navigate("/master/branch");
        await queryClient.invalidateQueries(["branch-list"]);
      } else toast.error(res.message || "Something went wrong");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };
  const anyError = stateError || prereceiptError || portError || schemeError;

  if (anyError) {
    return (
      <ApiErrorPage
        onRetry={() => {
          if (stateError) refetchState();
          if (prereceiptError) refetchPreReceipts();
          if (portError) refetchPort();
          if (schemeError) refetchScheme();
        }}
      />
    );
  }

  const isLoading =
    loadingState || loadingPreReceipts || loadingPort || loadingScheme;

  return (
    <>
      {isLoading && <LoadingBar />}

      <PageHeader
        icon={User}
        title={isEdit ? "Edit Company" : "Create Company"}
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
          {/* BASIC */}
          <Field
            label="Company Name"
            name="branch_name"
            value={formData.branch_name}
            onChange={handleChange}
            error={errors.branch_name}
            required
          />
          <Field
            label="Company Short"
            name="branch_short"
            value={formData.branch_short}
            onChange={handleChange}
            error={errors.branch_short}
            required
          />
          <Field
            label="Company Prefix"
            name="branch_name_short"
            value={formData.branch_name_short}
            onChange={handleChange}
            error={errors.branch_name_short}
            required
          />

          <div className="md:col-span-4">
            <Label>Company Address *</Label>
            <Textarea
              value={formData.branch_address}
              onChange={(e) => handleChange("branch_address", e.target.value)}
            />
            {errors.branch_address && (
              <p className="text-xs text-red-500">{errors.branch_address}</p>
            )}
          </div>

          <Field
            label="Crop Address"
            name="branch_crop_address"
            value={formData.branch_crop_address}
            onChange={handleChange}
            error={errors.branch_crop_address}
          />
          <Field
            label="GST No"
            name="branch_gst"
            value={formData.branch_gst}
            onChange={handleChange}
            error={errors.branch_gst}
            required
          />
          <Field
            label="IEC Code"
            name="branch_iec"
            value={formData.branch_iec}
            onChange={handleChange}
            error={errors.branch_iec}
            required
          />
          <Field
            label="PAN No"
            name="branch_pan_no"
            value={formData.branch_pan_no}
            onChange={handleChange}
            error={errors.branch_pan_no}
            required
          />

          {/* STATE */}
          <div>
            <Label>State *</Label>
            <Select
              value={formData.branch_state || ""}
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
            {errors.branch_state && (
              <p className="text-xs text-red-500">{errors.branch_state}</p>
            )}
          </div>

          <Field
            label="State Code"
            name="branch_state_no"
            value={formData.branch_state_no}
            onChange={handleChange}
            error={errors.branch_state_no}
            required
          />
          <Field
            label="State Short"
            name="branch_state_short"
            value={formData.branch_state_short}
            onChange={handleChange}
            error={errors.branch_state_short}
            required
          />

          {/* PRE RECEIPTS */}

          <div>
            <Label>Pre Receipts *</Label>
            <Select
              value={formData.branch_prereceipts}
              onValueChange={(v) => handleChange("branch_prereceipts", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pre receipt" />
              </SelectTrigger>
              <SelectContent>
                {prereceiptsData?.data?.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.prereceipts_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.branch_prereceipts && (
              <p className="text-xs text-red-500">
                {errors.branch_prereceipts}
              </p>
            )}
          </div>

          {/* PORT */}
          <div>
            <Label>Port of Loading</Label>
            <Select
              value={formData.branch_port_of_loading || ""}
              onValueChange={(v) => handleChange("branch_port_of_loading", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select port" />
              </SelectTrigger>
              <SelectContent>
                {portData?.data?.map((p) => (
                  <SelectItem key={p.id} value={p.portofLoading}>
                    {p.portofLoading}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SCHEME */}
          <div>
            <Label>Scheme</Label>
            <Select
              value={formData.branch_scheme || ""}
              onValueChange={(v) => handleChange("branch_scheme", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scheme" />
              </SelectTrigger>
              <SelectContent>
                {schemeData?.data?.map((s) => (
                  <SelectItem key={s.id} value={s.scheme_short}>
                    {s.scheme_short}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CONTACT */}
          <Field
            label="Email"
            name="branch_email_id"
            value={formData.branch_email_id}
            onChange={handleChange}
            error={errors.branch_email_id}
          />
          <Field
            label="Mobile No"
            name="branch_mobile_no"
            value={formData.branch_mobile_no}
            onChange={handleChange}
            error={errors.branch_mobile_no}
          />

          {/* OTHER */}
          <Field
            label="Spice Board No"
            name="branch_spice_board"
            value={formData.branch_spice_board}
            onChange={handleChange}
            error={errors.branch_spice_board}
          />
          <Field
            label="APEDA No"
            name="branch_apeda"
            value={formData.branch_apeda}
            onChange={handleChange}
            error={errors.branch_apeda}
          />
          <Field
            label="RBI No"
            name="branch_rbi_no"
            value={formData.branch_rbi_no}
            onChange={handleChange}
            error={errors.branch_rbi_no}
          />
          <Field
            label="TIN No"
            name="branch_tin_no"
            value={formData.branch_tin_no}
            onChange={handleChange}
            error={errors.branch_tin_no}
          />
          <Field
            label="FSSAI No"
            name="branch_fssai_no"
            value={formData.branch_fssai_no}
            onChange={handleChange}
            error={errors.branch_fssai_no}
          />
          <Field
            label="ECGC NCB"
            name="branch_ecgcncb"
            value={formData.branch_ecgcncb}
            onChange={handleChange}
            error={errors.branch_ecgcncb}
          />
          <Field
            label="ECGC Policy"
            name="branch_ecgc_policy"
            value={formData.branch_ecgc_policy}
            onChange={handleChange}
            error={errors.branch_ecgc_policy}
          />
          <Field
            label="Registration No"
            name="branch_reg_no"
            value={formData.branch_reg_no}
            onChange={handleChange}
            error={errors.branch_reg_no}
          />

          {/* SIGNATORY */}
          <Field
            label="Signatory Name 1"
            name="branch_sign_name"
            value={formData.branch_sign_name}
            onChange={handleChange}
            error={errors.branch_sign_name}
          />
          <Field
            label="Signatory No 1"
            name="branch_sign_no"
            value={formData.branch_sign_no}
            onChange={handleChange}
            error={errors.branch_sign_no}
          />
          <Field
            label="Signatory Name 2"
            name="branch_sign_name1"
            value={formData.branch_sign_name1}
            onChange={handleChange}
            error={errors.branch_sign_name1}
          />
          <Field
            label="Signatory No 2"
            name="branch_sign_no1"
            value={formData.branch_sign_no1}
            onChange={handleChange}
            error={errors.branch_sign_no1}
          />
          <Field
            label="Signatory Name 3"
            name="branch_sign_name2"
            value={formData.branch_sign_name2}
            onChange={handleChange}
            error={errors.branch_sign_name2}
          />
          <Field
            label="Signatory No 3"
            name="branch_sign_no2"
            value={formData.branch_sign_no2}
            onChange={handleChange}
            error={errors.branch_sign_no2}
          />

          {isEdit && (
            <div>
              <Label>Status</Label>
              <Select
                value={formData.branch_status || ""}
                onValueChange={(v) => handleChange("branch_status", v)}
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

export default BranchForm;
