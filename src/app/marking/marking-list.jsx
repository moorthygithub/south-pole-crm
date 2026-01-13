import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { MARKING_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

import ToggleStatus from "@/components/common/status-toggle";
import useDebounce from "@/hooks/useDebounce";
import { useMemo, useState } from "react";
import MarkingForm from "./marking-form";

const MarkingList = () => {
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
  const {
    data: data,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: MARKING_API.getlist,
    queryKey: ["marking-list", pageIndex],
    params,
  });
  const apiData = data?.data;
  const columns = [
    {
      header: "Marking",
      accessorKey: "marking",
    },

    {
      header: "Status",
      accessorKey: "marking_status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.marking_status}
          apiUrl={MARKING_API.updateStatus(row.original.id)}
          payloadKey="marking_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div>
          <MarkingForm editId={row.original.id} />
        </div>
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
        searchPlaceholder="Search marking..."
        toolbarRight={<MarkingForm />}
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

export default MarkingList;
