import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  PrecarriageCreate,
  PrecarriageEdit,
} from "@/components/buttoncontrol/button-component";
import { PRECARRIAGES_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import ApiErrorPage from "@/components/api-error/api-error";

const INITIAL_STATE = {
  precarriage_name: "",
  precarriage_status: "Active",
};

const PrecarriageForm = ({ editId = null, onSuccess }) => {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const { trigger, loading } = useApiMutation();
  const {
    trigger: fetchPrecarriage,
    loading: loadingData,
    error,
  } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchPrecarriage({
        url: PRECARRIAGES_API.getById(editId),
      });
      setFormData({
        precarriage_name: res?.data?.precarriage_name || "",
        precarriage_status: res?.data?.precarriage_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Precarriage");
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
    if (!formData.precarriage_name.trim()) {
      toast.error("Precarriage name is required");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit
          ? PRECARRIAGES_API.updateById(editId)
          : PRECARRIAGES_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 200 || res.code === 201) {
        toast.success(
          res.message ??
            (isEdit
              ? "Precarriage updated successfully"
              : "Precarriage created successfully")
        );
        queryClient.invalidateQueries(["precarriage-list"]);
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
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          {!isEdit && pathname === "/master/precarriage" && (
            <PrecarriageCreate />
          )}
          {isEdit && pathname === "/master/precarriage" && <PrecarriageEdit />}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium text-lg">
              {isEdit ? "Edit Precarriage" : "Create Precarriage"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter precarriage details
            </p>
          </div>

          <div className="grid gap-2">
            <Input
              placeholder="Enter Precarriage Name"
              value={formData.precarriage_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  precarriage_name: e.target.value,
                }))
              }
              disabled={loadingData}
            />

            {isEdit && (
              <Select
                value={formData.precarriage_status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    precarriage_status: value,
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
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Precarriage"
              ) : (
                "Create Precarriage"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PrecarriageForm;
