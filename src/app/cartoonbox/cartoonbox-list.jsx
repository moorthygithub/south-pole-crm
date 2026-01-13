import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { CARTONBOX_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import ToggleStatus from "@/components/common/status-toggle";
import useDebounce from "@/hooks/useDebounce";
import { useMemo, useState } from "react";
import CartonBoxForm from "./cartoonbox-form";

const CartonBoxList = () => {
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
    url: CARTONBOX_API.getlist,
    queryKey: ["cartonbox-list", pageIndex],
    params,
  });

  const apiData = data?.data;

  const columns = [
    {
      header: "Carton Box",
      accessorKey: "cartonbox",
    },
    {
      header: "Weight",
      accessorKey: "cartonbox_weight",
    },
    {
      header: "Status",
      accessorKey: "cartonbox_status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.cartonbox_status}
          apiUrl={CARTONBOX_API.updateStatus(row.original.id)}
          payloadKey="cartonbox_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => <CartonBoxForm editId={row.original.id} />,
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
        searchPlaceholder="Search carton box..."
        toolbarRight={<CartonBoxForm />}
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

export default CartonBoxList;
