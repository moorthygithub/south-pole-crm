import {
  MarkingCreate,
  MarkingEdit
} from "@/components/buttoncontrol/button-component";
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
import { MARKING_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
const INITIAL_STATE = {
  marking: "",
  marking_status: "Active",
};
const MarkingForm = ({ editId = null }) => {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const { trigger, loading } = useApiMutation();
  const { trigger: fetchMarking, loading: loadingData } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchMarking({
        url: MARKING_API.getById(editId),
      });

      setFormData({
        marking: res?.data?.marking || "",
        marking_status: res?.data?.marking_status || "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Marking");
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_STATE);
      return;
    }

    if (open && isEdit) {
      fetchData();
    }
  }, [open, editId]);

  const handleSubmit = async () => {
    if (!formData.marking.trim()) {
      toast.error("Marking is required");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? MARKING_API.updateById(editId) : MARKING_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code == 201) {
        toast.success(
          res.msg || isEdit
            ? "Marking updated successfully"
            : "Marking updated successfully"
        );
        await queryClient.invalidateQueries(["marking-list"]);
        setOpen(false);
      } else {
        toast.error(res.msg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          {!isEdit && (
            <MarkingCreate
              onClick={() => setOpen(true)}
              className="ml-2"
            />
          )}

          {isEdit && <MarkingEdit onClick={() => setOpen(true)} />}

          {pathname === "/create-contract" && (
            <p
              className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              {isEdit ? "Edit Marking" : "Create Marking"}
            </p>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">
              {isEdit ? "Edit Marking" : "Create Marking"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter marking details
            </p>
          </div>

          <div className="grid gap-2">
            <Input
              placeholder="Enter Marking"
              value={formData.marking}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  marking: e.target.value,
                }))
              }
              disabled={loadingData}
            />
            {isEdit && (
              <Select
                value={formData.marking_status || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    marking_status: value,
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
                "Update Marking"
              ) : (
                "Create Marking"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MarkingForm;
