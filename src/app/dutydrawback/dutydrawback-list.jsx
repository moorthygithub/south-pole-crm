"use client";

import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { DUTYDRAWBACK_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import ToggleStatus from "@/components/common/status-toggle";
import useDebounce from "@/hooks/useDebounce";
import { useMemo, useState } from "react";
import DutyDrawbackForm from "./dutydrawback-form";

const DutyDrawbackList = () => {
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
    url: DUTYDRAWBACK_API.getlist,
    queryKey: ["duty-drawback-list", pageIndex],
    params,
  });

  const apiData = data?.data;

  const columns = [
    { header: "Company", accessorKey: "branch_short" },
    { header: "Invoice No", accessorKey: "invoice_no" },
    { header: "Invoice Date", accessorKey: "invoice_date" },
    { header: "Invoice Status", accessorKey: "invoice_status" },
    { header: "Scroll No", accessorKey: "invoice_dd_scroll_no" },
    { header: "DD Date", accessorKey: "invoice_dd_date" },
    {
      header: "DD Status",
      accessorKey: "invoice_dd_status",
      cell: ({ row }) => {
        const status = row.original.invoice_dd_status || "Pending";
        const bgColor =
          status.toLowerCase() === "completed"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"; 

        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => <DutyDrawbackForm editId={row.original.id} />,
    },
  ];

  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      {isLoading && <LoadingBar />}

      <DataTable
        data={apiData || []}
        columns={columns}
        pageSize={pageSize}
        searchPlaceholder="Search Duty Drawback..."
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

export default DutyDrawbackList;
