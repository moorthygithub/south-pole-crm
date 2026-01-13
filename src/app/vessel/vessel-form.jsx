import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

import {
  VesselCreate,
  VesselEdit,
} from "@/components/buttoncontrol/button-component";
import { VESSEL_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";

const INITIAL_STATE = {
  vessel_name: "",
  vessel_status: "Active",
};

const VesselForm = ({ editId = null }) => {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const { trigger, loading } = useApiMutation();
  const { trigger: fetchVessel, loading: loadingData } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchVessel({
        url: VESSEL_API.getById(editId),
      });

      setFormData({
        vessel_name: res?.data?.vessel_name || "",
        vessel_status: res?.data?.vessel_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Vessel");
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
    if (!formData.vessel_name.trim()) {
      toast.error("Vessel name is required");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? VESSEL_API.updateById(editId) : VESSEL_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 200 || res.code === 201) {
        toast.success(
          isEdit ? "Vessel updated successfully" : "Vessel created successfully"
        );
        await queryClient.invalidateQueries(["vessel-list"]);
        setOpen(false);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          {!isEdit && pathname === "/master/vessel" && (
            <VesselCreate onClick={() => setOpen(true)} className="ml-2" />
          )}

          {isEdit && pathname === "/master/vessel" && (
            <VesselEdit onClick={() => setOpen(true)} />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">
              {isEdit ? "Edit Vessel" : "Create Vessel"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter vessel details
            </p>
          </div>

          <div className="grid gap-2">
            <Input
              placeholder="Enter Vessel Name"
              value={formData.vessel_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vessel_name: e.target.value,
                }))
              }
              disabled={loadingData}
            />

            {isEdit && (
              <Select
                value={formData.vessel_status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    vessel_status: value,
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
                "Update Vessel"
              ) : (
                "Create Vessel"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VesselForm;
