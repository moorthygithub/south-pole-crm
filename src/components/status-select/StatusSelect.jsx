import { useState } from "react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatusSelect = ({
  initialStatus,
  apiUrl,
  payloadKey = "status",
  options = [],
  method = "PATCH",
  onSuccess,
  valueKey = "value",
  labelKey = "label",
}) => {
  const [status, setStatus] = useState(initialStatus);
  const { trigger, loading } = useApiMutation();

  const handleChange = async (newStatus) => {
    if (newStatus === status) return;

    try {
      const res = await trigger({
        url: apiUrl,
        method,
        data: {
          [payloadKey]: newStatus,
        },
      });

      if (res?.code === 201) {
        setStatus(newStatus);
        onSuccess?.();

        toast.success(res.message || "Status updated", {
          description: `Status changed to ${newStatus}`,
        });
      } else {
        toast.error(res?.message || "Unable to update status");
      }
    } catch (err) {
      toast.error(err?.message || "Unable to update status");
    }
  };

  return (
    <Select value={status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="h-7 px-2 text-xs w-[140px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        {options.map((item) => {
          const optionValue = item[valueKey];
          const optionLabel = item[labelKey];

          return (
            <SelectItem
              key={optionValue}
              value={optionValue}
              className="text-xs"
            >
              {optionLabel}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
