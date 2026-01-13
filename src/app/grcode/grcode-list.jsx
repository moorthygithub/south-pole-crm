import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { GRCODE_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

import ToggleStatus from "@/components/common/status-toggle";
import useDebounce from "@/hooks/useDebounce";
import { useMemo, useState } from "react";
import GrCodeForm from "./grcode-form";

const GrCodeList = () => {
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
    url: GRCODE_API.getlist,
    queryKey: ["grcode-list", pageIndex],
    params,
  });

  const apiData = data?.data;

  const columns = [
    {
      header: "Product Name",
      accessorKey: "product_name",
    },
    {
      header: "Description",
      accessorKey: "gr_code_des",
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.gr_code_status}
          apiUrl={GRCODE_API.updateStatus(row.original.id)}
          payloadKey="gr_code_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GrCodeForm editId={row.original.id} onSuccess={refetch} />
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
        searchPlaceholder="Search GrCode..."
        toolbarRight={<GrCodeForm onSuccess={refetch} />}
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

export default GrCodeList;
