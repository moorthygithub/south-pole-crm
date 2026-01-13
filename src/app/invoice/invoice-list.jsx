import {
  InvoiceCreate,
  InvoiceDocument,
  InvoiceEdit,
  InvoiceExport,
  InvoicePacking,
  InvoicePackingCreate,
  InvoicePackingEdit,
} from "@/components/buttoncontrol/button-component";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import StatusSelect from "@/components/status-select/StatusSelect";
import { INVOICE_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
import moment from "moment";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const master = useMasterQueries(["invoicestatus"]);
  const {
    data: invoiceStatusData,
    loading: loadinginvoicestatus,
    error: invoicestatusError,
    refetch: refetchinvoicestatus,
  } = master.invoicestatus;
  const params = useMemo(
    () => ({
      page: pageIndex + 1,
      per_page: pageSize,
      ...(debouncedSearch?.trim() && { search: debouncedSearch.trim() }),
    }),
    [pageIndex, pageSize, debouncedSearch]
  );

  const {
    data,
    isLoading: loading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: INVOICE_API.getlist,
    queryKey: ["invoice-list", pageIndex, debouncedSearch],
    params,
  });
  const apiData = data;

  const columns = [
    {
      header: "Date",
      accessorKey: "invoice_date",
      cell: ({ row }) => {
        const date = row.original.invoice_date;
        return date ? moment(date).format("DD MMM YYYY") : "";
      },
    },
    { header: "Company", accessorKey: "branch_short" },
    { header: "Invoice No", accessorKey: "invoice_no" },
    { header: "Buyer Name", accessorKey: "invoice_buyer" },
    { header: "Consignee Name", accessorKey: "invoice_consignee" },
    {
      header: "Status",
      accessorKey: "invoice_status",
      cell: ({ row }) => (
        <StatusSelect
          initialStatus={row.original.invoice_status}
          apiUrl={INVOICE_API.updateStatus(row.original.id)}
          payloadKey="invoice_status"
          options={invoiceStatusData?.data || []}
          onSuccess={refetch}
          valueKey="invoice_status"
          labelKey="invoice_status"
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <>
          <InvoiceEdit
            onClick={() => navigate(`/invoice/edit/${row.original.id}`)}
          />
          <InvoiceDocument
            onClick={() => navigate(`/invoicedocument/edit/${row.original.id}`)}
          />
          {/* <InvoicePackingCreate
            onClick={() => navigate(`/invoicepacking/${row.original.id}`)}
          /> */}
          <InvoicePackingEdit
            onClick={() =>
              navigate(`/invoicepacking/${row.original.id}?isEdit=true`)
            }
          />
          <InvoiceExport
            onClick={() => navigate(`/invoice/export/${row.original.id}`)}
          />
        </>
      ),
    },
  ];

  if (isError || invoicestatusError)
    return (
      <ApiErrorPage
        onRetry={() => {
          refetch();
          refetchinvoicestatus();
        }}
      />
    );

  const isLoading = loadinginvoicestatus || loading;
  return (
    <>
      {isLoading && <LoadingBar />}
      <DataTable
        data={apiData?.data?.data || []}
        columns={columns}
        pageSize={pageSize}
        searchPlaceholder="Search invoice..."
        toolbarRight={
          <InvoiceCreate onClick={() => navigate("/invoice/create")} />
        }
        serverPagination={{
          pageIndex,
          pageCount: apiData?.data?.last_page ?? 1,
          total: apiData?.data?.total ?? 0,
          onPageChange: setPageIndex,
          onPageSizeChange: setPageSize,
          onSearch: setSearch,
        }}
      />
    </>
  );
};

export default InvoiceList;
