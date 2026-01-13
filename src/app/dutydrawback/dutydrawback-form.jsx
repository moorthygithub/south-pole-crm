"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DUTYDRAWBACK_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";

const INITIAL_STATE = {
  invoice_dd_scroll_no: "",
  invoice_dd_date: "",
  invoice_dd_status: "Pending",
};

const DutyDrawbackForm = ({ editId }) => {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const { trigger, loading } = useApiMutation();
  const { trigger: fetchDataApi, loading: loadingData } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchDataApi({
        url: DUTYDRAWBACK_API.getById(editId),
      });

      setFormData({
        invoice_dd_scroll_no: res?.data?.invoice_dd_scroll_no || "",
        invoice_dd_date: res?.data?.invoice_dd_date || "",
        invoice_dd_status: res?.data?.invoice_dd_status || "Pending",
      });
    } catch (err) {
      toast.error(err?.message || "Failed to load Duty Drawback");
    }
  };

  useEffect(() => {
    if (!open) return;

    if (open && isEdit) fetchData();
  }, [open, editId]);

  const handleSubmit = async () => {
    if (
      !formData.invoice_dd_scroll_no.trim() ||
      !formData.invoice_dd_date.trim()
    ) {
      toast.error("Scroll No and Date are required");
      return;
    }

    try {
      const res = await trigger({
        url: DUTYDRAWBACK_API.updateById(editId),
        method: "PUT",
        data: formData,
      });

      if (res.code === 201) {
        toast.success("Duty Drawback updated successfully");
        setOpen(false);
      } else {
        toast.error(res.msg || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium">{isEdit ? "Edit Duty Drawback" : ""}</h4>

          <Input
            placeholder="Scroll No"
            value={formData.invoice_dd_scroll_no}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                invoice_dd_scroll_no: e.target.value,
              }))
            }
            disabled={loadingData}
          />
          <Input
            type="date"
            placeholder="Date"
            value={formData.invoice_dd_date}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                invoice_dd_date: e.target.value,
              }))
            }
            disabled={loadingData}
          />

          <Select
            value={formData.invoice_dd_status || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, invoice_dd_status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSubmit} disabled={loading || loadingData}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Duty Drawback"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DutyDrawbackForm;
