import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import ToggleStatus from "@/components/common/status-toggle";
import LoadingBar from "@/components/loader/loading-bar";
import { ITEMS_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useMemo, useState } from "react";
import ItemForm from "./item-form";
import {
  ItemCreate,
  ItemEdit,
} from "@/components/buttoncontrol/button-component";
import { useNavigate } from "react-router-dom";

const ItemList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();
  const params = useMemo(
    () => ({
      page: pageIndex + 1,
      per_page: pageSize,
      ...(debouncedSearch?.trim() && { search: debouncedSearch.trim() }),
    }),
    [pageIndex, pageSize, debouncedSearch]
  );

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: ITEMS_API.getlist,
    queryKey: ["item-list", pageIndex],
    params,
  });
  const apiData = data?.data;

  const columns = [
    { header: "HSN Code", accessorKey: "item_hsn_code" },
    { header: "Brand", accessorKey: "item_brand_name" },
    { header: "Item Name", accessorKey: "item_name" },
    { header: "Barcode", accessorKey: "item_barcode" },

    {
      header: "Pack Info",
      cell: ({ row }) => {
        const { item_pack_per_case, item_pack_type, item_order_uom } =
          row.original;
        return (
          <div className="flex flex-col">
            <span>{`${item_pack_per_case} ${item_pack_type}`}</span>
            <small className="text-gray-500">UOM: {item_order_uom}</small>
          </div>
        );
      },
    },

    {
      header: "Carton Dimensions",
      cell: ({ row }) => {
        const { cartonbox_l, cartonbox_w, cartonbox_h, item_inKgs } =
          row.original;
        return (
          <div className="flex flex-col">
            <span>{`${cartonbox_l} × ${cartonbox_w} × ${cartonbox_h}`}</span>
            <small className="text-gray-500">
              {item_inKgs === "Yes" ? "In Kgs" : "Not in Kgs"}
            </small>
          </div>
        );
      },
    },

    {
      header: "Rates & Charges",
      cell: ({ row }) => {
        const { item_kg_rate, item_piece_rate, item_packing_charges } =
          row.original;
        return (
          <div className="flex flex-col gap-1">
            <span>KG: {item_kg_rate}</span>
            <span>Piece: {item_piece_rate}</span>
            <span>Pack Charges: {item_packing_charges}</span>
          </div>
        );
      },
    },

    {
      header: "Packing Details",
      cell: ({ row }) => {
        const {
          item_packing_material,
          item_pouch,
          item_tare_weight,
          item_net_weight,
        } = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span>Material: {item_packing_material}</span>
            <span>Pouch: {item_pouch}</span>
            <span>Tare Weight: {item_tare_weight}</span>
            <span>Net Weight: {item_net_weight}</span>
          </div>
        );
      },
    },

    { header: "GST", accessorKey: "item_gst" },

    {
      header: "Status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.item_status}
          apiUrl={ITEMS_API.updateStatus(row.original.id)}
          payloadKey="item_status"
          onSuccess={refetch}
        />
      ),
    },

    {
      header: "Actions",
      cell: ({ row }) => (
        <ItemEdit
          onClick={() => navigate(`/master/items/edit/${row.original.id}`)}
        />
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
        searchPlaceholder="Search item..."
        toolbarRight={
          <ItemCreate onClick={() => navigate("/master/items/create")} />
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

export default ItemList;
