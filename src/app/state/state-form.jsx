import ApiErrorPage from "@/components/api-error/api-error";
import {
  StateCreate,
  StateEdit,
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
import { STATE_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const INITIAL_STATE = {
  state_name: "",
  state_short_name: "",
  state_no: "",
  state_status: "Active",
};

const StateForm = React.memo(function StateForm({ editId, onSuccess }) {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { pathname } = useLocation();

  const { trigger: fetchState, loading: loadingData, error } = useApiMutation();
  const { trigger, loading } = useApiMutation();

  const fetchStateData = async () => {
    try {
      const res = await fetchState({
        url: STATE_API.getById(editId),
      });

      setFormData({
        state_name: res?.data?.state_name || "",
        state_short_name: res?.data?.state_short_name || "",
        state_no: res?.data?.state_no || "",
        state_status: res?.data?.state_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load State");
    }
  };

  useEffect(() => {
    if (!open || !isEdit) return;
    fetchStateData();
  }, [open, editId, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.state_no || !formData.state_short_name) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? STATE_API.updateById(editId) : STATE_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 201) {
        toast.success(
          res.message ??
            (isEdit
              ? "State updated successfully"
              : "State created successfully")
        );
        setOpen(false);
        onSuccess();
        setFormData(INITIAL_STATE);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (error) return <ApiErrorPage onRetry={fetchStateData} />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loadingData && <LoadingBar />}

      <DialogTrigger asChild>
        {isEdit ? (
          <StateEdit onClick={() => setOpen(true)} />
        ) : pathname === "/master/state" ? (
          <StateCreate onClick={() => setOpen(true)} className="ml-2" />
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit State" : "Create State"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {!isEdit && (
            <div className="grid gap-1">
              <Label>State Name *</Label>
              <Input
                name="state_name"
                value={formData.state_name}
                onChange={handleChange}
                placeholder="Enter State Name"
              />
            </div>
          )}

          <div className="grid gap-1">
            <Label>State No *</Label>
            <Input
              name="state_no"
              value={formData.state_no}
              onChange={handleChange}
              placeholder="Enter State Number"
            />
          </div>

          <div className="grid gap-1">
            <Label>Short Name *</Label>
            <Input
              name="state_short_name"
              value={formData.state_short_name}
              onChange={handleChange}
              placeholder="Enter Short Name"
            />
          </div>

          {isEdit && (
            <div className="grid gap-1">
              <Label>Status</Label>
              <Select
                value={formData.state_status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, state_status: value }))
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
            </div>
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
              "Update State"
            ) : (
              "Create State"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default StateForm;
