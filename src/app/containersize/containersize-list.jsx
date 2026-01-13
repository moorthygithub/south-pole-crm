import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { CONTAINERSIZE_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

import ToggleStatus from "@/components/common/status-toggle";
import useDebounce from "@/hooks/useDebounce";
import { useMemo, useState } from "react";
import ContainerSizeForm from "./containersize-form";

const ContainerSizeList = () => {
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
    url: CONTAINERSIZE_API.getlist,
    queryKey: ["containersize-list", pageIndex],
    params,
  });
  const apiData = data?.data;
  const columns = [
    {
      header: "Container Size",
      accessorKey: "containerSize",
    },

    {
      header: "Status",
      accessorKey: "containerSize_status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.containerSize_status}
          apiUrl={CONTAINERSIZE_API.updateStatus(row.original.id)}
          payloadKey="containerSize_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div>
          <ContainerSizeForm editId={row.original.id} />
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
        searchPlaceholder="Search container size..."
        toolbarRight={<ContainerSizeForm />}
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

export default ContainerSizeList;
