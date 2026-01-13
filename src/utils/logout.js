import { LOGOUT } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { logout } from "@/store/auth/authSlice";
import { persistor } from "@/store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useAppLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trigger } = useApiMutation();

  const handleLogout = async () => {
    try {
      const res = await trigger({
        url: LOGOUT.logout,
        method: "POST",
      });

      if (res.code === 200) {
        //   localStorage.clear();

        //   await persistor.flush();
        //   dispatch(logout());

        //   navigate("/", { replace: true });

        //   setTimeout(() => {
        //     persistor.purge();
        //   }, 300);
        console.log("Logout");
      } else {
        toast.error("Failed to Logout");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to Logout");
    } finally {
      localStorage.clear();

      await persistor.flush();
      dispatch(logout());
      await persistor.purge();

      navigate("/", { replace: true });
    }
  };

  return handleLogout;
};

export default useAppLogout;
