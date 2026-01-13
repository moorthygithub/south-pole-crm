import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
import LoadingBar from "@/components/loader/loading-bar";
import Field from "@/components/SelectField/Field";
import SelectField from "@/components/SelectField/SelectField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITEMS_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Box, Loader2, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const INITIAL_STATE = {
  item_hsn_code: "",
  item_brand_name: "",
  item_name: "",
  item_barcode: "",
  item_net_weight: "",
  item_gst: "",
  item_pack_per_case: "",
  item_pack_type: "",
  item_order_uom: "",
  item_carton_id: "",
  item_inKgs: "",
  item_kg_rate: "",
  item_piece_rate: "",
  item_packing_charges: "",
  item_packing_material: "",
  item_pouch: "",
  item_tare_weight: "",
  item_status: "Active",
};

const ItemForm = React.memo(function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const master = useMasterQueries(["cartonbox"]);
  const { data: CartonData } = master.cartonbox;

  const { trigger: fetchItem, loading: loadingData, error } = useApiMutation();
  const { trigger, loading } = useApiMutation();

  const fetchItemData = async () => {
    try {
      const res = await fetchItem({
        url: ITEMS_API.getById(id),
      });

      setFormData({
        item_hsn_code: res?.data?.item_hsn_code || "",
        item_brand_name: res?.data?.item_brand_name || "",
        item_name: res?.data?.item_name || "",
        item_barcode: res?.data?.item_barcode || "",
        item_net_weight: res?.data?.item_net_weight || "",
        item_gst: res?.data?.item_gst || "",
        item_pack_per_case: res?.data?.item_pack_per_case || "",
        item_pack_type: res?.data?.item_pack_type || "Pieces",
        item_order_uom: res?.data?.item_order_uom || "CS",
        item_carton_id: Number(res?.data?.item_carton_id) || "",
        item_inKgs: res?.data?.item_inKgs || "No",
        item_kg_rate: res?.data?.item_kg_rate || "",
        item_piece_rate: res?.data?.item_piece_rate || "",
        item_packing_charges: res?.data?.item_packing_charges || "",
        item_packing_material: res?.data?.item_packing_material || "",
        item_pouch: res?.data?.item_pouch || "",
        item_tare_weight: res?.data?.item_tare_weight || "",
        item_status: res?.data?.item_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load item");
    }
  };

  useEffect(() => {
    if (!isEdit) return;
    if (!CartonData?.data) return;
    fetchItemData();
  }, [isEdit, id, CartonData]);

  const cartonOptions =
    CartonData?.data?.map((c) => ({
      value: Number(c.id),
      label: `${c.cartonbox_l} x ${c.cartonbox_w} x ${c.cartonbox_h}`,
    })) || [];

  const handleChange = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleNumberChange = (name, value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      handleChange(name, value);
    }
  };

  // validation
  const validate = () => {
    const e = {};
    if (!formData.item_hsn_code) e.item_hsn_code = "HSN Code is required";
    if (!formData.item_brand_name) e.item_brand_name = "Brand Name is required";
    if (!formData.item_barcode) e.item_barcode = "Barcode is required";
    if (!formData.item_pack_per_case)
      e.item_pack_per_case = "Pack per Case is required";
    if (!formData.item_pack_type) e.item_pack_type = "Pack Type is required";
    if (!formData.item_order_uom) e.item_order_uom = "Order UOM is required";
    if (!formData.item_carton_id) e.item_carton_id = "Item is required";
    if (!formData.item_net_weight) e.item_net_weight = "Net Weight is required";
    if (!formData.item_inKgs) e.item_inKgs = "Item Kgs is required";
    if (!formData.item_tare_weight)
      e.item_tare_weight = "Tare Weight is required";
    if (!formData.item_gst) e.item_gst = "GST % is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await trigger({
        url: isEdit ? ITEMS_API.updateById(id) : ITEMS_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      toast.success(
        res.message ??
          (isEdit ? "Item updated successfully" : "Item created successfully")
      );

      navigate(-1);
      queryClient.invalidateQueries(["item-list"]);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (error) return <ApiErrorPage onRetry={fetchItemData} />;

  return (
    <>
      {loadingData && <LoadingBar />}
      <PageHeader
        icon={Box}
        title={isEdit ? "Edit Item" : "Create Item"}
        rightContent={
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
      />

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field
            label="HSN Code *"
            placeholder="Enter HSN code"
            value={formData.item_hsn_code}
            onChange={(v) => handleChange("item_hsn_code", v)}
            error={errors.item_hsn_code}
          />

          <Field
            label="Brand Name *"
            placeholder="Enter brand name"
            value={formData.item_brand_name}
            onChange={(v) => handleChange("item_brand_name", v)}
            error={errors.item_brand_name}
          />

          <Field
            label="Item Name *"
            placeholder="Enter item name"
            value={formData.item_name}
            onChange={(v) => handleChange("item_name", v)}
            error={errors.item_name}
          />

          <Field
            label="Barcode *"
            placeholder="Enter barcode"
            value={formData.item_barcode}
            onChange={(v) => handleChange("item_barcode", v)}
            error={errors.item_barcode}
          />

          <Field
            label="Net Weight"
            placeholder="Enter net weight"
            value={formData.item_net_weight}
            onChange={(v) => handleNumberChange("item_net_weight", v)}
            error={errors.item_net_weight}
          />

          <Field
            label="GST % *"
            placeholder="Eg: 5, 12, 18"
            value={formData.item_gst}
            onChange={(v) => handleNumberChange("item_gst", v)}
            error={errors.item_gst}
          />

          <Field
            label="Pack per Case *"
            placeholder="Enter number of packs per case"
            value={formData.item_pack_per_case}
            onChange={(v) => handleNumberChange("item_pack_per_case", v)}
            error={errors.item_pack_per_case}
          />

          <SelectField
            label="Pack Type"
            required
            placeholder="Select pack type"
            value={formData.item_pack_type}
            onChange={(v) => handleChange("item_pack_type", v)}
            options={[
              { label: "Pieces", value: "Pieces" },
              { label: "Kgs", value: "Kgs" },
            ]}
            optionKey="value"
            optionLabel="label"
            error={errors.item_pack_type}
          />

          <SelectField
            label="Order UOM"
            required
            placeholder="Select order UOM"
            value={formData.item_order_uom}
            onChange={(v) => handleChange("item_order_uom", v)}
            options={[
              { label: "CS", value: "CS" },
              { label: "Bag", value: "Bag" },
            ]}
            optionKey="value"
            optionLabel="label"
            error={errors.item_order_uom}
          />
          <SelectField
            label="Carton Box"
            required
            value={formData.item_carton_id}
            onChange={(v) => handleChange("item_carton_id", Number(v))}
            options={cartonOptions}
            optionKey="value"
            optionLabel="label"
            error={errors.item_carton_id}
          />

          <SelectField
            label="Item in Kgs"
            required
            placeholder="Select Yes/No"
            value={formData.item_inKgs}
            onChange={(v) => handleChange("item_inKgs", v)}
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            optionKey="value"
            optionLabel="label"
            error={errors.item_inKgs}
          />

          <Field
            label="KG Rate"
            placeholder="Enter KG rate"
            value={formData.item_kg_rate}
            onChange={(v) => handleNumberChange("item_kg_rate", v)}
            error={errors.item_kg_rate}
          />

          <Field
            label="Piece Rate"
            placeholder="Enter piece rate"
            value={formData.item_piece_rate}
            onChange={(v) => handleNumberChange("item_piece_rate", v)}
            error={errors.item_piece_rate}
          />

          <Field
            label="Packing Charges"
            placeholder="Enter packing charges"
            value={formData.item_packing_charges}
            onChange={(v) => handleNumberChange("item_packing_charges", v)}
            error={errors.item_packing_charges}
          />

          <Field
            label="Packing Material"
            placeholder="Enter packing material"
            value={formData.item_packing_material}
            onChange={(v) => handleChange("item_packing_material", v)}
            error={errors.item_packing_material}
          />

          <Field
            label="Pouch"
            placeholder="Enter pouch type"
            value={formData.item_pouch}
            onChange={(v) => handleChange("item_pouch", v)}
            error={errors.item_pouch}
          />

          <Field
            label="Tare Weight *"
            placeholder="Enter tare weight"
            value={formData.item_tare_weight}
            onChange={(v) => handleNumberChange("item_tare_weight", v)}
            error={errors.item_tare_weight}
          />
          {isEdit && (
            <div className="col-span-1">
              <Label className="text-sm font-medium">Status</Label>

              <Select
                value={formData.item_status}
                onValueChange={(v) => handleChange("item_status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Active">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      Active
                    </div>
                  </SelectItem>

                  <SelectItem value="Inactive">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>
    </>
  );
});

export default ItemForm;
