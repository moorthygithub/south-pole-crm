import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import ApiErrorPage from "@/components/api-error/api-error";
import {
    PreRecepitCreate,
    PreRecepitEdit
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
import { PRERECEIPTS_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";

const INITIAL_STATE = {
  prereceipts_name: "",
  prereceipts_status: "Active",
};
const PreReceiptsForm = ({ editId = null, onSuccess }) => {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { trigger, loading } = useApiMutation();
  const {
    trigger: fetchPreRecepits,
    loading: loadingData,
    error,
  } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchPreRecepits({
        url: PRERECEIPTS_API.getById(editId),
      });
      setFormData({
        prereceipts_name: res?.data?.prereceipts_name || "",
        prereceipts_status: res?.data?.prereceipts_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Pre Recepits");
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
    if (!formData.prereceipts_name.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit
          ? PRERECEIPTS_API.updateById(editId)
          : PRERECEIPTS_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 201) {
        toast.success(
          res.message || isEdit
            ? "Pre Recepits updated successfully"
            : "Pre Recepits created successfully"
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
          {!isEdit && <PreRecepitCreate className="ml-2" />}
          {isEdit && <PreRecepitEdit />}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">
              {isEdit ? "Edit Pre Recepits" : "Create Pre Recepits"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter Pre Recepits details
            </p>
          </div>

          <div className="grid gap-2">
            <Input
              placeholder="Name"
              value={formData.prereceipts_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prereceipts_name: e.target.value,
                }))
              }
              disabled={loadingData}
            />

            {isEdit && (
              <Select
                value={formData.prereceipts_status || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    prereceipts_status: value,
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
                "Update Pre Recepits"
              ) : (
                "Create Pre Recepits"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PreReceiptsForm;
