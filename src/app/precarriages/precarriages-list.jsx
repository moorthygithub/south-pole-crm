import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { PRECARRIAGES_API } from "@/constants/apiConstants";
import { useMemo, useState } from "react";
import PrecarriageForm from "./precarriages-form";
import ToggleStatus from "@/components/common/status-toggle";

const PrecarriageList = () => {
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
    url: PRECARRIAGES_API.getlist,
    queryKey: ["precarriage-list", pageIndex],
    params,
  });

  const columns = [
    { header: "Precarriage Name", accessorKey: "precarriage_name" },
    {
      header: "Status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.precarriage_status}
          apiUrl={PRECARRIAGES_API.updateStatus(row.original.id)}
          payloadKey="precarriage_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <PrecarriageForm editId={row.original.id} onSuccess={refetch} />
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
        searchPlaceholder="Search precarriage..."
        toolbarRight={<PrecarriageForm onSuccess={refetch} />}
        serverPagination={{
          pageIndex,
          pageCount: data?.last_page ?? 1,
          total: data?.total ?? 0,
          onPageChange: setPageIndex,
          onPageSizeChange: setPageSize,
          onSearch: setSearch,
        }}
      />
    </>
  );
};

export default PrecarriageList;
