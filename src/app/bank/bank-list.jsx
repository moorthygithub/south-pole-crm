import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import ToggleStatus from "@/components/common/status-toggle";
import LoadingBar from "@/components/loader/loading-bar";
import { BANK_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useMemo, useState } from "react";
import BankForm from "./bank-form";

const BankList = () => {
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
    url: BANK_API.getlist,
    queryKey: ["bank-list", pageIndex],
    params,
  });
  const apiData = data?.data;

  const [open, setOpen] = useState(false);

  const columns = [
    {
      header: "Company",
      accessorKey: "branch_short",
    },
    {
      header: "Bank Name",
      accessorKey: "bank_name",
    },
    {
      header: "Account No",
      accessorKey: "bank_acc_no",
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.bank_status}
          apiUrl={BANK_API.updateStatus(row.original.id)}
          payloadKey="bank_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <BankForm editId={row.original.id} onSuccess={refetch} />
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
        searchPlaceholder="Search bank..."
        toolbarRight={
          <BankForm open={open} setOpen={setOpen} onSuccess={refetch} />
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

export default BankList;
