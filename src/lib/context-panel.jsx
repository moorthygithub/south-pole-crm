import CryptoJS from "crypto-js";
import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PANEL_CHECK, USERMANAGEMENT } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { logout } from "@/store/auth/authSlice";
import { setCompanyDetails, setCompanyImage } from "@/store/auth/companySlice";
import { setShowUpdateDialog } from "@/store/auth/versionSlice";
import {
  setButtonPermissions,
  setPagePermissions,
} from "@/store/permissions/permissionSlice";
import { persistor } from "@/store/store";
import appLogout from "@/utils/logout";

export const ContextPanel = createContext();

const secretKey = import.meta.env.VITE_SECRET_KEY;
const validationKey = import.meta.env.VITE_SECRET_VALIDATION;

const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const Logout = appLogout();
  const { trigger } = useApiMutation();
  const { trigger: Controltrigger, loading, error } = useApiMutation();
  const company = useSelector(
    (state) => state?.company?.companyDetails?.company_name
  );
  // console.log(company, "company in contecxt");
  const token = useSelector((state) => state.auth.token);
  const localVersion = useSelector((state) => state.auth?.version);
  // const staticUsers = useSelector((state) => state.users?.users);

  const [isPanelUp, setIsPanelUp] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const fetchPagePermission = async () => {
    try {
      const res = await Controltrigger({ url: USERMANAGEMENT.pageControl });

      const permissions = res?.pagePermissions || [];
      dispatch(setPagePermissions(permissions));
    } catch (error) {
      console.error("error", error.messaage);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await Controltrigger({ url: USERMANAGEMENT.buttonControl });
      dispatch(setButtonPermissions(res?.buttonPermissions || []));
    } catch (err) {
      console.error(err.messaage);
    }
  };

  // const getStaticUsers = () => {
  //   try {
  //     const users = localStorage.getItem("allUsers");
  //     return users ? JSON.parse(users) : [];
  //   } catch {
  //     return [];
  //   }
  // };

  const handleCriticalError = (msg) => {
    toast.error(msg);
    dispatch(logout());
    persistor.purge();
    navigate("/maintenance");
  };

  const initializeApp = async () => {
    try {
      if (!secretKey || !validationKey) {
        throw new Error("Missing environment variables");
      }

      const panelRes = await trigger({ url: PANEL_CHECK.getPanelStatus });
      if (panelRes?.success !== "ok") {
        throw new Error("Panel check failed");
      }

      setIsPanelUp(true);
      // console.log(panelRes);
      if (panelRes?.code == 201) {
        // console.log(panelRes?.company_detils, "panelRes?.company_detils)");

        dispatch(setCompanyDetails(panelRes?.company_detils));

        // dispatch(setCompanyImage(panelRes.company_image));
      }

      // console.log(company, "company");
      const serverVersion = panelRes?.version?.version_panel;
      if (token) {
        dispatch(
          setShowUpdateDialog({
            showUpdateDialog: localVersion !== serverVersion,
            version: serverVersion,
          })
        );
      }

      const envRes = await trigger({ url: PANEL_CHECK.getEnvStatus });
      const computedHash = CryptoJS.MD5(validationKey).toString();

      if (envRes?.hashKey !== computedHash) {
        throw new Error("Environment validation failed");
      }

      if (location.pathname === "/maintenance") {
        navigate("/");
      }

      setInitialized(true);
    } catch (error) {
      handleCriticalError(error.message);
    }
  };
  useEffect(() => {
    if (!token) return;

    // getStaticUsers();
    fetchPagePermission();
    fetchPermissions();
  }, [token]);

  const pollPanelStatus = async () => {
    try {
      const res = await trigger({ url: PANEL_CHECK.getPanelStatus });
      if (res?.message !== "Success") throw new Error();
      setIsPanelUp(true);
    } catch {
      setIsPanelUp(false);
      await Logout();
      navigate("/maintenance");
    }
  };

  useEffect(() => {
    initializeApp();
    const interval = setInterval(pollPanelStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!initialized) return null;

  return (
    <ContextPanel.Provider
      value={{
        isPanelUp,
        fetchPagePermission,
        fetchPermissions,
        // getStaticUsers,
      }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
