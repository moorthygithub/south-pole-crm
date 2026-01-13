import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import ToggleStatus from "@/components/common/status-toggle";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { SHIPPER_API } from "@/constants/apiConstants";
import { useMemo, useState } from "react";
import ShipperForm from "./shipper-form";

const ShipperList = () => {
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
    url: SHIPPER_API.getlist,
    queryKey: ["shipper-list", pageIndex],
    params,
  });

  const apiData = data?.data;

  const columns = [
    {
      header: "Shipper Name",
      accessorKey: "shipper_name",
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.shipper_status}
          apiUrl={SHIPPER_API.updateStatus(row.original.id)}
          payloadKey="shipper_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => <ShipperForm editId={row.original.id} />,
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
        searchPlaceholder="Search shipper..."
        toolbarRight={<ShipperForm />}
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

export default ShipperList;
