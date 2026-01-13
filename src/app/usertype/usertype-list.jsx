import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { USERTYPE } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { encryptId } from "@/utils/encyrption/Encyrption";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserTypeList = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState({});

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: USERTYPE.getlist,
    queryKey: ["user-type-list"],
  });

  const toggleRow = (key) => {
    setExpandedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatRoleList = (roles) => {
    if (!roles) return "N/A";
    return roles.split(",").map((role) => (
      <span
        key={role}
        className="inline-block bg-green-100 rounded px-2 py-1 m-1 text-sm"
      >
        {role.trim()}
      </span>
    ));
  };

  const columns = [
    {
      header: "User Type",
      accessorKey: "user_type",
    },
    {
      header: "Role",
      accessorKey: "user_role",
    },
    {
      header: "User Position",
      accessorKey: "user_position",
    },
    {
      header: "Default Button",
      accessorKey: "default_button_role",
      cell: ({ getValue }) =>
        getValue() ? `${getValue().slice(0, 50)}...` : "N/A",
    },
    {
      header: "Default Page",
      accessorKey: "default_page_role",
      cell: ({ getValue }) =>
        getValue() ? `${getValue().slice(0, 50)}...` : "N/A",
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            navigate(`/edit-user-type/${row.original.id}`);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) return <LoadingBar />;
  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      <DataTable
        data={data?.userType || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search user type..."
        expandableRow={(row) => (
          <div className="space-y-4">
            {row.default_button_role && (
              <div>
                <div className="font-semibold mb-2">Default Button Roles</div>
                <div className="flex flex-wrap gap-2">
                  {formatRoleList(row.default_button_role)}
                </div>
              </div>
            )}

            {row.default_page_role && (
              <div>
                <div className="font-semibold mb-2">Default Page Roles</div>
                <div className="flex flex-wrap gap-2">
                  {formatRoleList(row.default_page_role)}
                </div>
              </div>
            )}
          </div>
        )}
      />
    </>
  );
};

export default UserTypeList;
