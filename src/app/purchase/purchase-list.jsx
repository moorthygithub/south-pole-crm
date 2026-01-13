// PurchaseList.jsx
import ApiErrorPage from "@/components/api-error/api-error";
import {
  PurchaseCreate,
  PurchaseEdit,
} from "@/components/buttoncontrol/button-component";
import DataTable from "@/components/common/data-table";
import ToggleStatus from "@/components/common/status-toggle";
import LoadingBar from "@/components/loader/loading-bar";
import { PURCHASE_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import moment from "moment";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const PurchaseList = () => {
  const navigate = useNavigate();
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
    url: PURCHASE_API.getlist,
    queryKey: ["purchase-list", pageIndex, debouncedSearch],
    params,
  });
  const apiData = data;

  const columns = [
    { header: "Branch", accessorKey: "branch_short" },
    { header: "Vendor", accessorKey: "vendor_name" },
    { header: "Bill Ref", accessorKey: "purchase_bill_ref" },
    {
      header: "Date",
      accessorKey: "purchase_date",
      cell: ({ row }) => {
        const date = row.original.purchase_date;
        return date ? moment(date).format("DD MMM YYYY") : "-";
      },
    },
    {
      header: "Status",
      accessorKey: "vendpurchase_statusor_status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.purchase_status}
          apiUrl={PURCHASE_API.updateStatus(row.original.id)}
          payloadKey="purchase_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <PurchaseEdit
          onClick={() => navigate(`/purchase/edit/${row.original.id}`)}
        />
      ),
    },
  ];

  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      {isLoading && <LoadingBar />}
      <DataTable
        data={apiData?.data?.data || []}
        columns={columns}
        pageSize={pageSize}
        searchPlaceholder="Search purchase..."
        toolbarRight={
          <PurchaseCreate onClick={() => navigate("/purchase/create")} />
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

export default PurchaseList;
