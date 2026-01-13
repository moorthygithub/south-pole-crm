import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import ToggleStatus from "@/components/common/status-toggle";
import LoadingBar from "@/components/loader/loading-bar";
import { PRERECEIPTS_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useMemo, useState } from "react";
import PreReceiptsForm from "./prereceipts-form";

const PreRecepitList = () => {
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
    url: PRERECEIPTS_API.getlist,
    queryKey: ["prerecepits-list", pageIndex],
    params,
  });

  const apiData = data?.data;

  const columns = [
    {
      header: "Name",
      accessorKey: "prereceipts_name",
    },

    {
      header: "Status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.prereceipts_status}
          apiUrl={PRERECEIPTS_API.updateStatus(row.original.id)}
          payloadKey="prereceipts_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <PreReceiptsForm editId={row.original.id} onSuccess={refetch} />
      ),
    },
  ];

  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      {isLoading && <LoadingBar />}
      <DataTable
        data={data?.data?.data || []}
        columns={columns}
        pageSize={pageSize}
        searchPlaceholder="Search prerecepits..."
        toolbarRight={<PreReceiptsForm onSuccess={refetch} />}
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

export default PreRecepitList;
