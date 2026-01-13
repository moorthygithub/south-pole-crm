import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import ToggleStatus from "@/components/common/status-toggle";
import LoadingBar from "@/components/loader/loading-bar";
import { PAYMENTTERM_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useMemo, useState } from "react";
import PaymentForm from "./paymentterm-form";
// import BankForm from "./bank-form";

const PaymentTermList = () => {
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
    url: PAYMENTTERM_API.getlist,
    queryKey: ["payemntterm-list", pageIndex],
    params,
  });
  const apiData = data?.data;

  const [open, setOpen] = useState(false);

  const columns = [
    {
      header: "Short",
      accessorKey: "paymentTerms_short",
    },
    {
      header: "Terms",
      accessorKey: "paymentTerms",
    },
    {
      header: "DP",
      accessorKey: "paymentTerms_dp",
    },
    {
      header: "DA",
      accessorKey: "paymentTerms_da",
    },
    {
      header: "LC",
      accessorKey: "paymentTerms_lc",
    },
    {
      header: "Advance",
      accessorKey: "paymentTerms_advance",
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.paymentTerms_status}
          apiUrl={PAYMENTTERM_API.updateStatus(row.original.id)}
          payloadKey="paymentTerms_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <PaymentForm editId={row.original.id} onSuccess={refetch} />
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
        searchPlaceholder="Search payemnt term..."
        toolbarRight={<PaymentForm open={open} setOpen={setOpen} />}
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

export default PaymentTermList;
