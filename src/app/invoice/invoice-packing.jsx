import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
import LoadingBar from "@/components/loader/loading-bar";
import Field from "@/components/SelectField/Field";
import SelectField from "@/components/SelectField/SelectField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INVOICE_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Package, Trash2, Weight } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const INITIAL_STATE = { subs: [], subs1: [] };

const InvoiceView = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("isEdit") === "true";
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { trigger: fetchData, loading, error } = useApiMutation();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [availableItems, setAvailableItems] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useQueryClient();
  const master = useMasterQueries(["item", "cartonbox"]);
  const { data: itemData } = master.item;
  const { data: cartonboxData } = master.cartonbox;
  const { trigger } = useApiMutation();
  const [cartons, setCartons] = useState([]);
  const [activeCartonIndex, setActiveCartonIndex] = useState(0);
  const [cartonPrefix, setCartonPrefix] = useState("AGS");
  const [newCarton, setNewCarton] = useState({ carton_no: "", box_size: "" });
  const [subToDelete, setSubToDelete] = useState(null);
  const [validationResult, setValidationResult] = useState([]);

  const {
    trigger: Deletetrigger,
    loading: loadingdelete,
    deleteerror,
  } = useApiMutation();
  const [openQtyDialog, setOpenQtyDialog] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetchData({ url: INVOICE_API.getById(id) });
      const data = res?.data;
      if (!data) return;

      setFormData({
        ...data,
        invoice_date: data.invoice_date
          ? moment(data.invoice_date).format("DD-MM-YYYY")
          : "",
      });

      const allItems = data.subs.map((item, index) => ({
        ...item,
        row_id: `${item.id}_${index}`,
        invoiceSub_id: item.id,
      }));
      if (isEdit && data.subs1 && data.subs1.length > 0) {
        const cartonMap = {};

        data.subs1.forEach((packingItem) => {
          const cartonNo = packingItem.invoicePackingSub_carton_no;

          if (!cartonMap[cartonNo]) {
            cartonMap[cartonNo] = {
              carton_no: cartonNo,
              box_size: packingItem.invoicePackingSub_box_size,
              box_weight: Number(
                cartonboxData?.data?.find(
                  (c) =>
                    String(c.id) ===
                    String(packingItem.invoicePackingSub_box_size)
                )?.cartonbox_weight || 0
              ),
              gross_weight: packingItem.invoicePackingSub_gross_weight || "",
              net_weight: packingItem.invoicePackingSub_net_weight || "",
              items: [],
            };
          }

          const matchingSub = data.subs.find(
            (sub) =>
              sub.purchase_sub_id === packingItem.purchase_sub_id &&
              sub.invoiceSub_batch_no === packingItem.invoicePackingSub_batch_no
          );

          cartonMap[cartonNo].items.push({
            id: packingItem.id,
            row_id: `${matchingSub?.id}_${Date.now()}_${Math.random()}`,
            invoicePackingSub_ref: packingItem.invoicePackingSub_ref,
            invoicePackingSub_carton_no:
              packingItem.invoicePackingSub_carton_no,
            invoicePackingSub_box_size: packingItem.invoicePackingSub_box_size,
            invoicePackingSub_item_id: packingItem.invoicePackingSub_item_id,
            invoicePackingSub_batch_no: packingItem.invoicePackingSub_batch_no,
            invoicePackingSub_manufacture_date:
              packingItem.invoicePackingSub_manufacture_date,
            invoicePackingSub_expire_date:
              packingItem.invoicePackingSub_expire_date,
            invoicePackingSub_qnty: packingItem.invoicePackingSub_qnty,
            invoicePackingSub_mrp: packingItem.invoicePackingSub_mrp,
            invoicePackingSub_item_gst: packingItem.invoicePackingSub_item_gst,
            invoicePackingSub_net_weight:
              packingItem.invoicePackingSub_net_weight,
            invoicePackingSub_gross_weight:
              packingItem.invoicePackingSub_gross_weight,
            invoicePackingSub_selling_price:
              packingItem.invoicePackingSub_selling_price,
            purchase_sub_id: packingItem.purchase_sub_id,
            invoiceSub_id: matchingSub?.id,
          });
        });

        setCartons(Object.values(cartonMap));
      }

      setAvailableItems(allItems);
    })();
  }, [id, isEdit]);

  const getPackedQtyMap = () => {
    const map = {};
    cartons.forEach((carton) => {
      carton.items.forEach((row) => {
        const key = row.invoiceSub_id;
        map[key] = (map[key] || 0) + Number(row.invoicePackingSub_qnty || 0);
      });
    });
    return map;
  };

  const addCarton = () => {
    if (!newCarton.carton_no || !newCarton.box_size) {
      toast.error("Enter Carton No & Box Size");
      return;
    }
    const box = cartonboxData?.data?.find(
      (c) => String(c.id) === String(newCarton.box_size)
    );
    const boxWeight = Number(box?.cartonbox_weight || 0);
    const cartonNumber = `${cartonPrefix}-${newCarton.carton_no}-${
      cartons.length + 1
    }`;

    setCartons((prev) => [
      ...prev,
      {
        carton_no: cartonNumber,
        box_size: newCarton.box_size,
        box_weight: boxWeight,
        gross_weight: "",
        net_weight: "",
        items: [],
      },
    ]);
    setActiveCartonIndex(cartons.length);
    setNewCarton({ carton_no: "", box_size: "" });
  };

  const addItemToCarton = (item) => {
    if (!cartons[activeCartonIndex]) {
      toast.error("Create & select a carton first");
      return;
    }

    const carton = cartons[activeCartonIndex];
    const box = cartonboxData?.data?.find(
      (c) => String(c.id) === String(carton.box_size)
    );

    const packedQtyMap = getPackedQtyMap();
    const alreadyPacked = packedQtyMap[item.invoiceSub_id] || 0;

    const availableQty = Number(item.invoiceSub_qnty) - alreadyPacked;

    if (availableQty <= 0) {
      toast.error("No quantity available");
      return;
    }

    const row = {
      row_id: `${item.invoiceSub_id}_${Date.now()}`,
      invoicePackingSub_ref: formData.invoice_ref,
      invoicePackingSub_carton_no: carton.carton_no,
      invoicePackingSub_box_size: carton.box_size,
      invoicePackingSub_item_id: item.invoiceSub_item_id,
      invoicePackingSub_batch_no: item.invoiceSub_batch_no,
      invoicePackingSub_manufacture_date: item.invoiceSub_manufacture_date,
      invoicePackingSub_expire_date: item.invoiceSub_expire_date,
      invoicePackingSub_qnty: availableQty,
      invoicePackingSub_mrp: item.invoiceSub_mrp,
      invoicePackingSub_item_gst: item.invoiceSub_item_gst,
      invoicePackingSub_net_weight: "",
      // invoicePackingSub_net_weight: box?.cartonbox_weight ?? "",
      invoicePackingSub_gross_weight: "",
      invoicePackingSub_selling_price: item.invoiceSub_selling_rate,
      purchase_sub_id: item.purchase_sub_id,
      invoiceSub_id: item.invoiceSub_id,
    };

    setCartons((prev) =>
      prev.map((c, i) =>
        i === activeCartonIndex ? { ...c, items: [...c.items, row] } : c
      )
    );
  };

  const mapPackingToAvailableItem = (row) => ({
    row_id: row.row_id,
    id: row.invoiceSub_id,
    invoiceSub_id: row.invoiceSub_id,
    invoiceSub_ref: row.invoicePackingSub_ref,
    invoiceSub_item_id: row.invoicePackingSub_item_id,
    invoiceSub_batch_no: row.invoicePackingSub_batch_no,
    invoiceSub_manufacture_date: row.invoicePackingSub_manufacture_date,
    invoiceSub_expire_date: row.invoicePackingSub_expire_date,
    invoiceSub_qnty: row.invoicePackingSub_qnty,
    invoiceSub_mrp: row.invoicePackingSub_mrp,
    invoiceSub_item_gst: row.invoicePackingSub_item_gst,
    invoiceSub_selling_rate: row.invoicePackingSub_selling_price,
    purchase_sub_id: row.purchase_sub_id,
  });

  const removeItemFromCarton = (row, cartonIndex) => {
    setCartons((prev) =>
      prev.map((c, i) =>
        i === cartonIndex
          ? { ...c, items: c.items.filter((x) => x.row_id !== row.row_id) }
          : c
      )
    );
  };

  const removeCarton = (cartonIndex) => {
    const removedCarton = cartons[cartonIndex];

    const returnedItems = removedCarton.items.map((row) =>
      mapPackingToAvailableItem(row)
    );

    setAvailableItems((prev) => [...prev, ...returnedItems]);
    setCartons((prev) => prev.filter((_, i) => i !== cartonIndex));
    setActiveCartonIndex(0);
  };

  const handleCartonBoxChange = (cartonIndex, value) => {
    const box = cartonboxData?.data?.find(
      (c) => String(c.id) === String(value)
    );
    const boxWeight = Number(box?.cartonbox_weight || 0);

    setCartons((prev) =>
      prev.map((c, i) => {
        if (i !== cartonIndex) return c;

        const grossWeight = Number(c.gross_weight || 0);
        const netWeight = grossWeight > 0 ? grossWeight - boxWeight : "";

        return {
          ...c,
          box_size: value,
          box_weight: boxWeight,
          net_weight: netWeight,
          items: c.items.map((row) => ({
            ...row,
            invoicePackingSub_box_size: value,
            invoicePackingSub_net_weight: boxWeight,
          })),
        };
      })
    );
  };

  const handleGrossWeightChange = (cartonIndex, value) => {
    setCartons((prev) =>
      prev.map((c, i) => {
        if (i !== cartonIndex) return c;

        const grossWeight = Number(value || 0);
        const boxWeight = Number(c.box_weight || 0);
        const netWeight = grossWeight > 0 ? grossWeight - boxWeight : "";

        return {
          ...c,
          gross_weight: value,
          net_weight: netWeight,
        };
      })
    );
  };

  const handleItemQtyChange = (cartonIndex, row_id, value) => {
    setCartons((prev) =>
      prev.map((c, i) =>
        i === cartonIndex
          ? {
              ...c,
              items: c.items.map((row) =>
                row.row_id === row_id
                  ? { ...row, invoicePackingSub_qnty: value }
                  : row
              ),
            }
          : c
      )
    );
  };

  const packedQtyMap = getPackedQtyMap();

  const filteredAvailableItems = availableItems
    .map((item) => {
      const packed = packedQtyMap[item.invoiceSub_id] || 0; // ✅ Use invoiceSub_id
      const remaining = Number(item.invoiceSub_qnty) - packed;

      return remaining > 0 ? { ...item, remainingQty: remaining } : null;
    })
    .filter(Boolean)
    .filter((item) => {
      const name =
        itemData?.data?.find(
          (i) => String(i.id) === String(item.invoiceSub_item_id)
        )?.item_brand_name || "";

      return name.toLowerCase().includes(searchItem.toLowerCase());
    });
  const validateQuantities = () => {
    const requiredQtyMap = {};
    const packedQtyMap = {};

    // Required quantities (from invoice)
    formData.subs.forEach((sub) => {
      const key = String(sub.id);
      requiredQtyMap[key] =
        (requiredQtyMap[key] || 0) + Number(sub.invoiceSub_qnty || 0);
    });

    // Packed quantities (from cartons)
    cartons.forEach((carton) => {
      carton.items.forEach((row) => {
        const key = String(row.invoiceSub_id);
        packedQtyMap[key] =
          (packedQtyMap[key] || 0) + Number(row.invoicePackingSub_qnty || 0);
      });
    });

    const results = [];

    Object.keys(requiredQtyMap).forEach((invoiceSubId) => {
      const requiredQty = requiredQtyMap[invoiceSubId] || 0;
      const packedQty = packedQtyMap[invoiceSubId] || 0;

      const sub = formData.subs.find(
        (s) => String(s.id) === String(invoiceSubId)
      );

      let status = "ok";
      if (packedQty < requiredQty) status = "mismatch";
      if (packedQty > requiredQty) status = "extra";

      results.push({
        itemId: invoiceSubId,
        itemName: `${sub?.item_brand_name || "Item"} (Batch ${
          sub?.invoiceSub_batch_no || "-"
        })`,
        contractQty: requiredQty,
        enteredQty: packedQty,
        status,
      });
    });

    const hasIssue = results.some((r) => r.status !== "ok");

    if (hasIssue) {
      setValidationResult(results);
      setOpenQtyDialog(true);
      return false;
    }

    return true;
  };
  const validateCartons = () => {
    for (let i = 0; i < cartons.length; i++) {
      const carton = cartons[i];

      // ❌ No items in carton
      if (!Array.isArray(carton.items) || carton.items.length === 0) {
        toast.error(`Add at least one item in Carton ${i + 1}`);
        setActiveCartonIndex(i);
        return false;
      }

      // ❌ Gross weight missing
      if (
        carton.gross_weight === "" ||
        carton.gross_weight === null ||
        Number(carton.gross_weight) <= 0
      ) {
        toast.error(`Enter Gross Weight for Carton ${i + 1}`);
        setActiveCartonIndex(i);
        return false;
      }
    }

    return true;
  };

  const submitInvoice = async () => {
    try {
      const subs1 = cartons.flatMap((carton) =>
        carton.items.map((row) => ({
          invoicePackingSub_ref: row.invoicePackingSub_ref,
          invoicePackingSub_carton_no: String(carton.carton_no),
          invoicePackingSub_box_size: String(carton.box_size),
          invoicePackingSub_item_id: row.invoicePackingSub_item_id,
          invoicePackingSub_batch_no: row.invoicePackingSub_batch_no,
          invoicePackingSub_manufacture_date:
            row.invoicePackingSub_manufacture_date,
          invoicePackingSub_expire_date: row.invoicePackingSub_expire_date,
          invoicePackingSub_qnty: String(row.invoicePackingSub_qnty || "0"),
          invoicePackingSub_mrp: String(row.invoicePackingSub_mrp || "0"),
          invoicePackingSub_item_gst: String(
            row.invoicePackingSub_item_gst || "0"
          ),
          invoicePackingSub_net_weight: String(carton.net_weight || "0"),
          invoicePackingSub_gross_weight: String(carton.gross_weight || "0"),
          invoicePackingSub_selling_price: String(
            row.invoicePackingSub_selling_price || "0"
          ),
          purchase_sub_id: row.purchase_sub_id,
        }))
      );

      const payload = { subs1 };

      const res = await trigger({
        url: INVOICE_API.createpacking,
        method: "POST",
        data: payload,
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Invoice packing saved successfully");
        queryClient.invalidateQueries(["invoice-list"]);
        navigate("/invoice");
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };
  const handleSubmit = async () => {
    const hasSubs = Array.isArray(formData?.subs) && formData.subs.length > 0;
    const hasCartonItems = Array.isArray(cartons?.items)
      ? cartons.items.length > 0
      : Array.isArray(cartons) && cartons.length > 0;

    if (!hasSubs || !hasCartonItems) {
      toast.error("No items found");
      return;
    }
    if (!validateCartons()) return;

    if (!validateQuantities()) return;

    submitInvoice();
  };
  const confirmDelete = async () => {
    if (!subToDelete) return;
    try {
      const res = await Deletetrigger({
        url: INVOICE_API.deletePackingSubs(subToDelete.id),
        method: "DELETE",
      });
      if (res.code == 201) {
        toast.success(res.message || "Sub item deleted successfully");
        setCartons((prev) =>
          prev.map((carton, i) =>
            i === subToDelete.index
              ? {
                  ...carton,
                  items: carton.items.filter(
                    (item) => item.id !== subToDelete.id
                  ),
                }
              : carton
          )
        );
      } else {
        toast.error(err.message || "Failed to delete sub item");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete sub item");
    } finally {
      setDeleteConfirmOpen(false);
      setSubToDelete(null);
    }
  };
  if (error) return <ApiErrorPage />;
  if (loading) return <LoadingBar />;

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Invoice Packing"
        rightContent={<Button onClick={handleSubmit}> Save</Button>}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-3 max-h-[600px] overflow-auto">
          <div className="grid grid-cols-3 gap-3 items-center">
            <h3 className="text-xs mb-2">
              Available Items ({filteredAvailableItems.length})
            </h3>
            <div className="col-span-2">
              <Field
                placeholder="Search item..."
                value={searchItem}
                onChange={(val) => setSearchItem(val)}
                className="border p-2 rounded mb-2 w-full text-sm"
              />
            </div>
          </div>
          {filteredAvailableItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No items available</p>
            </div>
          ) : (
            filteredAvailableItems.map((item) => (
              <div
                key={item.row_id}
                className="border p-2 rounded mb-2 flex justify-between items-center font-medium text-xs"
              >
                <div>
                  <div className="font-medium mb-1">
                    {
                      itemData?.data?.find(
                        (i) => String(i.id) === String(item.invoiceSub_item_id)
                      )?.item_brand_name
                    }
                  </div>
                  <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full mr-3">
                    Qty: {item.remainingQty}
                  </span>
                  <span className="bg-muted text-muted-foreground px-2 py-0.5">
                    Batch: {item.invoiceSub_batch_no}
                  </span>
                </div>
                <button
                  className="border px-3 py-1 rounded text-xs"
                  onClick={() => addItemToCarton(item)}
                >
                  Add
                </button>
              </div>
            ))
          )}
        </Card>

        <Card className="p-3 space-y-4 max-h-[600px] overflow-auto col-span-2">
          <div className="grid grid-cols-4 gap-2 mb-2">
            <Field
              value={cartonPrefix}
              onChange={(val) => setCartonPrefix(val)}
              placeholder="Prefix (AGS)"
            />
            <Field
              value={newCarton.carton_no}
              onChange={(val) =>
                setNewCarton((p) => ({ ...p, carton_no: val }))
              }
              placeholder="Carton No"
            />
            <SelectField
              value={newCarton.box_size}
              options={cartonboxData?.data || []}
              optionKey="id"
              optionLabel="cartonbox"
              onChange={(v) => setNewCarton((p) => ({ ...p, box_size: v }))}
              placeholder="Box Size"
            />

            <Button
              className="border px-3 py-2 rounded mb-2"
              onClick={addCarton}
            >
              + Add Carton
            </Button>
          </div>

          <div className="p-4 max-h-[calc(100vh-280px)] overflow-y-auto space-y-4">
            {cartons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No cartons added yet</p>
                <p className="text-xs mt-1">Add a carton to start packing</p>
              </div>
            ) : (
              cartons.map((carton, cartonIndex) => (
                <Card
                  key={cartonIndex}
                  className={`cursor-pointer transition-all duration-200 ${
                    cartonIndex === activeCartonIndex
                      ? "border-2 border-primary shadow-lg bg-accent/10"
                      : "hover:border-primary"
                  }`}
                  onClick={() => setActiveCartonIndex(cartonIndex)}
                >
                  <div className="p-4">
                    {/* Carton Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          Carton {cartonIndex + 1}
                        </span>
                        {carton.items.length > 0 && (
                          <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                            {carton.items.length} items
                          </span>
                        )}
                      </div>
                      <button
                        className="text-red-500 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCarton(cartonIndex);
                        }}
                      >
                        Remove Carton
                      </button>
                    </div>

                    {/* Carton Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Carton No
                        </label>
                        <Field
                          value={carton.carton_no}
                          onChange={(val) =>
                            setCartons((prev) =>
                              prev.map((c, i) =>
                                i === cartonIndex ? { ...c, carton_no: val } : c
                              )
                            )
                          }
                          placeholder="Carton No"
                          className="h-8"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Box Size
                        </label>
                        <SelectField
                          value={carton.box_size}
                          options={cartonboxData?.data || []}
                          optionKey="id"
                          optionLabel="cartonbox"
                          onChange={(v) =>
                            handleCartonBoxChange(cartonIndex, v)
                          }
                          placeholder="Box"
                          className="h-8"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Weight className="w-3 h-3" />
                          Gross Wt
                        </label>
                        <Field
                          type="text"
                          inputMode="decimal"
                          value={carton.gross_weight || ""}
                          onChange={(val) =>
                            handleGrossWeightChange(cartonIndex, val)
                          }
                          placeholder="0.00"
                          className="h-8"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Box Wt
                        </label>
                        <Field
                          value={carton.box_weight || ""}
                          readOnly
                          placeholder="0.00"
                          className="h-8 bg-muted"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Net Wt
                        </label>
                        <Field
                          value={carton.net_weight || ""}
                          readOnly
                          placeholder="0.00"
                          className="h-8 font-medium bg-muted"
                        />
                      </div>
                    </div>

                    {/* Items Table */}
                    {carton.items.length > 0 && (
                      <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-xs">
                          <thead className="bg-muted/50 border-b">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold text-foreground">
                                Item
                              </th>
                              <th className="px-3 py-2 text-left font-semibold text-foreground">
                                Batch
                              </th>
                              <th className="px-3 py-2 text-left font-semibold text-foreground">
                                Mfg Date
                              </th>
                              <th className="px-3 py-2 text-left font-semibold text-foreground">
                                Exp Date
                              </th>
                              <th className="px-3 py-2 text-left font-semibold text-foreground w-24">
                                Qty
                              </th>
                              <th className="px-3 py-2 text-center font-semibold text-foreground">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {carton.items.map((row) => (
                              <tr
                                key={row.row_id}
                                className="hover:bg-muted/50"
                              >
                                <td className="px-3 py-2 text-foreground">
                                  {
                                    itemData?.data?.find(
                                      (i) =>
                                        String(i.id) ===
                                        String(row.invoicePackingSub_item_id)
                                    )?.item_brand_name
                                  }
                                </td>
                                <td className="px-3 py-2 text-muted-foreground">
                                  {row.invoicePackingSub_batch_no}
                                </td>
                                <td className="px-3 py-2 text-muted-foreground">
                                  {moment(
                                    row.invoicePackingSub_manufacture_date
                                  ).format("DD-MM-YY")}
                                </td>
                                <td className="px-3 py-2 text-muted-foreground">
                                  {moment(
                                    row.invoicePackingSub_expire_date
                                  ).format("DD-MM-YY")}
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    min={0}
                                    value={row.invoicePackingSub_qnty}
                                    className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                    onChange={(e) => {
                                      const v = e.target.value;

                                      handleItemQtyChange(
                                        cartonIndex,
                                        row.row_id,
                                        v
                                      );
                                    }}
                                  />
                                </td>
                                {carton.items.length > 1 && (
                                  <td className="px-3 py-2 text-center">
                                    {isEdit && row.id ? (
                                      <button
                                        className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                                        onClick={() => {
                                          setSubToDelete({
                                            index: cartonIndex,
                                            id: row.id,
                                          });
                                          setDeleteConfirmOpen(true);
                                        }}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <button
                                        className="text-red-500 text-xs"
                                        onClick={() =>
                                          removeItemFromCarton(row, cartonIndex)
                                        }
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              packing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={openQtyDialog} onOpenChange={setOpenQtyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Quantity Validation</DialogTitle>
            <DialogDescription>
              Some items have quantity differences. Please review before
              submitting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-80 overflow-auto">
            {validationResult.map((row) => (
              <div
                key={row.itemId}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div>
                  <p className="font-medium">{row.itemName}</p>
                  <p className="text-sm text-muted-foreground">
                    Required: {row.contractQty} | Packed: {row.enteredQty}
                  </p>
                </div>

                {row.status === "ok" && (
                  <span className="text-green-600 font-bold">✔</span>
                )}

                {row.status === "mismatch" && (
                  <span className="text-red-600 font-bold">✖</span>
                )}

                {row.status === "extra" && (
                  <span className="text-orange-600 font-bold">⚠</span>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setOpenQtyDialog(false)}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                setOpenQtyDialog(false);
                submitInvoice();
              }}
            >
              Skip & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceView;
