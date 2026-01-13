import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { useApiMutation } from "@/hooks/useApiMutation";
import { TEAM_API } from "@/constants/apiConstants";

const StatusToggle = ({ initialStatus, teamId, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);

  const { trigger, loading } = useApiMutation();

  const handleToggle = async () => {
    const newStatus = status === "Active" ? "Inactive" : "Active";

    try {
      const res = await trigger({
        url: TEAM_API.updateStatus(teamId),
        method: "PUT",
        data: { status: newStatus },
      });

      setStatus(newStatus);
      onStatusChange?.(newStatus);
      if (res.code == 200) {
        toast.success(res.msg || "Status Updated", {
          description: `Team status changed to ${newStatus}`,
        });
      } else {
        toast.error(res.msg || "Update Failed", {
          description: "Unable to update team status",
        });
      }
    } catch (error) {
      toast.error(error.message || "Update Failed", {
        description: "Unable to update team status",
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

export default StatusToggle;
