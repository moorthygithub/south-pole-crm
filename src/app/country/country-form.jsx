import ApiErrorPage from "@/components/api-error/api-error";
import {
  CountryCreate,
  CountryEdit,
} from "@/components/buttoncontrol/button-component";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const INITIAL_STATE = {
  country_name: "",
  country_port: "",
  country_dp: "",
  country_da: "",
  country_pol: "",
  country_status: "Active",
};

const CountryForm = React.memo(function CountryForm({ editId, onSuccess }) {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { pathname } = useLocation();

  const {
    trigger: fetchCountry,
    loading: loadingData,
    error,
  } = useApiMutation();
  const { trigger, loading } = useApiMutation();

  const fetchCountryData = async () => {
    try {
      const res = await fetchCountry({
        url: COUNTRY_API.getById(editId),
      });

      setFormData({
        country_name: res?.data?.country_name || "",
        country_port: res?.data?.country_port || "",
        country_dp: res?.data?.country_dp || "",
        country_da: res?.data?.country_da || "",
        country_pol: res?.data?.country_pol || "",
        country_status: res?.data?.country_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load country");
    }
  };

  useEffect(() => {
    if (open && isEdit) fetchCountryData();
  }, [open, editId, isEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    if (value === "") {
      setFormData({ ...formData, [name]: "" });
      return;
    }

    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async () => {
    const { country_name, country_port, country_dp, country_da, country_pol } =
      formData;

    if (!country_name || !country_port) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? COUNTRY_API.updateById(editId) : COUNTRY_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 200 || res.code === 201) {
        toast.success(
          isEdit
            ? "Country updated successfully"
            : "Country created successfully"
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (error) return <ApiErrorPage onRetry={fetchCountryData} />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loadingData && <LoadingBar />}
      <DialogTrigger asChild>
        {isEdit ? (
          <CountryEdit />
        ) : pathname === "/master/country" ? (
          <CountryCreate className="ml-2" />
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Country" : "Create Country"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>Country Name *</Label>
            <Input
              name="country_name"
              value={formData.country_name}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-1">
            <Label>Port *</Label>
            <Input
              name="country_port"
              value={formData.country_port}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-1">
            <Label>DP </Label>
            <Input
              name="country_dp"
              value={formData.country_dp}
              onChange={handleNumberChange}
            />
          </div>

          <div className="grid gap-1">
            <Label>DA </Label>
            <Input
              name="country_da"
              value={formData.country_da}
              onChange={handleNumberChange}
            />
          </div>

          <div className="grid gap-1">
            <Label>POL </Label>
            <Input
              name="country_pol"
              value={formData.country_pol}
              onChange={handleNumberChange}
            />
          </div>

          {isEdit && (
            <Select
              value={formData.country_status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  country_status: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Update Country"
            ) : (
              "Create Country"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default CountryForm;
