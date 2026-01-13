import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { USERTYPE } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { toast } from "sonner";

const EditUserType = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { pagePermissions, buttonPermissions } = useSelector(
    (state) => state.permissions
  );

  const [userData, setUserData] = useState(null);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  const { trigger, loading } = useApiMutation();

  const pageOptions = pagePermissions.map((page) => ({
    value: page.url,
    label: page.page,
  }));

  const groupedButtonOptions = buttonPermissions.reduce((acc, curr) => {
    if (!acc[curr.pages]) acc[curr.pages] = [];
    acc[curr.pages].push({
      value: curr.button,
      label: curr.button,
    });
    return acc;
  }, {});

  const buttonOptions = Object.keys(groupedButtonOptions).map((key) => ({
    label: key,
    options: groupedButtonOptions[key],
  }));

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const res = await trigger({
          url: USERTYPE.getById(id),
          method: "GET",
        });

        const data = res?.userType;
        setUserData(data);

        if (data?.default_button_role) {
          const values = data.default_button_role.split(",");
          setSelectedButtons(
            buttonPermissions
              .map((b) => ({ value: b.button, label: b.button }))
              .filter((opt) => values.includes(opt.value))
          );
        }

        if (data?.default_page_role) {
          const values = data.default_page_role.split(",");
          setSelectedPages(
            pageOptions.filter((opt) => values.includes(opt.value))
          );
        }
      } catch (error) {
        toast.error(error.message || "Failed to load user type");
      }
    };

    fetchUserType();
  }, [id]);

  /* ------------------ Submit ------------------ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedButtons.length || !selectedPages.length) {
      toast.error("Select at least one button and one page");
      return;
    }

    const payload = {
      default_button_role: selectedButtons.map((b) => b.value).join(","),
      default_page_role: selectedPages.map((p) => p.value).join(","),
    };

    try {
      const res = await trigger({
        url: USERTYPE.updateById(id),
        method: "PUT",
        data: payload,
      });
      if (res.code == 200) {
        toast.success(res.msg || "User type updated successfully");

        navigate("/user-type");
      } else {
        toast.error(res.msg || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingBar />;

  return (
    <>
      <div className="p-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-semibold">
              Edit User Type: {userData?.user_position}
            </h2>
            <Button variant="ghost" onClick={() => navigate("/user-type")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Role */}
            <div>
              <label className="text-sm font-medium">User Role</label>
              <Input
                value={userData?.user_role || ""}
                disabled
                className="mt-1"
              />
            </div>

            {/* Button Permissions */}
            <div>
              <label className="text-sm font-medium">Button Permissions</label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={buttonOptions}
                value={selectedButtons}
                onChange={setSelectedButtons}
                placeholder="Select button permissions"
                className="mt-1"
              />
            </div>

            {/* Page Permissions */}
            <div>
              <label className="text-sm font-medium">Page Permissions</label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={pageOptions}
                value={selectedPages}
                onChange={setSelectedPages}
                placeholder="Select page permissions"
                className="mt-1"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserType;
