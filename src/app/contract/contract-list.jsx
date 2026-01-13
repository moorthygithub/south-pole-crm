// PurchaseList.jsx
import ApiErrorPage from "@/components/api-error/api-error";
import {
  ContractCreate,
  ContractEdit,
  ContractExport,
} from "@/components/buttoncontrol/button-component";
import DataTable from "@/components/common/data-table";
import ToggleStatus from "@/components/common/status-toggle";
import LoadingBar from "@/components/loader/loading-bar";
import { CONTRACT_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import moment from "moment";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ContractList = () => {
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
    url: CONTRACT_API.getlist,
    queryKey: ["contract-list", pageIndex, debouncedSearch],
    params,
  });
  const apiData = data;

  const columns = [
    {
      header: "Date",
      accessorKey: "contract_date",
      cell: ({ row }) => {
        const date = row.original.contract_date;
        return date ? moment(date).format("DD MMM YYYY") : "";
      },
    },
    { header: "Company", accessorKey: "branch_short" },
    { header: "Contract No", accessorKey: "contract_no" },
    { header: "Buyer Name", accessorKey: "contract_buyer" },
    { header: "Consignee Name", accessorKey: "contract_consignee" },
    {
      header: "Status",
      accessorKey: "contract_status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.contract_status}
          apiUrl={CONTRACT_API.updateStatus(row.original.id)}
          payloadKey="contract_status"
          onSuccess={refetch}
          activeValue="Open"
          inactiveValue="Close"
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <>
          <ContractEdit
            onClick={() => navigate(`/contract/edit/${row.original.id}`)}
          />
          <ContractExport
            onClick={() => navigate(`/contract/view/${row.original.id}`)}
          />
        </>
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
        searchPlaceholder="Search contract..."
        toolbarRight={
          <ContractCreate onClick={() => navigate("/contract/create")} />
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

export default ContractList;
