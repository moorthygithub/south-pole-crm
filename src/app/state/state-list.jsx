import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import ToggleStatus from "@/components/common/status-toggle";
import LoadingBar from "@/components/loader/loading-bar";
import { STATE_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useMemo, useState } from "react";
import StateForm from "./state-form";

const StateList = () => {


  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: STATE_API.getlist,
    queryKey: ["state-list"],
  });
  const [open, setOpen] = useState(false);
  const columns = [
    {
      header: "State No",
      accessorKey: "state_no",
    },
    {
      header: "State Name",
      accessorKey: "state_name",
    },
    {
      header: "Short Name",
      accessorKey: "state_short_name",
    },
    {
      header: "Status",
      accessorKey: "state_status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.state_status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.state_status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <StateForm editId={row.original.id} onSuccess={refetch} />
      ),
    },
  ];

  if (isError) return <ApiErrorPage onRetry={refetch} />;
  return (
    <>
      {isLoading && <LoadingBar />}
      <DataTable
        data={data?.data || []}
        columns={columns}
        searchPlaceholder="Search state..."
        toolbarRight={
          <StateForm open={open} setOpen={setOpen} onSuccess={refetch} />
        }
       
      />
    </>
  );
};

export default StateList;
