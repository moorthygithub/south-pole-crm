import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Trash2, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
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
import { useQueryClient } from "@tanstack/react-query";
import { PAYMENT_API } from "@/constants/apiConstants";

/* ================= CONSTANTS ================= */

const SUB_NUMBER_FIELDS = [
  "invoicePSub_amt_adv",
  "invoicePSub_amt_dp",
  "invoicePSub_amt_da",
  "invoicePSub_bank_c",
  "invoicePSub_discount",
  "invoicePSub_shortage",
];

const EMPTY_SUB = {
  id: "",
  invoicePSub_inv_ref: "",
  invoicePSub_amt_adv: "",
  invoicePSub_amt_dp: "",
  invoicePSub_amt_da: "",
  invoicePSub_bank_c: "",
  invoicePSub_discount: "",
  invoicePSub_shortage: "",
  invoicePSub_remarks: "",
};

const INITIAL_STATE = {
  invoiceP_date: "",
  invoiceP_v_date: "",
  branch_short: "",
  invoiceP_usd_amount: "",
  invoiceP_dollar_rate: "",
  invoiceP_irtt_no: "",
  invoiceP_status: "",
  subs: [{ ...EMPTY_SUB }],
};

/* ================= COMPONENT ================= */

const InvoicePaymentForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  const { trigger, loading } = useApiMutation();
  const {
    trigger: fetchPayment,
    loading: loadingData,
    error,
  } = useApiMutation();

  const { branch, paymentamount, paymentstatus } = useMasterQueries([
    "branch",
    "paymentamount",
    "paymentstatus",
  ]);

  /* ================= FETCH EDIT DATA ================= */

  useEffect(() => {
    if (!isEdit) return;

    fetchPayment({ url: PAYMENT_API.getById(id) })
      .then((res) =>
        setFormData({
          ...INITIAL_STATE,
          ...res.data,
        })
      )
      .catch(() => toast.error("Failed to load payment"));
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      if (field === "branch_short") {
        const selectedBranch = branch?.data?.data?.find(
          (b) => b.branch_short === value
        );

        return {
          ...prev,
          branch_short: value,
          branch_name: selectedBranch?.branch_name || "",
        };
      }

      return { ...prev, [field]: value };
    });

    setErrors((p) => ({ ...p, [field]: "" }));
  };
  const handleSubChange = (index, field, value) => {
    setFormData((prev) => {
      const subs = [...prev.subs];

      // numeric validation
      if (
        [
          "invoicePSub_amt_adv",
          "invoicePSub_amt_dp",
          "invoicePSub_amt_da",
          "invoicePSub_bank_c",
          "invoicePSub_discount",
          "invoicePSub_shortage",
        ].includes(field)
      ) {
        if (!/^\d*\.?\d*$/.test(value)) return prev;
      }

      subs[index] = {
        ...subs[index],
        [field]: value,
      };

      return { ...prev, subs };
    });
  };

  const addSub = () =>
    setFormData((p) => ({ ...p, subs: [...p.subs, { ...EMPTY_SUB }] }));

  const removeSub = (index) => {
    if (formData.subs.length === 1) return;
    setFormData((p) => ({
      ...p,
      subs: p.subs.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const e = {};

    if (!formData.invoiceP_date) e.invoiceP_date = "Required";
    if (!formData.branch_short) e.branch_short = "Required";
    if (!formData.invoiceP_v_date) e.invoiceP_v_date = "Required";
    if (!formData.invoiceP_usd_amount) e.invoiceP_usd_amount = "Required";
    if (!formData.invoiceP_dollar_rate) e.invoiceP_dollar_rate = "Required";
    if (!formData.invoiceP_status) e.invoiceP_status = "Required";

    const totalInvoiceSubAmount = formData.subs.reduce(
      (sum, item) =>
        sum +
        (Number(item.invoicePSub_amt_adv) || 0) +
        (Number(item.invoicePSub_amt_dp) || 0) +
        (Number(item.invoicePSub_amt_da) || 0) +
        (Number(item.invoicePSub_bank_c) || 0) +
        (Number(item.invoicePSub_discount) || 0) +
        (Number(item.invoicePSub_shortage) || 0),
      0
    );

    if (Number(formData.invoiceP_usd_amount) !== totalInvoiceSubAmount) {
      e.invoiceP_usd_amount = "Amount Does Not Match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => ({
    invoiceP_date: formData.invoiceP_date,
    invoiceP_v_date: formData.invoiceP_v_date,
    branch_short: formData.branch_short,
    invoiceP_usd_amount: Number(formData.invoiceP_usd_amount),
    invoiceP_dollar_rate: Number(formData.invoiceP_dollar_rate),
    invoiceP_irtt_no: formData.invoiceP_irtt_no,
    invoiceP_status: formData.invoiceP_status,

    subs: formData.subs.map((sub) => ({
      id: Number(sub.id),
      invoicePSub_inv_ref: sub.invoicePSub_inv_ref,
      invoicePSub_amt_adv: Number(sub.invoicePSub_amt_adv),
      invoicePSub_amt_dp: Number(sub.invoicePSub_amt_dp),
      invoicePSub_amt_da: Number(sub.invoicePSub_amt_da),
      invoicePSub_bank_c: Number(sub.invoicePSub_bank_c),
      invoicePSub_discount: Number(sub.invoicePSub_discount),
      invoicePSub_shortage: Number(sub.invoicePSub_shortage),
      invoicePSub_remarks: sub.invoicePSub_remarks,
    })),
  });

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await trigger({
        url: isEdit ? PAYMENT_API.updateById(id) : PAYMENT_API.create,
        method: isEdit ? "PUT" : "POST",
        data: buildPayload(),
      });

      if (res.code === 201) {
        toast.success("Payment saved successfully");
        navigate("/invoice-payment");
        queryClient.invalidateQueries(["invoice-payment-list"]);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (error) return <ApiErrorPage />;
  const isLoading = loading || loadingData;

  return (
    <>
      {isLoading && <LoadingBar />}

      <PageHeader
        icon={User}
        title={isEdit ? "Edit Invoice Payment" : "Create Invoice Payment"}
        description="Manage invoice payment details and information."
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
        {/* ================= HEADER FIELDS ================= */}
        <div className="grid grid-cols-4 gap-4">
          <Field
            label="Payment Date"
            type="date"
            required
            value={formData.invoiceP_date}
            onChange={(v) => handleChange("invoiceP_date", v)}
            error={errors.invoiceP_date}
          />

          <SelectField
            label="Company"
            required
            value={formData.branch_short}
            onChange={(v) => handleChange("branch_short", v)}
            options={branch.data?.data}
            optionKey="branch_short"
            optionLabel="branch_short"
            error={errors.branch_short}
          />

          <Field
            label="Value Date *"
            type="date"
            value={formData.invoiceP_v_date}
            onChange={(v) => handleChange("invoiceP_v_date", v)}
            error={errors.invoiceP_v_date}
          />

          <Field
            label="USD Amount *"
            value={formData.invoiceP_usd_amount}
            onChange={(v) => handleChange("invoiceP_usd_amount", v)}
            error={errors.invoiceP_usd_amount}
          />

          <Field
            label="Dollar Rate *"
            value={formData.invoiceP_dollar_rate}
            onChange={(v) => handleChange("invoiceP_dollar_rate", v)}
            error={errors.invoiceP_dollar_rate}
          />

          <Field
            label="IRTT No"
            value={formData.invoiceP_irtt_no}
            onChange={(v) => handleChange("invoiceP_irtt_no", v)}
          />

          <SelectField
            label="Status"
            required
            value={formData.invoiceP_status}
            onChange={(v) => handleChange("invoiceP_status", v)}
            options={paymentstatus.data?.data}
            optionKey="invoicePaymentStatus"
            optionLabel="invoicePaymentStatus"
            error={errors.invoiceP_status}
          />
        </div>
        <Card className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">Invoice</TableHead>
                <TableHead className="w-[120px] text-center">Adj Adv</TableHead>
                <TableHead className="w-[120px] text-center">Adj DP</TableHead>
                <TableHead className="w-[120px] text-center">Adj DA</TableHead>
                <TableHead className="w-[120px] text-center">Bank Ch</TableHead>
                <TableHead className="w-[120px] text-center">
                  Discount
                </TableHead>
                <TableHead className="w-[120px] text-center">
                  Shortage
                </TableHead>
                <TableHead className="min-w-[150px]">Remarks</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {formData.subs.map((sub, i) => (
                <TableRow key={i}>
                  {/* Invoice */}
                  <TableCell className="w-[220px]">
                    <Select
                      value={sub.invoicePSub_inv_ref}
                      onValueChange={(v) =>
                        handleSubChange(i, "invoicePSub_inv_ref", v)
                      }
                    >
                      <SelectTrigger className="bg-white border border-gray-300">
                        <SelectValue placeholder="Select Payment">
                          {sub.invoicePSub_inv_ref || "Select Payment"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300">
                        {paymentamount.data?.data?.map((status, index) => (
                          <SelectItem key={index} value={status.invoice_ref}>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">
                                {status.invoice_ref}
                              </span>
                              <span className="text-gray-600 text-xs">
                                Amount (USD): {status.invoice_i_value_usd}
                              </span>
                              <span className="text-gray-600 text-xs">
                                Balance: {status.balance}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {SUB_NUMBER_FIELDS.map((field) => (
                    <TableCell key={field} className="w-[110px] text-center">
                      <Field
                        hideLabel
                        value={sub[field]}
                        onChange={(v) => handleSubChange(i, field, v)}
                      />
                    </TableCell>
                  ))}

                  {/* Remarks */}
                  <TableCell className="min-w-[150px]">
                    <Textarea
                      className="min-h-[36px]"
                      value={sub.invoicePSub_remarks}
                      onChange={(e) =>
                        handleSubChange(
                          i,
                          "invoicePSub_remarks",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>

                  {/* Action */}
                  <TableCell className="w-[50px] text-center">
                    {formData.subs.length > 1 && (
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => removeSub(i)}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Button variant="outline" onClick={addSub}>
          + Add Row
        </Button>
      </Card>
    </>
  );
};

export default InvoicePaymentForm;
