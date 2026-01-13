import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sidebarData } from "@/config/pages";
import { TEAM_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ContextPanel } from "@/lib/context-panel";
import { Loader2 } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreatePage = () => {
  const navigate = useNavigate();
  const { fetchPagePermission } = useContext(ContextPanel);

  const [selectedPage, setSelectedPage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [userIds, setUserIds] = useState("1,2,3,4,5");
  const [status] = useState("Active");

  const { trigger, loading } = useApiMutation();

  const { pagePermissions: existingControls } = useSelector(
    (state) => state.permissions
  );
  const pages = useMemo(() => {
    const allPages = [];

    const extractPages = (items) => {
      items.forEach((item) => {
        if (item.url && item.url !== "#") {
          allPages.push({ title: item.title || item.name, url: item.url });
        }
        if (item.items) extractPages(item.items);
      });
    };

    extractPages(sidebarData.navMain);
    extractPages(
      sidebarData.projects.map((p) => ({ title: p.name, url: p.url }))
    );
    extractPages(
      sidebarData.userManagement.map((p) => ({ title: p.name, url: p.url }))
    );

    return allPages.filter(
      (page) =>
        !existingControls.some(
          (control) =>
            control.page === page.title ||
            control.url === page.url.replace("/", "")
        )
    );
  }, [existingControls]);

  const availablePages = useMemo(() => {
    return pages?.length ? ["All", ...pages.map((p) => p.title)] : [];
  }, [pages]);

  const handlePageChange = (value) => {
    setSelectedPage(value);

    if (value === "All") {
      setSelectedItems(pages);
    } else {
      const page = pages.find((p) => p.title === value);
      setSelectedItems(page ? [page] : []);
    }
  };

  const handleSubmit = async () => {
    if (!selectedItems.length) return;

    const payload = selectedItems.map((item) => ({
      page: item.title,
      url: item.url.replace("/", ""),
      userIds,
      status,
    }));

    try {
      await trigger({
        url: TEAM_API.create,
        method: "POST",
        data: { usercontrol_data: payload },
      });

      await fetchPagePermission();

      toast.success("Page Control Created", {
        description: "Permissions updated successfully",
      });

      navigate("/userManagement");
    } catch (error) {
      toast.error("Creation Failed", {
        description: error?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        <h2 className="text-xl font-semibold">Create Page Control</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Page</label>
            <Select value={selectedPage} onValueChange={handlePageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Page" />
              </SelectTrigger>
              <SelectContent>
                {availablePages?.map((page) => (
                  <SelectItem key={page} value={page}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">URL</label>
            <Input
              value={selectedItems.map((i) => i.url).join(", ")}
              readOnly
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">User IDs</label>
            <Input
              value={userIds}
              onChange={(e) => setUserIds(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <Input value={status} readOnly />
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left">Page</th>
                  <th className="px-4 py-2 text-left">URL</th>
                  <th className="px-4 py-2 text-left">User IDs</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.url.replace("/", "")}</td>
                    <td className="px-4 py-2">{userIds}</td>
                    <td className="px-4 py-2">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!selectedPage || loading}>
            {loading && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            )}
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
