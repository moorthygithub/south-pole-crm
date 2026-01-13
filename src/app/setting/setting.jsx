import ApiErrorPage from "@/components/api-error/api-error";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROFILE } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useTheme } from "@/lib/theme-context";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { trigger: UpdateTrigger, loading: updateloading } = useApiMutation();
  const { trigger: UpdatePassword, loading: passwordloading } =
    useApiMutation();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
  });

  const {
    data,
    loadiong: isLoading,
    error: isError,
    refetch,
  } = useGetApiMutation({
    url: PROFILE.getlist,
    queryKey: ["peofile"],
  });
  useEffect(() => {
    if (data?.profile) {
      setProfile({
        name: data.profile.name || "",
        email: data.profile.email || "",
        mobile: data.profile.mobile || "",
      });
    }
  }, [data]);
  const handleProfileUpdate = async () => {
    if (!profile.name || !profile.email || !profile.mobile) {
      toast.error("Please fill all profile fields");
      return;
    }

    try {
      const res = await UpdateTrigger({
        url: PROFILE.updateById,
        method: "PUT",
        data: profile,
      });

      if (res?.code === 200) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(res?.msg || "Profile update failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!password.old_password || !password.new_password) {
      toast.error("Please fill all password fields");
      return;
    }

    if (password.new_password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await UpdatePassword({
        url: PROFILE.chnagepassword,
        method: "POST",
        data: password,
      });

      if (res?.code === 200) {
        toast.success("Password updated successfully");
        setPassword({ old_password: "", new_password: "" });
      } else {
        toast.error(res?.msg || "Password update failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) return <LoadingBar />;
  if (isError) return <ApiErrorPage onRetry={refetch} />;
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile + Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Profile</h3>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled
            />

            <Input
              placeholder="Email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <Input
              placeholder="Mobile"
              value={profile.mobile}
              onChange={(e) =>
                setProfile({ ...profile, mobile: e.target.value })
              }
            />

            <Button onClick={handleProfileUpdate} disabled={updateloading}>
              {updateloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Old Password"
              value={password.old_password}
              onChange={(e) =>
                setPassword({
                  ...password,
                  old_password: e.target.value,
                })
              }
            />

            <Input
              type="password"
              placeholder="New Password"
              value={password.new_password}
              onChange={(e) =>
                setPassword({
                  ...password,
                  new_password: e.target.value,
                })
              }
            />

            <Button onClick={handlePasswordUpdate} disabled={passwordloading}>
              {passwordloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Appearance</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your preferred theme
        </p>

        <div className="flex gap-4 flex-wrap">
          {["default", "yellow", "green", "purple", "teal", "gray"].map(
            (color) => {
              const colorMap = {
                default: "bg-blue-600",
                yellow: "bg-yellow-500",
                green: "bg-green-600",
                purple: "bg-purple-600",
                teal: "bg-teal-600",
                gray: "bg-gray-600",
              };

              const isActive = theme === color;

              return (
                <button
                  key={color}
                  onClick={() => setTheme(color)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition
                    ${colorMap[color]}
                    ${
                      isActive
                        ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                        : "opacity-80 hover:opacity-100"
                    }`}
                >
                  {isActive && <Check className="h-4 w-4 text-white" />}
                </button>
              );
            }
          )}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Current theme: <span className="capitalize">{theme}</span>
        </p>
      </div>
    </div>
  );
};

export default Settings;
