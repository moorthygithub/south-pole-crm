import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { BUYER_LIST } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useMemo, useState } from "react";
import BuyerForm from "./buyer-form";
// import BuyerForm from "./buyer-form";

const BuyerList = () => {
  const [open, setOpen] = useState(false);
  const [editId, setEdit] = useState(null);
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
    url: BUYER_LIST.getlist,
    queryKey: ["buyer-list", pageIndex],
    params,
  });

  const apiData = data?.data;

  const columns = [
    { header: "Buyer Code", accessorKey: "buyer_sort" },
    { header: "Buyer Name", accessorKey: "buyer_name" },
    { header: "Country", accessorKey: "buyer_country" },
    { header: "Port", accessorKey: "buyer_port" },
    {
      header: "Status",
      accessorKey: "buyer_status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.buyer_status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.buyer_status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => <BuyerForm editId={row.original.id} />,
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
        searchPlaceholder="Search buyer..."
        toolbarRight={<BuyerForm open={open} setOpen={setOpen} />}
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

export default BuyerList;
