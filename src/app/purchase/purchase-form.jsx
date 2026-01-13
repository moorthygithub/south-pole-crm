import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Trash2, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PURCHASE_API } from "@/constants/apiConstants";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SelectField from "@/components/SelectField/SelectField";
import Field from "@/components/SelectField/Field";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useQueryClient } from "@tanstack/react-query";

const SUB_NUMBER_FIELDS = [
  "purchaseSub_qnty",
  "purchaseSub_rate",
  "purchaseSub_mrp",
];
const REQUIRED_SUB_FIELDS = [
  "purchaseSub_item_id",
  "purchaseSub_batch_no",
  "purchaseSub_manufacture_date",
  "purchaseSub_expire_date",
  "purchaseSub_qnty",
  "purchaseSub_rate",
  "purchaseSub_mrp",
];

const EMPTY_SUB = {
  id: "",
  purchaseSub_item_id: "",
  purchaseSub_batch_no: "",
  purchaseSub_manufacture_date: "",
  purchaseSub_expire_date: "",
  purchaseSub_qnty: "",
  purchaseSub_rate: "",
  purchaseSub_mrp: "",
};

const INITIAL_STATE = {
  branch_short: "",
  purchase_date: "",
  purchase_vendor_id: "",
  purchase_bill_ref: "",
  purchase_remarks: "",
  purchase_status: "Active",
  subs: [{ ...EMPTY_SUB }],
};

const PurchaseForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  const { trigger, loading } = useApiMutation();
  const {
    trigger: fetchPurchase,
    loading: loadingData,
    error,
  } = useApiMutation();

  const { branch, vendor, item } = useMasterQueries([
    "branch",
    "vendor",
    "item",
  ]);

  useEffect(() => {
    if (!isEdit) return;

    fetchPurchase({ url: PURCHASE_API.getById(id) })
      .then((res) =>
        setFormData({
          ...INITIAL_STATE,
          ...res.data,
        })
      )
      .catch(() => toast.error("Failed to load purchase"));
  }, [id]);

  const handleChange = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubChange = (index, name, value) => {
    let val = value;

    if (SUB_NUMBER_FIELDS.includes(name)) {
      if (!/^\d*$/.test(val)) return;
    }

    const subs = [...formData.subs];
    subs[index][name] = val;

    setFormData((p) => ({ ...p, subs }));
    setErrors((p) => ({ ...p, [`sub_${index}_${name}`]: "" }));
  };

  const addSub = () => {
    setFormData((p) => ({
      ...p,
      subs: [...p.subs, { ...EMPTY_SUB }],
    }));
  };

  const removeSub = (index) => {
    if (formData.subs.length === 1) return;

    setFormData((p) => ({
      ...p,
      subs: p.subs.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const e = {};

    if (!formData.branch_short) e.branch_short = "Branch is required";
    if (!formData.purchase_date) e.purchase_date = "Date is required";
    if (!formData.purchase_vendor_id)
      e.purchase_vendor_id = "Vendor is required";
    formData.subs.forEach((sub, i) => {
      REQUIRED_SUB_FIELDS.forEach((key) => {
        if (!sub[key]) {
          e[`sub_${i}_${key}`] = "Required";
        }
      });
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => ({
    branch_short: formData.branch_short,
    purchase_date: formData.purchase_date,
    purchase_vendor_id: Number(formData.purchase_vendor_id),
    purchase_bill_ref: formData.purchase_bill_ref,
    purchase_remarks: formData.purchase_remarks,
    purchase_status: formData.purchase_status,

    subs: formData.subs.map((sub) => ({
      id: Number(sub.id),
      purchaseSub_item_id: Number(sub.purchaseSub_item_id),
      purchaseSub_batch_no: String(sub.purchaseSub_batch_no),
      purchaseSub_manufacture_date: sub.purchaseSub_manufacture_date,
      purchaseSub_expire_date: sub.purchaseSub_expire_date,
      purchaseSub_qnty: Number(sub.purchaseSub_qnty),
      purchaseSub_rate: Number(sub.purchaseSub_rate),
      purchaseSub_mrp: Number(sub.purchaseSub_mrp),
    })),
  });
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = buildPayload();

    try {
      const res = await trigger({
        url: isEdit ? PURCHASE_API.updateById(id) : PURCHASE_API.create,
        method: isEdit ? "PUT" : "POST",
        data: payload,
      });
      if (res.code === 201) {
        toast.success(
          res.message ??
            (isEdit ? "Updated successfully" : "Created successfully")
        );
        navigate("/purchase");
        setFormData(INITIAL_STATE);
        setErrors({});
        queryClient.invalidateQueries(["purchase-list"]);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      console.log;
      toast.error(err.message || "Something went wrong");
    }
  };
  const confirmDelete = async () => {
    if (!subToDelete) return;

    try {
      await trigger({
        url: PURCHASE_API.deleteSubs(subToDelete.id),
        method: "DELETE",
      });

      toast.success("Sub item deleted successfully");

      setFormData((p) => ({
        ...p,
        subs: p.subs.filter((_, i) => i !== subToDelete.index),
      }));

      setErrors((p) => {
        const newErrors = { ...p };
        Object.keys(newErrors).forEach((key) => {
          if (key.startsWith(`sub_${subToDelete.index}_`))
            delete newErrors[key];
        });
        return newErrors;
      });
    } catch (err) {
      toast.error("Failed to delete sub item");
    } finally {
      setDeleteConfirmOpen(false);
      setSubToDelete(null);
    }
  };

  if (error) return <ApiErrorPage />;

  const isLoading = loading || loadingData;

  return (
    <>
      {isLoading && <LoadingBar />}

      <PageHeader
        icon={User}
        title={isEdit ? "Edit Purchase" : "Create Purchase"}
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

      <Card className="p-4 space-y-6">
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Purchase Details</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          {/* ================= FORM TAB ================= */}
          <TabsContent value="form" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectField
                label="Branch "
                required
                value={formData.branch_short}
                onChange={(v) => handleChange("branch_short", v)}
                options={branch.data?.data}
                optionKey="branch_short"
                optionLabel="branch_short"
                error={errors.branch_short}
              />

              <Field
                label="Date *"
                type="date"
                value={formData.purchase_date}
                onChange={(v) => handleChange("purchase_date", v)}
                error={errors.purchase_date}
              />

              <SelectField
                label="Vendor "
                required
                value={String(formData.purchase_vendor_id)}
                onChange={(v) => handleChange("purchase_vendor_id", v)}
                options={vendor.data?.data}
                optionKey="id"
                optionLabel="vendor_name"
                error={errors.purchase_vendor_id}
              />

              <Field
                label="Bill Ref"
                value={formData.purchase_bill_ref}
                onChange={(v) => handleChange("purchase_bill_ref", v)}
              />
              {/* REMARKS */}
              <div
                className={`${isEdit ? "col-span-3" : "col-span-4"} space-y-1`}
              >
                <Label className="text-sm font-medium">Remarks</Label>

                <Textarea
                  name="purchase_remarks"
                  value={formData.purchase_remarks}
                  onChange={(e) =>
                    handleChange("purchase_remarks", e.target.value)
                  }
                  placeholder="Enter remarks"
                />

                {errors.purchase_remarks && (
                  <p className="text-xs text-red-500">
                    {errors.purchase_remarks}
                  </p>
                )}
              </div>

              {isEdit && (
                <div className="col-span-1 space-y-1">
                  <Label className="text-sm font-medium">Status</Label>

                  <Select
                    value={formData.purchase_status}
                    onValueChange={(v) => handleChange("purchase_status", v)}
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

                  {errors.purchase_status && (
                    <p className="text-xs text-red-500">
                      {errors.purchase_status}
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="items" className="pt-4 space-y-4">
            <Card className="p-0 overflow-hidden rounded-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">Item *</TableHead>
                    <TableHead>Batch *</TableHead>
                    <TableHead>MFG *</TableHead>
                    <TableHead>EXP *</TableHead>
                    <TableHead className="w-[100px]">Qty *</TableHead>
                    <TableHead className="w-[100px]">Rate *</TableHead>
                    <TableHead className="w-[100px]">MRP *</TableHead>
                    <TableHead className="w-[60px] text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {formData.subs.map((sub, i) => (
                    <TableRow key={i}>
                      {/* ITEM */}
                      <TableCell>
                        <SelectField
                          hideLabel
                          value={String(sub.purchaseSub_item_id)}
                          onChange={(v) =>
                            handleSubChange(i, "purchaseSub_item_id", v)
                          }
                          options={item.data?.data}
                          optionKey="id"
                          optionLabel="item_brand_name"
                          error={errors[`sub_${i}_purchaseSub_item_id`]}
                        />
                      </TableCell>

                      {/* BATCH */}
                      <TableCell>
                        <Field
                          hideLabel
                          value={sub.purchaseSub_batch_no}
                          onChange={(v) =>
                            handleSubChange(i, "purchaseSub_batch_no", v)
                          }
                          error={errors[`sub_${i}_purchaseSub_batch_no`]}
                        />
                      </TableCell>

                      {/* MFG */}
                      <TableCell>
                        <Field
                          hideLabel
                          type="date"
                          value={sub.purchaseSub_manufacture_date}
                          onChange={(v) =>
                            handleSubChange(
                              i,
                              "purchaseSub_manufacture_date",
                              v
                            )
                          }
                          error={
                            errors[`sub_${i}_purchaseSub_manufacture_date`]
                          }
                        />
                      </TableCell>

                      {/* EXP */}
                      <TableCell>
                        <Field
                          hideLabel
                          type="date"
                          value={sub.purchaseSub_expire_date}
                          onChange={(v) =>
                            handleSubChange(i, "purchaseSub_expire_date", v)
                          }
                          error={errors[`sub_${i}_purchaseSub_expire_date`]}
                        />
                      </TableCell>

                      {/* QTY */}
                      <TableCell>
                        <Field
                          hideLabel
                          value={sub.purchaseSub_qnty}
                          onChange={(v) =>
                            handleSubChange(i, "purchaseSub_qnty", v)
                          }
                          error={errors[`sub_${i}_purchaseSub_qnty`]}
                        />
                      </TableCell>

                      {/* RATE */}
                      <TableCell>
                        <Field
                          hideLabel
                          value={sub.purchaseSub_rate}
                          onChange={(v) =>
                            handleSubChange(i, "purchaseSub_rate", v)
                          }
                          error={errors[`sub_${i}_purchaseSub_rate`]}
                        />
                      </TableCell>

                      {/* MRP */}
                      <TableCell>
                        <Field
                          hideLabel
                          value={sub.purchaseSub_mrp}
                          onChange={(v) =>
                            handleSubChange(i, "purchaseSub_mrp", v)
                          }
                          error={errors[`sub_${i}_purchaseSub_mrp`]}
                        />
                      </TableCell>

                      {/* ACTION */}
                      <TableCell className="text-center">
                        {formData.subs.length > 1 && (
                          <Button
                            size="icon"
                            variant={sub.id ? "destructive" : "secondary"}
                            onClick={() => {
                              if (sub.id) {
                                setSubToDelete({ index: i, id: sub.id });
                                setDeleteConfirmOpen(true);
                              } else {
                                removeSub(i);
                              }
                            }}
                          >
                            {sub.id ? <Trash2 size={16} /> : <X size={14} />}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Button variant="outline" onClick={addSub} className="w-fit">
              + Add Item
            </Button>
          </TabsContent>
        </Tabs>
      </Card>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contract.
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
    </>
  );
};

export default PurchaseForm;
