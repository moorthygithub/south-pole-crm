import { GRCODE_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GrCodeStatusToggle = ({ initialStatus, grcodeId, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const { trigger, loading } = useApiMutation();

  const handleToggle = async () => {
    const newStatus = status === "Active" ? "Inactive" : "Active";
    console.log(newStatus, "newStatus");
    try {
      const res = await trigger({
        url: GRCODE_API.updateStatus(grcodeId),
        method: "patch",
        data: { gr_code_status: newStatus },
      });
      if (res.code === 201) {
        setStatus(newStatus);
        onStatusChange?.(newStatus);

        toast.success(res.message || "Status Updated", {
          description: `GR Code status changed to ${newStatus}`,
        });
      } else {
        toast.error(res.message || "Update Failed", {
          description: "Unable to update GR Code status",
        });
      }
    } catch (error) {
      toast.error(error.message || "Update Failed", {
        description: "Unable to update GR Code status",
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded
        ${
          status === "Active"
            ? "text-green-800 hover:bg-green-100"
            : "text-red-800 hover:bg-red-100"
        } transition-colors`}
    >
      <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      <span>{status}</span>
    </button>
  );
};

export default GrCodeStatusToggle;
