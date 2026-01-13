import ApiErrorPage from "@/components/api-error/api-error";
import {
  BranchCreate,
  BranchEdit,
} from "@/components/buttoncontrol/button-component";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { BRANCH_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const BranchList = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const params = useMemo(
    () => ({
      page: pageIndex + 1,
      per_page: pageSize,
      ...(debouncedSearch?.trim() && { search: debouncedSearch.trim() }),
    }),
    [pageIndex, pageSize, debouncedSearch]
  );

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: BRANCH_API.getlist,
    queryKey: ["branch-list", pageIndex],
    params,
  });

  const apiData = data;

  const columns = [
    { header: "Branch Code", accessorKey: "branch_short" },
    { header: "Branch Name", accessorKey: "branch_name" },
    { header: "GST", accessorKey: "branch_gst" },
    {
      header: "Status",
      accessorKey: "branch_status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.branch_status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.branch_status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <BranchEdit
          onClick={() => navigate(`/master/branch/edit/${row.original.id}`)}
        />
      ),
    },
  ];

  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      {isLoading && <LoadingBar />}
      <DataTable
        data={apiData?.data || []}
        columns={columns}
        pageSize={pageSize}
        searchPlaceholder="Search branch..."
        toolbarRight={
          <BranchCreate
            onClick={() => navigate("/master/branch/create")}
            className="ml-2"
          />
        }
        serverPagination={{
          pageIndex,
          pageCount: apiData?.last_page ?? 1,
          total: apiData?.total ?? 0,
          onPageChange: setPageIndex,
          onPageSizeChange: setPageSize,
          onSearch: setSearch,
        }}
      />
    </>
  );
};

export default BranchList;
