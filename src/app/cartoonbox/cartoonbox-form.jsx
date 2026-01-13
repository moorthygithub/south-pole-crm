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
  CartonBoxCreate,
  CartonBoxEdit,
  ContainerSizeCreate,
  ContainerSizeEdit,
} from "@/components/buttoncontrol/button-component";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CARTONBOX_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";

const INITIAL_STATE = {
  cartonbox: "",
  cartonbox_weight: "",
  cartonbox_status: "Active",
};

const CartonBoxForm = ({ editId = null }) => {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const { trigger, loading } = useApiMutation();
  const { trigger: fetchCartonBox, loading: loadingData } = useApiMutation();

  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_STATE);
      return;
    }

    if (open && isEdit) {
      fetchCartonBox({ url: CARTONBOX_API.getById(editId) })
        .then((res) =>
          setFormData({
            cartonbox: res?.data?.cartonbox || "",
            cartonbox_weight: res?.data?.cartonbox_weight || "",
            cartonbox_status: res?.data?.cartonbox_status || "Active",
          })
        )
        .catch(() => toast.error("Failed to load Carton Box"));
    }
  }, [open, editId]);

  const handleSubmit = async () => {
    if (!formData.cartonbox.trim()) {
      toast.error("Carton Box is required");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? CARTONBOX_API.updateById(editId) : CARTONBOX_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res?.code === 201) {
        toast.success(
          res.message ??
            (isEdit
              ? "Carton Box updated successfully"
              : "Carton Box created successfully")
        );
        await queryClient.invalidateQueries(["cartonbox-list"]);
        setOpen(false);
      } else {
        toast.error(res?.msg || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          {!isEdit && <CartonBoxCreate onClick={() => setOpen(true)} />}
          {isEdit && <CartonBoxEdit onClick={() => setOpen(true)} />}
          {pathname === "/create-contract" && (
            <p
              className="text-xs text-yellow-700 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              {isEdit ? "Edit Carton Box" : "Create Carton Box"}
            </p>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div>
            <h4 className="font-medium">
              {isEdit ? "Edit Carton Box" : "Create Carton Box"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter carton box details
            </p>
          </div>

          <Input
            placeholder="Carton Box"
            value={formData.cartonbox}
            onChange={(e) =>
              setFormData((p) => ({ ...p, cartonbox: e.target.value }))
            }
            disabled={loadingData}
          />

          <Input
            placeholder="Weight"
            value={formData.cartonbox_weight}
            onChange={(e) =>
              setFormData((p) => ({ ...p, cartonbox_weight: e.target.value }))
            }
          />

          {isEdit && (
            <Select
              value={formData.cartonbox_status}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, cartonbox_status: v }))
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
              "Update Carton Box"
            ) : (
              "Create Carton Box"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CartonBoxForm;
