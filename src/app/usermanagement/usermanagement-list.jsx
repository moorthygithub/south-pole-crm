import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { ExternalLink, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusToggle from "@/components/usermanagement/list/toggle";
import { TEAM_API } from "@/constants/apiConstants";

const UserManagementList = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: TEAM_API.list,
    queryKey: ["team-list"],
  });

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Company Name",
      accessorKey: "company_name",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "User Type",
      accessorKey: "user_type",
    },
    {
      header: "User Position",
      accessorKey: "user_position",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <StatusToggle
          initialStatus={row.original.status}
          teamId={row.original.id}
          onStatusChange={refetch}
        />
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/management-dashboard/${row.original.id}`)}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Dashboard
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingBar />;
  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      <DataTable
        title="Team List"
        data={data?.team || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search team..."
        toolbarRight={
          <>
            <Button
              variant="default"
              onClick={() => navigate("/page-management")}
              className="ml-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Page
            </Button>

            <Button
              key="button-management"
              variant="default"
              onClick={() => navigate("/button-management")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Button
            </Button>
          </>
        }
      />
    </>
  );
};

export default UserManagementList;
