import { useContext, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TEAM_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ContextPanel } from "@/lib/context-panel";
import ButtonComponents from "@/components/buttoncontrol/button-component";

const CreateButton = () => {
  const navigate = useNavigate();
  const { fetchPermissions } = useContext(ContextPanel);

  const [selectedPage, setSelectedPage] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [userIds, setUserIds] = useState("1,2,3,4,5");
  const status = "Active";

  const { trigger, loading } = useApiMutation();
  const { buttonPermissions: existingControls } = useSelector(
    (state) => state.permissions
  );
  console.log(existingControls, "existingControls");
  const availablePages = useMemo(() => {
    const existingMap = new Map(
      existingControls.map((c) => [`${c.pages}-${c.button}`, true])
    );

    const buttons = Object.entries(ButtonComponents).map(
      ([name, component]) => ({
        name,
        page: component.page,
      })
    );

    const filtered = buttons.filter(
      (b) => !existingMap.has(`${b.page}-${b.name}`)
    );

    const pages = [...new Set(filtered.map((b) => b.page))];

    return pages.length ? ["All", ...pages] : [];
  }, [existingControls]);

  const handlePageChange = (value) => {
    setSelectedPage(value);
    setSelectedButton("");
    setSelectedItems([]);

    if (value === "All") {
      const existingMap = new Map(
        existingControls.map((c) => [`${c.pages}-${c.button}`, true])
      );

      const allButtons = Object.entries(ButtonComponents)
        .map(([name, component]) => ({
          name,
          page: component.page,
        }))
        .filter((b) => !existingMap.has(`${b.page}-${b.name}`));

      setSelectedItems(allButtons);
    }
  };

  const availableButtons = useMemo(() => {
    if (!selectedPage || selectedPage === "All") return [];

    const existingMap = new Map(
      existingControls.map((c) => [`${c.pages}-${c.button}`, true])
    );

    return Object.entries(ButtonComponents)
      .filter(
        ([name, component]) =>
          component.page === selectedPage &&
          !existingMap.has(`${selectedPage}-${name}`)
      )
      .map(([name]) => name);
  }, [selectedPage, existingControls]);

  const handleButtonChange = (value) => {
    setSelectedButton(value);

    if (value === "all") {
      const buttons = Object.entries(ButtonComponents)
        .filter(([, component]) => component.page === selectedPage)
        .map(([name, component]) => ({
          name,
          page: component.page,
        }));
      setSelectedItems(buttons);
    } else if (value) {
      setSelectedItems([
        {
          name: value,
          page: ButtonComponents[value].page,
        },
      ]);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedItems.length) return;

    const payload = selectedItems?.map((item) => ({
      pages: item.page,
      button: item.name,
      userIds,
      status,
    }));

    try {
      await trigger({
        url: TEAM_API.createbutton,
        method: "POST",
        data: { usercontrol_data: payload },
      });

      await fetchPermissions();

      toast.success("Button Control Created", {
        description: "Permissions updated successfully",
      });

      navigate("/userManagement");
    } catch (error) {
      toast.error("Creation Failed", {
        description: error?.message || "Something went wrong",
      });
    }
  };
  console.log(availablePages, "selectedPage");
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        <h2 className="text-xl font-semibold">Create Button Control</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Page</label>
            <Select value={selectedPage} onValueChange={handlePageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Page" />
              </SelectTrigger>
              <SelectContent>
                {availablePages.map((page) => (
                  <SelectItem key={page} value={page}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPage && selectedPage !== "All" && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Button</label>
              <Select value={selectedButton} onValueChange={handleButtonChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Button" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {availableButtons.map((btn) => (
                    <SelectItem key={btn} value={btn}>
                      {btn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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

        {selectedItems?.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left">Page</th>
                  <th className="px-4 py-2 text-left">Button</th>
                  <th className="px-4 py-2 text-left">User IDs</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{item.page}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{userIds}</td>
                    <td className="px-4 py-2">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!selectedItems.length || loading}
          >
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

export default CreateButton;
