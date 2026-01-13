import {
  PaymentTermCreate,
  PaymentTermEdit,
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
import { Textarea } from "@/components/ui/textarea";
import { PAYMENTTERM_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const INITIAL_STATE = {
  paymentTerms_short: "",
  paymentTerms: "",
  paymentTerms_dp: "",
  paymentTerms_da: "",
  paymentTerms_lc: "",
  paymentTerms_advance: "",
  paymentTerms_status: "Active",
};
const PaymentTermForm = React.memo(function PaymentTermForm({ editId }) {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const { trigger: fetchPaymentTerm, loading: loadingData } = useApiMutation();
  const { trigger, loading } = useApiMutation();

  const fetchPaymentTermData = async () => {
    try {
      const res = await fetchPaymentTerm({
        url: PAYMENTTERM_API.getById(editId),
      });

      setFormData({
        paymentTerms_short: res?.data?.paymentTerms_short || "",
        paymentTerms: res?.data?.paymentTerms || "",
        paymentTerms_dp: res?.data?.paymentTerms_dp || "",
        paymentTerms_da: res?.data?.paymentTerms_da || "",
        paymentTerms_lc: res?.data?.paymentTerms_lc || "",
        paymentTerms_advance: res?.data?.paymentTerms_advance || "",
        paymentTerms_status: res?.data?.paymentTerms_status || "Active",
      });
    } catch (err) {
      toast.error("Failed to load Payment Term");
    }
  };

  useEffect(() => {
    if (!open || !isEdit) return;
    fetchPaymentTermData();
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
    if (!formData.paymentTerms_short || !formData.paymentTerms) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit
          ? PAYMENTTERM_API.updateById(editId)
          : PAYMENTTERM_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res?.code == 201) {
        toast.success(
          res.message || isEdit
            ? "Payment Term updated successfully"
            : "Payment Term created successfully"
        );
        setOpen(false);
        await queryClient.invalidateQueries(["payemntterm-list"]);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loadingData && <LoadingBar />}

      <DialogTrigger asChild>
        {isEdit ? (
          <PaymentTermEdit onClick={() => setOpen(true)} />
        ) : pathname === "/master/payment-term" ? (
          <PaymentTermCreate onClick={() => setOpen(true)} />
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Payment Term" : "Create Payment Term"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Single grid */}
          <div className="grid gap-1">
            <Label>Payment Term Short *</Label>
            <Input
              name="paymentTerms_short"
              value={formData.paymentTerms_short}
              onChange={handleChange}
              placeholder="Eg: FOB"
            />
          </div>

          <div className="grid gap-1">
            <Label>Payment Term *</Label>
            <Textarea
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              placeholder="Enter payment term"
            />
          </div>

          {/* Two column grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>DP</Label>
              <Input
                name="paymentTerms_dp"
                value={formData.paymentTerms_dp}
                onChange={handleNumberChange}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-1">
              <Label>DA</Label>
              <Input
                name="paymentTerms_da"
                value={formData.paymentTerms_da}
                onChange={handleNumberChange}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-1">
              <Label>LC</Label>
              <Input
                name="paymentTerms_lc"
                value={formData.paymentTerms_lc}
                onChange={handleNumberChange}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-1">
              <Label>Advance</Label>
              <Input
                name="paymentTerms_advance"
                value={formData.paymentTerms_advance}
                onChange={handleNumberChange}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Status */}
          {isEdit && (
            <>
              <Label>Status</Label>

              <Select
                value={formData.paymentTerms_status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentTerms_status: value,
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
            </>
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
              "Update Payment Term"
            ) : (
              "Create Payment Term"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default PaymentTermForm;
