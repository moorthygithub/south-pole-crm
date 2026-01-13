import ApiErrorPage from "@/components/api-error/api-error";
import {
  VendorCreate,
  VendorEdit,
} from "@/components/buttoncontrol/button-component";
import DataTable from "@/components/common/data-table";
import ToggleStatus from "@/components/common/status-toggle";
import LoadingBar from "@/components/loader/loading-bar";
import { VENDOR_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorList = () => {
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
    url: VENDOR_API.getlist,
    queryKey: ["vendor-list", pageIndex, debouncedSearch],
    params,
  });

  const apiData = data;

  const columns = [
    { header: "Vendor Alias", accessorKey: "vendor_alias" },
    { header: "Short Name", accessorKey: "vendor_short" },
    { header: "Name", accessorKey: "vendor_name" },
    { header: "GST", accessorKey: "vendor_gst_no" },
    { header: "Contact Person", accessorKey: "vendor_contact_person" },
    { header: "Mobile No", accessorKey: "vendor_mobile1" },
    { header: "State", accessorKey: "vendor_state" },
    {
      header: "Status",
      accessorKey: "vendor_status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.vendor_status}
          apiUrl={VENDOR_API.updateStatus(row.original.id)}
          payloadKey="vendor_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <VendorEdit
          onClick={() => navigate(`/master/vendor/edit/${row.original.id}`)}
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
        searchPlaceholder="Search vendor..."
        toolbarRight={
          <VendorCreate
            onClick={() => navigate("/master/vendor/create")}
            className="ml-2"
          />
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

export default VendorList;
