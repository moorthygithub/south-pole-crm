import {
  SchemeCreate,
  SchemeEdit,
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
import { SCHEME_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import ApiErrorPage from "@/components/api-error/api-error";
import { Textarea } from "@/components/ui/textarea";

const INITIAL_STATE = {
  scheme_short: "",
  scheme_description: "",
  scheme_tax: "",
  scheme_status: "Active",
};

const SchemeForm = React.memo(function SchemeForm({ editId, onSuccess }) {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { pathname } = useLocation();

  const {
    trigger: fetchScheme,
    loading: loadingData,
    error,
  } = useApiMutation();
  const { trigger, loading } = useApiMutation();

  const fetchSchemeData = async () => {
    try {
      const res = await fetchScheme({
        url: SCHEME_API.getById(editId),
      });

      setFormData({
        scheme_short: res?.data?.scheme_short || "",
        scheme_description: res?.data?.scheme_description || "",
        scheme_tax: res?.data?.scheme_tax || "",
        scheme_status: res?.data?.scheme_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Scheme");
    }
  };

  useEffect(() => {
    if (open && isEdit) fetchSchemeData();
  }, [open, editId, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    if (!formData.scheme_short || !formData.scheme_tax) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? SCHEME_API.updateById(editId) : SCHEME_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 200 || res.code === 201) {
        toast.success(
          isEdit ? "Scheme updated successfully" : "Scheme created successfully"
        );
        setOpen(false);
        onSuccess?.();
        setFormData(INITIAL_STATE);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (error) return <ApiErrorPage onRetry={fetchSchemeData} />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loadingData && <LoadingBar />}

      <DialogTrigger asChild>
        {isEdit ? (
          <SchemeEdit onClick={() => setOpen(true)} />
        ) : pathname === "/master/scheme" ? (
          <SchemeCreate onClick={() => setOpen(true)} className="ml-2" />
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Scheme" : "Create Scheme"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div>
            <Label>Scheme Code *</Label>
            <Input
              name="scheme_short"
              value={formData.scheme_short}
              onChange={handleChange}
              placeholder="Enter scheme code"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="scheme_description"
              value={formData.scheme_description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          <div>
            <Label>Tax % *</Label>
            <Input
              name="scheme_tax"
              value={formData.scheme_tax}
              onChange={handleNumberChange}
              placeholder="Enter tax percentage"
            />
          </div>

          {isEdit && (
            <div>
              <Label>Status</Label>
              <Select
                value={formData.scheme_status}
                onValueChange={(value) =>
                  setFormData((p) => ({ ...p, scheme_status: value }))
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
            </div>
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
              "Update Scheme"
            ) : (
              "Create Scheme"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default SchemeForm;
