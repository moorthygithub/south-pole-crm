import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import ApiErrorPage from "@/components/api-error/api-error";
import {
  GRCodeCreate,
  GRCodeEdit,
} from "@/components/buttoncontrol/button-component";
import LoadingBar from "@/components/loader/loading-bar";
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
import { Textarea } from "@/components/ui/textarea";
import { GRCODE_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";

const INITIAL_STATE = {
  product_name: "",
  gr_code_des: "",
  gr_code_status: "Active",
};

const GrCodeForm = ({ editId = null, onSuccess }) => {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const queryClient = useQueryClient();

  const { trigger, loading } = useApiMutation();
  const {
    trigger: fetchGRCODE,
    loading: loadingData,
    error,
  } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchGRCODE({ url: GRCODE_API.getById(editId) });
      setFormData({
        product_name: res?.data?.product_name || "",
        gr_code_des: res?.data?.gr_code_des || "",
        gr_code_status: res?.data?.gr_code_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Gr Code");
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_STATE);
      return;
    }
    if (open && isEdit) fetchData();
  }, [open, editId]);

  const handleSubmit = async () => {
    if (!formData.product_name.trim() || !formData.gr_code_des.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? GRCODE_API.updateById(editId) : GRCODE_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 201) {
        toast.success(
          res.message || isEdit
            ? "Gr Code updated successfully"
            : "Gr Code created successfully"
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

  if (error) return <ApiErrorPage onRetry={fetchData} />;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {loadingData && <LoadingBar />}
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          {!isEdit && <GRCodeCreate className="ml-2" />}
          {isEdit && <GRCodeEdit />}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">
              {isEdit ? "Edit Gr Code" : "Create Gr Code"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter Gr Code details
            </p>
          </div>

          <div className="grid gap-2">
            <Input
              placeholder="Product Name"
              value={formData.product_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  product_name: e.target.value,
                }))
              }
              disabled={loadingData}
            />
            <Textarea
              placeholder="Description"
              value={formData.gr_code_des}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  gr_code_des: e.target.value,
                }))
              }
              disabled={loadingData}
            />
            {isEdit && (
              <Select
                value={formData.gr_code_status || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gr_code_status: value }))
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
            <Button onClick={handleSubmit} disabled={loading || loadingData}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : isEdit ? (
                "Update Gr Code"
              ) : (
                "Create Gr Code"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GrCodeForm;
