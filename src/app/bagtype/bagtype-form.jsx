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
  BagTypeCreate,
  BagTypeEdit,
} from "@/components/buttoncontrol/button-component";
import { BAG_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INITIAL_STATE = {
  bagType: "",
  bagType_status: "Active",
};

const BagTypeForm = ({ editId = null }) => {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const { trigger, loading } = useApiMutation();
  const { trigger: fetchBagType, loading: loadingData } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchBagType({
        url: BAG_API.getById(editId),
      });

      setFormData({
        bagType: res?.data?.bagType || "",
        bagType_status: res?.data?.bagType_status || "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Bag Type");
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
    if (!formData.bagType.trim()) {
      toast.error("Bag Type is required");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? BAG_API.updateById(editId) : BAG_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code == 201) {
        toast.success(
          res.msg || isEdit
            ? "Bag Type updated successfully"
            : "Bag Type updated successfully"
        );
        await queryClient.invalidateQueries(["bag-type-list"]);
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
          {!isEdit && pathname === "/master/bag-type" && (
            <BagTypeCreate onClick={() => setOpen(true)} className="ml-2" />
          )}

          {isEdit && pathname === "/master/bag-type" && (
            <BagTypeEdit onClick={() => setOpen(true)} />
          )}

          {pathname === "/create-contract" && (
            <p
              className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              {isEdit ? "Edit Bag Type" : "Create Bag Type"}
            </p>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">
              {isEdit ? "Edit Bag Type" : "Create Bag Type"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter bag type details
            </p>
          </div>

          <div className="grid gap-2">
            <Input
              placeholder="Enter Bag Type"
              value={formData.bagType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bagType: e.target.value,
                }))
              }
              disabled={loadingData}
            />
            {isEdit && (
              <Select
                value={formData.bagType_status || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    bagType_status: value,
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
                "Update Bag Type"
              ) : (
                "Create Bag Type"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BagTypeForm;
