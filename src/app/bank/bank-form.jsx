import {
  BankCreate,
  BankEdit,
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
import { BANK_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const INITIAL_STATE = {
  branch_short: "",
  bank_name: "",
  bank_acc_no: "",
  bank_branch: "",
  bank_details: "",
  bank_status: "Active",
};

const BankForm = React.memo(function BankForm({ editId }) {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { pathname } = useLocation();
  const { trigger: fetchBank, loading: loadingData, error } = useApiMutation();
  const { trigger, loading } = useApiMutation();

  const fetchBankData = async () => {
    try {
      const res = await fetchBank({
        url: BANK_API.getById(editId),
      });

      setFormData({
        bank_name: res?.data?.bank_name || "",
        bank_details: res?.data?.bank_details || "",
        bank_acc_no: res?.data?.bank_acc_no || "",
        bank_status: res?.data?.bank_status || "",
        bank_branch: res?.data?.bank_branch || "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Bank");
    }
  };
  useEffect(() => {
    if (!open || !isEdit) return;
    fetchBankData();
  }, [open, editId, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !formData.branch_short ||
      !formData.bank_name ||
      !formData.bank_acc_no ||
      !formData.bank_branch
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? BANK_API.updateById(editId) : BANK_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code == 201) {
        toast.success(
          res.message ??
            (isEdit ? "Bank created successfully" : "Bank updated successfully")
        );
        setOpen(false);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };
  if (error) return <ApiErrorPage onRetry={() => fetchBankData()} />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loadingData && <LoadingBar />}
      <DialogTrigger asChild>
        {isEdit ? (
          <BankEdit onClick={() => setOpen(true)} />
        ) : pathname === "/master/bank" ? (
          <BankCreate onClick={() => setOpen(true)} className="ml-2" />
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Bank" : "Create Bank"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {/* Company */}
          {!isEdit && (
            <div className="grid gap-1">
              <Label htmlFor="branch_short">Company *</Label>
              <Input
                id="branch_short"
                name="branch_short"
                value={formData?.branch_short || ""}
                onChange={handleChange}
                placeholder="Enter Company"
              />
            </div>
          )}

          {/* Bank Name */}
          <div className="grid gap-1">
            <Label htmlFor="bank_name">Bank Name *</Label>
            <Input
              id="bank_name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="Enter Bank Name"
            />
          </div>

          {/* Account No */}
          <div className="grid gap-1">
            <Label htmlFor="bank_acc_no">Account No *</Label>
            <Input
              id="bank_acc_no"
              name="bank_acc_no"
              value={formData.bank_acc_no}
              onChange={handleChange}
              placeholder="Enter Account Number"
            />
          </div>

          {/* Branch Name */}
          <div className="grid gap-1">
            <Label htmlFor="bank_branch">Branch Name *</Label>
            <Input
              id="bank_branch"
              name="bank_branch"
              value={formData.bank_branch}
              onChange={handleChange}
              placeholder="Enter Branch Name"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="bank_details">Bank Details</Label>
            <Input
              id="bank_details"
              name="bank_details"
              value={formData.bank_details}
              onChange={handleChange}
              placeholder="Enter Bank Details"
            />
          </div>
          {isEdit && (
            <Select
              value={formData.bank_status || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  bank_status: value,
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
              "Update Bank"
            ) : (
              "Create Bank"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
export default BankForm;
