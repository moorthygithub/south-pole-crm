import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import ApiErrorPage from "@/components/api-error/api-error";
import {
  PortofLoadingCreate,
  PortofLoadingEdit,
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
import { useApiMutation } from "@/hooks/useApiMutation";
import { PORT_API } from "@/constants/apiConstants";

const INITIAL_STATE = {
  portofLoading: "",
  portofLoadingCountry: "",
  portofLoading_status: "Active",
};

const PortofLoadingForm = ({ editId = null, onSuccess }) => {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { trigger, loading } = useApiMutation();
  const {
    trigger: fetchPortofLoading,
    loading: loadingData,
    error,
  } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchPortofLoading({ url: PORT_API.getById(editId) });
      setFormData({
        portofLoading: res?.data?.portofLoading || "",
        portofLoadingCountry: res?.data?.portofLoadingCountry || "",
        portofLoading_status: res?.data?.portofLoading_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Port");
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
    if (
      !formData.portofLoading.trim() ||
      !formData.portofLoadingCountry.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? PORT_API.updateById(editId) : PORT_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 201) {
        toast.success(
          res.message || isEdit
            ? "Port updated successfully"
            : "Port created successfully"
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
          {!isEdit && <PortofLoadingCreate className="ml-2" />}
          {isEdit && <PortofLoadingEdit />}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">
              {isEdit ? "Edit Port" : "Create Port"}
            </h4>
            <p className="text-sm text-muted-foreground">Enter Port details</p>
          </div>

          <div className="grid gap-2">
            <Input
              placeholder="Port of Loading"
              value={formData.portofLoading}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  portofLoading: e.target.value,
                }))
              }
              disabled={loadingData}
            />
            <Input
              placeholder="Loading Country"
              value={formData.portofLoadingCountry}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  portofLoadingCountry: e.target.value,
                }))
              }
              disabled={loadingData}
            />
            {isEdit && (
              <Select
                value={formData.portofLoading_status || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    portofLoading_status: value,
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
            <Button onClick={handleSubmit} disabled={loading || loadingData}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : isEdit ? (
                "Update Port"
              ) : (
                "Create Port"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PortofLoadingForm;
