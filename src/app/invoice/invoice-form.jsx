import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
import LoadingBar from "@/components/loader/loading-bar";
import Field from "@/components/SelectField/Field";
import SelectField from "@/components/SelectField/SelectField";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CONTRACT_API, INVOICE_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Plus, Trash2, X } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EMPTY_SUB = {
  id: "",
  invoiceSub_item_id: "",
  invoiceSub_qnty: "",
  invoiceSub_mrp: "",
  invoiceSub_item_gst: "",
  invoiceSub_batch_no: "",
  invoiceSub_manufacture_date: "",
  invoiceSub_expire_date: "",
  invoiceSub_selling_rate: "",
  purchase_sub_id: "",
};

const INITIAL_STATE = {
  branch_short: "",
  invoice_date: "",
  contract_date: moment().format("YYYY-MM-DD"),
  invoice_no: "",
  invoice_ref: "",
  contract_ref: "",
  contract_pono: "",
  invoice_buyer_id: "",
  invoice_buyer: "",
  invoice_buyer_add: "",
  invoice_consignee_id: "",
  invoice_consignee: "",
  invoice_consignee_add: "",
  invoice_consig_bank: "",
  invoice_consig_bank_address: "",
  invoice_container_size: "",
  invoice_product: "",
  invoice_product_cust_des: "",
  invoice_gr_code: "",
  invoice_lut_code: "",
  invoice_vessel_flight_no: "",

  invoice_loading: "",
  invoice_prereceipts: "",
  invoice_precarriage: "",

  invoice_destination_port: "",
  invoice_discharge: "",
  invoice_cif: "",
  invoice_destination_country: "",

  invoice_dollar_rate: "",
  invoice_payment_terms: "",
  invoice_remarks: "",
  invoice_status: "Open",

  subs: [{ ...EMPTY_SUB }],
};
const REQUIRED_FIELDS = {
  invoice_buyer: "Buyer is required",
  invoice_consignee: "Consignee is required",
  branch_short: "Company is required",
  invoice_no: "Invoice No is required",
  invoice_ref: "Ref is required",
  contract_pono: "Pono is required",
  invoice_date: "Invoice Date is required",
  contract_date: "Contract Date is required",
  invoice_loading: "Port is required",
  invoice_product_cust_des: "Cust Des  is required",
  invoice_destination_port: "Destination Port is required",
  invoice_destination_country: "Destination Country is required",
  invoice_discharge: "Discharge is required",
  invoice_cif: "CIF is required",
  invoice_gr_code: "GR Code is required",
  invoice_lut_code: "Lut Code is required",
  invoice_container_size: "Container/Size is required",
  invoice_dollar_rate: "Dollor Rate is required",
  invoice_payment_terms: "Payment Terms is required",
};
const InvoiceForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [invoiceNoOptions, setInvoiceNoOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const { trigger, loading } = useApiMutation();
  const { trigger: fetchRef, loading: refloading, referror } = useApiMutation();
  const [batchOptionsByRow, setBatchOptionsByRow] = useState({});
  const [openQtyDialog, setOpenQtyDialog] = useState(false);
  const [validationResult, setValidationResult] = useState([]);
  const [contractSubs, setContractSubs] = useState([]);
  const {
    trigger: fetchConractRef,
    loading: contractrefloading,
    contractreferror,
  } = useApiMutation();
  const { trigger: fetchData, loading: loadingData, error } = useApiMutation();
  const {
    trigger: Deletetrigger,
    loading: loadingdelete,
    error: deleteerror,
  } = useApiMutation();
  const [step, setStep] = useState(1);

  const master = useMasterQueries([
    "branch",
    "buyer",
    "countryPort",
    "port",
    "paymentterm",
    "product",
    "item",
    "year",
    "country",
    "container",
    "grcode",
    "prereceipt",
    "precarriage",
    "scheme",
    "contractref",
    "bank",
    "invoicestatus",
    "activepurchaseother",
  ]);

  const {
    data: branchData,
    loading: loadingBranch,
    error: branchError,
    refetch: refetchBranch,
  } = master.branch;
  const {
    data: buyerData,
    loading: loadingBuyer,
    error: buyerError,
    refetch: refetchBuyer,
  } = master.buyer;

  const {
    data: countryPortData,
    loading: loadingCountryPort,
    error: countryPortError,
    refetch: refetchCountryPort,
  } = master.countryPort;

  const {
    data: portData,
    loading: loadingPort,
    error: portError,
    refetch: refetchPort,
  } = master.port;
  const {
    data: prereceiptData,
    loading: loadingprereceipt,
    error: prereceiptError,
    refetch: refetchprereceipt,
  } = master.prereceipt;
  const {
    data: precarriageData,
    loading: loadingprecarriage,
    error: precarriageError,
    refetch: refetchprecarriage,
  } = master.precarriage;

  const {
    data: paymentTermData,
    loading: loadingPaymentTerm,
    error: paymentTermError,
    refetch: refetchPaymentTerm,
  } = master.paymentterm;

  const {
    data: productData,
    loading: loadingProduct,
    error: productError,
    refetch: refetchProduct,
  } = master.product;
  const {
    data: itemData,
    loading: loadingItem,
    error: itemError,
    refetch: refetchItem,
  } = master.item;
  const {
    data: yearData,
    loading: loadingYear,
    error: yearError,
    refetch: refetchYear,
  } = master.year;
  const {
    data: countryData,
    loading: loadingcountry,
    error: countryError,
    refetch: refetchcountry,
  } = master.country;
  const {
    data: containerData,
    loading: loadingcontainer,
    error: containerError,
    refetch: refetchcontainer,
  } = master.container;
  const {
    data: grcodeData,
    loading: loadinggrcode,
    error: grcodeError,
    refetch: refetchgrcode,
  } = master.grcode;
  const {
    data: schemeData,
    loading: loadingscheme,
    error: schemeError,
    refetch: refetchscheme,
  } = master.scheme;
  const {
    data: ContractrefData,
    loading: loadingcontractref,
    error: contractrefError,
    refetch: refetchcontractref,
  } = master.contractref;
  const {
    data: invoiceStatusData,
    loading: loadinginvoicestatus,
    error: invoicestatusError,
    refetch: refetchinvoicestatus,
  } = master.invoicestatus;
  const {
    data: activePurchaseItemOther,
    loading: loadingPurchaseItemOther,
    error: PurchaseItemOtherError,
    refetch: refetchPurchaseItemOther,
  } = master.activepurchaseother;
  useEffect(() => {
    if (!isEdit || !id || !activePurchaseItemOther?.data) return;

    (async () => {
      try {
        const res = await fetchData({ url: INVOICE_API.getById(id) });
        const data = res?.data || {};

        const subsFromInvoice =
          Array.isArray(data.subs) && data.subs.length > 0
            ? data.subs.map((s) => ({
                id: s.id ?? "",
                invoiceSub_ref: s.invoiceSub_ref ?? "",
                invoiceSub_item_id: String(s.invoiceSub_item_id ?? ""),
                purchase_sub_id: s.purchase_sub_id ?? "",
                invoiceSub_qnty: s.invoiceSub_qnty ?? "",
                invoiceSub_mrp: s.invoiceSub_mrp ?? "",
                invoiceSub_item_gst: s.invoiceSub_item_gst ?? "",
                // invoiceSub_batch_no: s.invoiceSub_batch_no ?? "",
                invoiceSub_manufacture_date:
                  s.invoiceSub_manufacture_date ?? "",
                invoiceSub_expire_date: s.invoiceSub_expire_date ?? "",
                invoiceSub_selling_rate: s.invoiceSub_selling_rate ?? "",
                item_hsn_code: s.item_hsn_code ?? "",
                item_brand_name: s.item_brand_name ?? "",
                item_generic_name: s.item_generic_name ?? "",
                item_company_name: s.item_company_name ?? "",
              }))
            : [{ ...EMPTY_SUB }];

        const batchMap = {};

        subsFromInvoice.forEach((sub, idx) => {
          const relatedBatches =
            activePurchaseItemOther?.data?.filter(
              (p) => String(p.id) === String(sub.purchase_sub_id)
            ) || [];

          batchMap[idx] = relatedBatches;

          const batchIndex = relatedBatches.findIndex(
            (p) => String(p.id) === String(sub.purchase_sub_id)
          );

          if (batchIndex !== -1) {
            sub.invoiceSub_batch_no = String(relatedBatches[batchIndex].id);
          } else {
            sub.invoiceSub_batch_no = "";
          }
        });

        setBatchOptionsByRow(batchMap);

        setFormData({
          ...INITIAL_STATE,
          branch_short: data.branch_short ?? "",
          branch_name: data.branch_name ?? "",
          branch_address: data.branch_address ?? "",
          contract_date: data.contract_date
            ? moment(data.contract_date).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
          invoice_date: data.invoice_date
            ? moment(data.invoice_date).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
          invoice_no: data.invoice_no ?? "",
          invoice_ref: data.invoice_ref ?? "",
          contract_ref: data.contract_ref ?? "",
          contract_pono: data.contract_pono ?? "",
          invoice_buyer_id: data.invoice_buyer_id ?? "",
          invoice_buyer: data.invoice_buyer ?? "",
          invoice_buyer_add: data.invoice_buyer_add ?? "",
          invoice_consignee_id: data.invoice_consignee_id ?? "",
          invoice_consignee: data.invoice_consignee ?? "",
          invoice_consignee_add: data.invoice_consignee_add ?? "",
          invoice_consig_bank: data.invoice_consig_bank ?? "",
          invoice_consig_bank_address: data.invoice_consig_bank_address ?? "",
          invoice_container_size: data.invoice_container_size ?? "",
          invoice_product: data.invoice_product ?? "",
          invoice_product_cust_des: data.invoice_product_cust_des ?? "",
          invoice_gr_code: data.invoice_gr_code ?? "",
          invoice_lut_code: data.invoice_lut_code ?? "",
          invoice_vessel_flight_no: data.invoice_vessel_flight_no ?? "",
          invoice_loading: data.invoice_loading ?? "",
          invoice_prereceipts: data.invoice_prereceipts ?? "",
          invoice_precarriage: data.invoice_precarriage ?? "",
          invoice_destination_port: data.invoice_destination_port ?? "",
          invoice_discharge: data.invoice_discharge ?? "",
          invoice_cif: data.invoice_cif ?? "",
          invoice_destination_country: data.invoice_destination_country ?? "",
          invoice_dollar_rate: data.invoice_dollar_rate ?? "",
          invoice_payment_terms: data.invoice_payment_terms ?? "",
          invoice_remarks: data.invoice_remarks ?? "",
          invoice_status: data.invoice_status ?? "Open",
          subs: subsFromInvoice,
        });
      } catch (err) {
        console.error("Failed to fetch invoice data:", err);
        toast.error(err.message || "Failed to fetch invoice data");
      }
    })();
  }, [id, isEdit, activePurchaseItemOther?.data]);

  const clearErrors = (...keys) => {
    setErrors((prev) => {
      const copy = { ...prev };
      keys.forEach((k) => delete copy[k]);
      return copy;
    });
  };

  const handleChange = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
    clearErrors(name);
  };

  const handleSelectChange = async (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));

    if (name === "contract_ref") {
      const res = await fetchConractRef({
        url: CONTRACT_API.getActiveContractRefwithData,
        method: "POST",
        data: { contract_ref: value },
      });

      const data = res?.data;
      if (!data) return;
      const resdata = await fetchRef({
        url: `${INVOICE_API.geInvoiceNo}/${data.branch_short}`,
        method: "get",
      });

      const options = resdata?.data
        ? [{ invoice_no: String(resdata.data) }]
        : [];
      setInvoiceNoOptions(options);
      const subsFromContract =
        data.subs?.length > 0
          ? data.subs.map((s) => ({
              id: "",
              invoiceSub_item_id: String(s.contractSub_item_id),
              invoiceSub_qnty: s.contractSub_qnty,
              invoiceSub_selling_rate: s.contractSub_selling_rate,
              invoiceSub_item_gst: s.contractSub_item_gst,
            }))
          : [{ ...EMPTY_SUB }];
      const batchMap = {};

      subsFromContract.forEach((sub, index) => {
        batchMap[index] =
          activePurchaseItemOther?.data?.filter(
            (p) =>
              String(p.purchaseSub_item_id) == String(sub.invoiceSub_item_id)
          ) || [];
      });
      setContractSubs(subsFromContract);

      setBatchOptionsByRow(batchMap);
      setFormData((p) => ({
        ...p,

        // ===== BASIC =====
        contract_ref: data.contract_ref,
        contract_pono: data.contract_pono,
        branch_short: data.branch_short,
        contract_date: data.contract_date,
        invoice_ref: `${data.branch_short}/${data.contract_buyer}${data.contract_year}${data.contract_no}`,

        // ===== BUYER =====
        invoice_buyer_id: data.contract_buyer_id,
        invoice_buyer: data.contract_buyer,
        invoice_buyer_add: data.contract_buyer_add,

        // ===== CONSIGNEE =====
        invoice_consignee_id: data.contract_consignee_id,
        invoice_consignee: data.contract_consignee,
        invoice_consignee_add: data.contract_consignee_add,

        // ===== PRODUCT / LOGISTICS =====
        invoice_container_size: data.contract_container_size,
        invoice_product: data.contract_product,
        invoice_product_cust_des: data.contract_product_cust_des ?? "",
        invoice_gr_code: data.contract_gr_code,
        invoice_lut_code: data.contract_lut_code,
        invoice_vessel_flight_no: data.contract_vessel_flight_no ?? "",

        invoice_loading: data.contract_loading,
        invoice_prereceipts: data.contract_prereceipts ?? "",
        invoice_precarriage: data.contract_precarriage ?? "",

        invoice_destination_port: data.contract_destination_port,
        invoice_discharge: data.contract_discharge,
        invoice_cif: data.contract_cif,
        invoice_destination_country: data.contract_destination_country,

        invoice_payment_terms: data.contract_payment_terms ?? "",
        invoice_remarks: data.contract_remarks ?? "",

        subs:
          p.subs?.length && p.subs[0].invoiceSub_item_id
            ? p.subs
            : subsFromContract,
      }));

      clearErrors(
        "contract_ref",
        "contract_pono",
        "branch_short",
        "invoice_buyer",
        "invoice_consignee",
        "invoice_destination_port",
        "invoice_discharge",
        "invoice_cif",
        "invoice_destination_country"
      );

      return;
    }

    if (name === "branch_short") {
      const selectedBranch = branchData?.data?.find(
        (b) => b.branch_short === value
      );

      const res = await fetchRef({
        url: `${INVOICE_API.geInvoiceNo}/${value}`,
        method: "get",
      });

      const options = res?.data ? [{ invoice_no: String(res.data) }] : [];
      const ref = selectedBranch
        ? `${selectedBranch.branch_name_short}/${
            formData.buyer_sort ? formData.buyer_sort : ""
          }${yearData?.data?.current_year}${formData.invoice_no}`
        : "";
      setInvoiceNoOptions(options);

      setFormData((p) => ({
        ...p,
        branch_short: value,
        branch_name: selectedBranch?.branch_name || "",
        branch_address: selectedBranch?.branch_address || "",
        invoice_loading: selectedBranch?.branch_port_of_loading || "",
        invoice_no: "",
        invoice_ref: ref,
      }));
      clearErrors("branch_short", "invoice_loading", "invoice_no");
      return;
    }

    if (name === "invoice_buyer") {
      const selectedBuyer = buyerData?.data?.find(
        (x) => x.buyer_name === value
      );

      if (!selectedBuyer) return;

      const branch = branchData?.data?.find(
        (b) => b.branch_short == formData.branch_short
      );
      const ref = branch
        ? `${branch.branch_name_short}/${selectedBuyer.buyer_sort}${yearData?.data?.current_year}${formData.invoice_no}`
        : "";
      const validPort = countryPortData?.data?.some(
        (p) => p.country_port === selectedBuyer.buyer_port
      );
      const destinationPort = validPort ? selectedBuyer.buyer_port : "";
      const validCountry = countryData?.data?.some(
        (p) => p.country_port === selectedBuyer.buyer_port
      );
      setFormData((p) => ({
        ...p,
        invoice_buyer: value,
        invoice_buyer_id: selectedBuyer.id,
        invoice_buyer_add: selectedBuyer.buyer_address,
        invoice_destination_country: validCountry
          ? selectedBuyer.buyer_country
          : "",
        invoice_ref: ref,
        invoice_destination_port: destinationPort,
        invoice_discharge: destinationPort,
        invoice_cif: destinationPort,
      }));
      clearErrors("invoice_buyer", "invoice_consignee");

      if (validCountry) {
        clearErrors("invoice_destination_country");
      }

      if (destinationPort) {
        clearErrors(
          "invoice_destination_port",
          "invoice_discharge",
          "invoice_cif"
        );
      }
      return;
    }
    if (name == "invoice_consig_bank") {
      const selectedBank = buyerData?.data?.find((x) => x.buyer_name === value);
      if (!selectedBank) return;

      setFormData((p) => ({
        ...p,
        invoice_consig_bank_address: selectedBank.buyer_address,
      }));

      return;
    }
    if (name === "invoice_consignee") {
      const selectedBuyer = buyerData?.data?.find(
        (x) => x.buyer_name === value
      );

      if (!selectedBuyer) return;

      setFormData((p) => ({
        ...p,
        invoice_consignee: selectedBuyer.buyer_name,
        invoice_consignee_add: selectedBuyer.buyer_address,
        invoice_consignee_id: selectedBuyer.id,
      }));
      clearErrors("invoice_consignee");

      return;
    }

    if (name === "invoice_destination_country") {
      const cp = countryPortData?.data?.find((x) => x.country_port === value);
      const validCountry = countryData?.data?.some(
        (p) => p.country_port === cp.buyer_port
      );
      console.log(validCountry);
      setFormData((p) => ({
        ...p,
        invoice_destination_port: value,
        invoice_discharge: value,
        invoice_cif: value,
        invoice_destination_country: validCountry ? cp?.country_name : "",
      }));
      clearErrors(
        "invoice_destination_country",
        "invoice_discharge",
        "invoice_cif"
      );
      if (validCountry) {
        clearErrors("contract_destination_country");
      }
      return;
    }

    if (name === "invoice_no") {
      const branch = branchData?.data?.find(
        (b) => b.branch_short === formData.branch_short
      );

      const buyer = buyerData?.data?.find(
        (b) => b.buyer_name === formData.invoice_buyer
      );

      const ref =
        branch && buyer
          ? `${branch.branch_name_short}/${buyer.buyer_sort}${yearData?.data?.current_year}${value}`
          : "";

      setFormData((p) => ({
        ...p,
        invoice_no: value,
        invoice_ref: ref,
      }));
      clearErrors("invoice_no", "invoice_ref");
    }
    clearErrors(name);
  };
  const validateContractDetails = () => {
    const newErrors = {};

    Object.keys(REQUIRED_FIELDS).forEach((key) => {
      const value = formData[key];
      if (!value) newErrors[key] = REQUIRED_FIELDS[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateForm = () => {
    const newErrors = {};

    Object.keys(REQUIRED_FIELDS).forEach((key) => {
      const value = formData[key];

      if (value === "" || value === null || value === undefined) {
        newErrors[key] = REQUIRED_FIELDS[key];
      }
    });

    formData.subs.forEach((row, idx) => {
      if (!row.invoiceSub_item_id) {
        newErrors[`subs.${idx}.invoiceSub_item_id`] = "Item is required";
      }
      if (!row.invoiceSub_qnty) {
        newErrors[`subs.${idx}.invoiceSub_qnty`] = "Qty is required";
      }
      if (!row.invoiceSub_mrp) {
        newErrors[`subs.${idx}.invoiceSub_mrp`] = "Mrp is required";
      }
      if (!row.invoiceSub_item_gst) {
        newErrors[`subs.${idx}.invoiceSub_item_gst`] = "Item Gst required";
      }
      if (!row.invoiceSub_batch_no) {
        newErrors[`subs.${idx}.invoiceSub_batch_no`] = "Batch No required";
      }
      if (!row.invoiceSub_manufacture_date) {
        newErrors[`subs.${idx}.invoiceSub_manufacture_date`] =
          "Manuf Date is required";
      }
      if (!row.invoiceSub_expire_date) {
        newErrors[`subs.${idx}.invoiceSub_expire_date`] =
          "Expire Date is required";
      }
      if (!row.invoiceSub_selling_rate) {
        newErrors[`subs.${idx}.invoiceSub_selling_rate`] =
          "Selling Price is required";
      }
    });
    console.log(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateBatchQuantities = () => {
    const contractQtyMap = {};
    const itemQtyMap = {};
    const result = [];

    // ===== Contract Qty =====
    contractSubs.forEach((sub) => {
      if (!sub.invoiceSub_item_id) return;

      const key = String(sub.invoiceSub_item_id);
      contractQtyMap[key] =
        (contractQtyMap[key] || 0) + Number(sub.invoiceSub_qnty || 0);
    });

    // ===== Entered Qty =====
    formData.subs.forEach((sub) => {
      if (!sub.invoiceSub_item_id) return;

      const key = String(sub.invoiceSub_item_id);
      itemQtyMap[key] =
        (itemQtyMap[key] || 0) + Number(sub.invoiceSub_qnty || 0);
    });

    // ===== Compare Contract Items =====
    for (const itemId in contractQtyMap) {
      const contractQty = contractQtyMap[itemId] || 0;
      const enteredQty = itemQtyMap[itemId] || 0;

      const itemName =
        itemData?.data?.find((i) => String(i.id) === itemId)?.item_brand_name ||
        "Item";

      if (contractQty === enteredQty) {
        result.push({
          itemId,
          itemName,
          status: "ok",
          contractQty,
          enteredQty,
        });
      } else {
        result.push({
          itemId,
          itemName,
          status: "mismatch",
          contractQty,
          enteredQty,
        });
      }
    }

    // ===== Extra Items (Not in Contract) =====
    for (const itemId in itemQtyMap) {
      if (!contractQtyMap[itemId]) {
        const itemName =
          itemData?.data?.find((i) => String(i.id) === itemId)
            ?.item_brand_name || "Item";

        result.push({
          itemId,
          itemName,
          status: "extra",
          contractQty: 0,
          enteredQty: itemQtyMap[itemId],
        });
      }
    }

    const hasError = result.some((r) => r.status !== "ok");

    return {
      hasError,
      details: result,
    };
  };

  const submitInvoice = async () => {
    try {
      if (!isEdit) {
        const refCheckRes = await trigger({
          url: INVOICE_API.checkInvoiceRef,
          method: "POST",
          data: { invoice_ref: formData.invoice_ref },
        });

        if (refCheckRes?.code !== 201) {
          toast.error(
            refCheckRes?.message || "Invoice reference already exists"
          );
          return;
        }
      }

      const res = await trigger({
        url: isEdit ? INVOICE_API.updateById(id) : INVOICE_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Invoice saved successfully");
        queryClient.invalidateQueries(["invoice-list"]);
        navigate("/invoice");
        return;
      }

      toast.error(res?.message || "Something went wrong");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    const validation = validateBatchQuantities();

    if (validation.hasError) {
      setValidationResult(validation.details);
      setOpenQtyDialog(true);
      return;
    }

    // ✅ All good → direct submit
    submitInvoice();
  };

  const handleSubChange = (index, key, value) => {
    setFormData((prev) => {
      const subs = [...prev.subs];
      subs[index] = {
        ...subs[index],
        [key]: value,
      };

      if (key === "invoiceSub_item_id") {
        const selectedItem = itemData?.data?.find(
          (item) => String(item.id) === String(value)
        );

        subs[index].invoiceSub_item_gst = selectedItem?.item_gst ?? "";
        const relatedBatches =
          activePurchaseItemOther?.data?.filter(
            (p) => String(p.purchaseSub_item_id) === String(value)
          ) || [];

        setBatchOptionsByRow((prevBatches) => ({
          ...prevBatches,
          [index]: relatedBatches,
        }));
        subs[index].invoiceSub_batch_no = "";
      }
      if (key === "invoiceSub_batch_no") {
        const selectedBatch = activePurchaseItemOther?.data?.find(
          (item) => String(item.id) === String(value)
        );
        subs[index].invoiceSub_manufacture_date =
          selectedBatch?.purchaseSub_manufacture_date ?? "";
        subs[index].invoiceSub_expire_date =
          selectedBatch?.purchaseSub_expire_date ?? "";
        subs[index].invoiceSub_mrp = selectedBatch?.purchaseSub_mrp ?? "";
        subs[index].purchase_sub_id = selectedBatch?.id ?? "";
      }
      return {
        ...prev,
        subs,
      };
    });

    if (key === "invoiceSub_batch_no") {
      clearErrors(
        `subs.${index}.invoiceSub_batch_no`,
        `subs.${index}.invoiceSub_manufacture_date`,
        `subs.${index}.invoiceSub_expire_date`,
        `subs.${index}.invoiceSub_mrp`
      );
    } else {
      clearErrors(`subs.${index}.${key}`);
    }
  };

  const addSub = () => {
    setFormData((p) => ({
      ...p,
      subs: [...p.subs, { ...EMPTY_SUB }],
    }));
  };
  const removeSub = (index) => {
    setFormData((p) => ({
      ...p,
      subs:
        p.subs.length === 1
          ? [{ ...EMPTY_SUB }]
          : p.subs.filter((_, i) => i !== index),
    }));
  };
  const addBatchBelowRow = (index) => {
    setFormData((prev) => {
      const subs = [...prev.subs];
      const current = subs[index];

      const newSub = {
        ...EMPTY_SUB,

        // keep SAME item
        invoiceSub_item_id: current.invoiceSub_item_id,
        invoiceSub_item_gst: current.invoiceSub_item_gst,

        // clear batch-specific fields
        invoiceSub_batch_no: "",
        invoiceSub_manufacture_date: "",
        invoiceSub_expire_date: "",
        invoiceSub_mrp: "",
        invoiceSub_selling_rate: "",
        purchase_sub_id: "",
      };

      subs.splice(index + 1, 0, newSub);

      return { ...prev, subs };
    });

    // reuse same batch options for the new row
    setBatchOptionsByRow((prev) => ({
      ...prev,
      [index + 1]: prev[index] || [],
    }));
  };

  const confirmDelete = async () => {
    if (!subToDelete) return;

    try {
      const res = await Deletetrigger({
        url: INVOICE_API.deleteSubs(subToDelete.id),
        method: "DELETE",
      });
      if (res.code == 201) {
        toast.success("Sub item deleted successfully");

        setFormData((p) => ({
          ...p,
          subs: p.subs.filter((_, i) => i !== subToDelete.index),
        }));
      } else {
        toast.error(err.message || "Failed to delete sub item");

        setErrors((p) => {
          const newErrors = { ...p };
          Object.keys(newErrors).forEach((key) => {
            if (key.startsWith(`sub_${subToDelete.index}_`))
              delete newErrors[key];
          });
          return newErrors;
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete sub item");
    } finally {
      setDeleteConfirmOpen(false);
      setSubToDelete(null);
    }
  };
  if (
    error ||
    branchError ||
    buyerError ||
    countryPortError ||
    portError ||
    paymentTermError ||
    productError ||
    itemError ||
    referror ||
    yearError ||
    countryError ||
    containerError ||
    grcodeError ||
    schemeError ||
    precarriageError ||
    prereceiptError ||
    contractrefError ||
    invoicestatusError ||
    contractreferror ||
    PurchaseItemOtherError
  ) {
    return (
      <ApiErrorPage
        onRetry={() => {
          refetchBranch();
          refetchBuyer();
          refetchCountryPort();
          refetchPort();
          refetchPaymentTerm();
          refetchProduct();
          refetchItem();
          refetchYear();
          refetchcountry();
          refetchcontainer();
          refetchgrcode();
          refetchscheme();
          refetchprereceipt();
          refetchprecarriage();
          refetchcontractref();
          refetchinvoicestatus();
          fetchConractRef();
          refetchPurchaseItemOther();
        }}
      />
    );
  }

  const isLoading =
    loading ||
    loadingData ||
    refloading ||
    loadingBranch ||
    loadingBuyer ||
    loadingCountryPort ||
    loadingPort ||
    loadingPaymentTerm ||
    loadingProduct ||
    loadingItem ||
    loadingYear ||
    loadingcountry ||
    loadingcontainer ||
    loadinggrcode ||
    loadingscheme ||
    loadingprereceipt ||
    loadingprecarriage ||
    loadingcontractref ||
    loadinginvoicestatus ||
    contractrefloading ||
    loadingdelete ||
    loadingPurchaseItemOther;

  return (
    <>
      {isLoading && <LoadingBar />}

      <PageHeader
        icon={FileText}
        title={isEdit ? "Edit Invoice" : "Create Invoice"}
        rightContent={
          <div className="flex gap-2">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            )}

            {step === 1 ? (
              <>
                <Button
                  onClick={() => {
                    if (!validateContractDetails()) {
                      toast.error("Please fill required contract details");
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Next
                </Button>
                {isEdit && (
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEdit ? "Update" : "Create"}
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Update" : "Create"}
              </Button>
            )}
          </div>
        }
      />
      <Card className="p-4 space-y-6">
        <Tabs
          defaultValue="form"
          className="w-full"
          value={step === 1 ? "form" : "items"}
          onValueChange={(value) => {
            if (value === "items") {
              setStep(2);
            } else {
              setStep(1);
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Invoice Details</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>
          <TabsContent value="form" className="pt-4">
            <Card className="p-4 space-y-6">
              <div className="mb-0">
                <div className="grid md:grid-cols-4 gap-4">
                  <SelectField
                    label="Contract Ref"
                    required
                    value={formData.contract_ref}
                    onChange={(v) => handleSelectChange("contract_ref", v)}
                    options={ContractrefData?.data}
                    optionKey="contract_ref"
                    optionLabel="contract_ref"
                    error={errors.contract_ref}
                  />

                  <SelectField
                    label="Buyer"
                    required
                    value={formData.invoice_buyer}
                    onChange={(v) => handleSelectChange("invoice_buyer", v)}
                    options={buyerData?.data}
                    optionKey="buyer_name"
                    optionLabel="buyer_name"
                    error={errors.invoice_buyer}
                  />

                  <SelectField
                    label="Consignee"
                    required
                    value={formData.invoice_consignee}
                    onChange={(v) => handleSelectChange("invoice_consignee", v)}
                    options={buyerData?.data}
                    optionKey="buyer_name"
                    optionLabel="buyer_name"
                    error={errors.invoice_consignee}
                  />
                  <SelectField
                    label="Bank"
                    value={formData.invoice_consig_bank}
                    onChange={(v) =>
                      handleSelectChange("invoice_consig_bank", v)
                    }
                    options={buyerData?.data}
                    optionKey="buyer_name"
                    optionLabel="buyer_name"
                  />
                  <SelectField
                    label="Company"
                    required
                    value={formData.branch_short}
                    onChange={(v) => handleSelectChange("branch_short", v)}
                    options={branchData?.data}
                    optionKey="branch_short"
                    optionLabel="branch_short"
                    error={errors.branch_short}
                  />
                  <Textarea
                    value={formData.invoice_buyer_add || ""}
                    className="text-[9px] bg-white"
                    onChange={(e) =>
                      handleChange("invoice_buyer_add", e.target.value)
                    }
                  />

                  <Textarea
                    value={formData.invoice_consignee_add || ""}
                    className="text-[9px] bg-white"
                    onChange={(e) =>
                      handleChange("invoice_consignee_add", e.target.value)
                    }
                  />
                  <Textarea
                    value={formData.invoice_consig_bank_address || ""}
                    className="text-[9px] bg-white"
                    onChange={(e) =>
                      handleChange(
                        "invoice_consig_bank_address",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="mt-[2px]">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {!isEdit ? (
                    <SelectField
                      label="Invoice No "
                      required
                      value={formData.invoice_no}
                      onChange={(v) => handleSelectChange("invoice_no", v)}
                      options={invoiceNoOptions}
                      optionKey="invoice_no"
                      optionLabel="invoice_no"
                      error={errors.invoice_no}
                    />
                  ) : (
                    <Field
                      label="Invoice No"
                      value={formData.invoice_no}
                      disabled
                    />
                  )}
                  <Field
                    label="Invoice Ref *"
                    value={formData.invoice_ref}
                    disabled
                    error={errors.invoice_ref}
                  />
                  <Field
                    label="Invoice Date *"
                    type="date"
                    value={formData.invoice_date}
                    onChange={(v) => handleChange("invoice_date", v)}
                    error={errors.invoice_date}
                  />
                  <Field
                    label="Contract Date *"
                    type="date"
                    value={formData.contract_date}
                    onChange={(v) => handleChange("contract_date", v)}
                    error={errors.contract_date}
                    disabled
                  />
                  <Field
                    label="Contract Ref *"
                    value={formData.contract_ref}
                    disabled
                    error={errors.contract_ref}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Field
                  label="Contract Pono *"
                  value={formData.contract_pono}
                  onChange={(v) => handleChange("contract_pono", v)}
                  error={errors.contract_pono}
                />
                <SelectField
                  label="Product"
                  required
                  value={formData.invoice_product}
                  onChange={(v) => handleChange("invoice_product", v)}
                  options={productData?.data}
                  optionKey="product_name"
                  optionLabel="product_name"
                  error={errors.invoice_product}
                />

                <SelectField
                  label="Port of Loading"
                  required
                  value={formData.invoice_loading}
                  onChange={(v) => handleChange("invoice_loading", v)}
                  options={portData?.data}
                  optionKey="portofLoading"
                  optionLabel="portofLoading"
                  error={errors.invoice_loading}
                />

                <SelectField
                  label="Destination Port"
                  required
                  value={formData.invoice_destination_port}
                  onChange={(v) =>
                    handleSelectChange("invoice_destination_port", v)
                  }
                  options={countryPortData?.data}
                  optionKey="country_port"
                  optionLabel="country_port"
                  error={errors.invoice_destination_port}
                />
                {/* </div>

        <div className="grid grid-cols-1  md:grid-cols-5 gap-4"> */}
                <SelectField
                  label="Port of Discharge"
                  required
                  value={formData.invoice_discharge}
                  onChange={(v) => handleSelectChange("invoice_discharge", v)}
                  options={countryPortData?.data}
                  optionKey="country_port"
                  optionLabel="country_port"
                  error={errors.invoice_discharge}
                />

                <SelectField
                  label="CIF"
                  required
                  value={formData.invoice_cif}
                  onChange={(v) => handleSelectChange("invoice_cif", v)}
                  options={countryPortData?.data}
                  optionKey="country_port"
                  optionLabel="country_port"
                  error={errors.invoice_cif}
                />

                <SelectField
                  label="Dest Country"
                  required
                  value={formData.invoice_destination_country}
                  onChange={(v) =>
                    handleSelectChange("invoice_destination_country", v)
                  }
                  options={countryData?.data}
                  optionKey="country_name"
                  optionLabel="country_name"
                  error={errors.invoice_destination_country}
                />
                <SelectField
                  label="Container Size"
                  required
                  value={formData.invoice_container_size}
                  onChange={(v) => handleChange("invoice_container_size", v)}
                  options={containerData?.data}
                  optionKey="containerSize"
                  optionLabel="containerSize"
                  error={errors.invoice_container_size}
                />

                <SelectField
                  label="GR Code"
                  required
                  value={formData.invoice_gr_code}
                  onChange={(v) => handleChange("invoice_gr_code", v)}
                  options={grcodeData?.data}
                  optionKey="product_name"
                  optionLabel="product_name"
                  error={errors.invoice_gr_code}
                />
                {/* </div>

        <div className="grid md:grid-cols-4 gap-4"> */}
                <SelectField
                  label="LUT Code"
                  required
                  value={formData.invoice_lut_code}
                  onChange={(v) => handleChange("invoice_lut_code", v)}
                  error={errors.invoice_lut_code}
                  options={schemeData?.data}
                  optionKey="scheme_short"
                  optionLabel="scheme_short"
                />

                <Field
                  label="Vessel / Flight No"
                  value={formData.invoice_vessel_flight_no}
                  onChange={(v) => handleChange("invoice_vessel_flight_no", v)}
                />

                <SelectField
                  label="Pre-Receipt"
                  value={formData.invoice_prereceipts}
                  onChange={(v) => handleChange("invoice_prereceipts", v)}
                  options={prereceiptData?.data}
                  optionKey="prereceipts_name"
                  optionLabel="prereceipts_name"
                />
                <SelectField
                  label="Pre-Carriage"
                  value={formData.invoice_precarriage}
                  onChange={(v) => handleChange("invoice_precarriage", v)}
                  options={precarriageData?.data}
                  optionKey="precarriage_name"
                  optionLabel="precarriage_name"
                />
                {/* </div>

        <div
          className={`grid gap-4 ${
            isEdit ? "md:grid-cols-5" : "md:grid-cols-4"
          }`}
        > */}
                <Field
                  label="Customer Description *"
                  value={formData.invoice_product_cust_des}
                  onChange={(v) => handleChange("invoice_product_cust_des", v)}
                  error={errors.invoice_product_cust_des}
                />
                <Field
                  label="Dollar Rate *"
                  type="number"
                  value={formData.invoice_dollar_rate}
                  onChange={(v) => handleChange("invoice_dollar_rate", v)}
                  error={errors.invoice_dollar_rate}
                />
              </div>

              <div
                className={`grid gap-4 ${
                  isEdit ? "md:grid-cols-5" : "md:grid-cols-4"
                }`}
              >
                {isEdit && (
                  <div className="col-span-1">
                    <Label className="text-sm font-medium">Status</Label>

                    <Select
                      value={formData.invoice_status}
                      onValueChange={(v) => handleChange("invoice_status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        {invoiceStatusData?.data?.map((item) => (
                          <SelectItem
                            key={item.invoice_status}
                            value={item.invoice_status}
                          >
                            <div className="flex items-center gap-2">
                              {/* Optional: Add colored dot based on status */}
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  item.invoice_status === "Order Cancelled"
                                    ? "bg-red-400"
                                    : "bg-green-400"
                                }`}
                              />
                              {item.invoice_status}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="col-span-2">
                  <SelectField
                    label="Payment Terms"
                    required
                    value={formData.invoice_payment_terms}
                    onChange={(v) => handleChange("invoice_payment_terms", v)}
                    options={paymentTermData?.data}
                    optionKey="paymentTerms"
                    optionLabel="paymentTerms"
                    error={errors.invoice_payment_terms}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Remarks</Label>
                  <Textarea
                    value={formData.invoice_remarks}
                    onChange={(e) =>
                      handleChange("invoice_remarks", e.target.value)
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="items" className="pt-4">
            <>
              <Card className="p-0 overflow-hidden rounded-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[25%]">Item *</TableHead>
                      <TableHead className="w-[12%]">Batch *</TableHead>

                      <TableHead className="w-[15%]">Manufacture *</TableHead>
                      <TableHead className="w-[13%]">Expire *</TableHead>
                      <TableHead className="w-[10%]">Qty *</TableHead>
                      <TableHead className="w-[12%]">MRP *</TableHead>
                      <TableHead className="w-[13%]">Selling *</TableHead>
                      <TableHead className="w-[60px] text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {formData.subs.map((row, idx) => (
                      <TableRow key={row.id}>
                        {/* ITEM */}
                        <TableCell>
                          <SelectField
                            hideLabel
                            value={row.invoiceSub_item_id}
                            onChange={(v) =>
                              handleSubChange(idx, "invoiceSub_item_id", v)
                            }
                            options={itemData?.data || []}
                            optionKey="id"
                            optionLabel="item_brand_name"
                            error={errors[`subs.${idx}.invoiceSub_item_id`]}
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* Batch Dropdown */}
                            <div className="flex-1">
                              <SelectField
                                hideLabel
                                value={row.invoiceSub_batch_no}
                                onChange={(v) =>
                                  handleSubChange(idx, "invoiceSub_batch_no", v)
                                }
                                options={batchOptionsByRow[idx] || []}
                                optionKey="id"
                                optionLabel="purchaseSub_batch_no"
                                error={
                                  errors[`subs.${idx}.invoiceSub_batch_no`]
                                }
                              />
                            </div>

                            {/* Add Batch Icon */}
                            {row.invoiceSub_item_id &&
                              row.invoiceSub_batch_no &&
                              Number(row.invoiceSub_qnty) > 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="Add another batch"
                                  onClick={() => addBatchBelowRow(idx)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Field
                            hideLabel
                            type="date"
                            value={row.invoiceSub_manufacture_date ?? ""}
                            onChange={(v) =>
                              handleSubChange(
                                idx,
                                "invoiceSub_manufacture_date",
                                v
                              )
                            }
                            error={
                              errors[`subs.${idx}.invoiceSub_manufacture_date`]
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Field
                            hideLabel
                            type="date"
                            value={row.invoiceSub_expire_date ?? ""}
                            onChange={(v) =>
                              handleSubChange(idx, "invoiceSub_expire_date", v)
                            }
                            error={errors[`subs.${idx}.invoiceSub_expire_date`]}
                          />
                        </TableCell>
                        {/* QTY */}
                        <TableCell>
                          <Field
                            hideLabel
                            value={row.invoiceSub_qnty ?? ""}
                            onChange={(v) =>
                              handleSubChange(
                                idx,
                                "invoiceSub_qnty",
                                v.replace(/[^0-9]/g, "")
                              )
                            }
                            error={errors[`subs.${idx}.invoiceSub_qnty`]}
                          />
                        </TableCell>

                        {/* MRP */}
                        <TableCell>
                          <Field
                            hideLabel
                            value={row.invoiceSub_mrp ?? ""}
                            onChange={(v) =>
                              handleSubChange(
                                idx,
                                "invoiceSub_mrp",
                                v.replace(/[^0-9.]/g, "")
                              )
                            }
                            error={errors[`subs.${idx}.invoiceSub_mrp`]}
                          />
                        </TableCell>
                        <TableCell>
                          <Field
                            hideLabel
                            value={row.invoiceSub_selling_rate ?? ""}
                            onChange={(v) =>
                              handleSubChange(idx, "invoiceSub_selling_rate", v)
                            }
                            error={
                              errors[`subs.${idx}.invoiceSub_selling_rate`]
                            }
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          {formData.subs.length > 1 && (
                            <Button
                              size="icon"
                              variant={row.id ? "destructive" : "secondary"}
                              onClick={() => {
                                if (row.id) {
                                  setSubToDelete({ index: idx, id: row.id });
                                  setDeleteConfirmOpen(true);
                                } else {
                                  removeSub(idx);
                                }
                              }}
                            >
                              {row.id ? <Trash2 size={16} /> : <X size={14} />}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <Button
                variant="outline"
                className="mt-4"
                onClick={addSub}
                type="button"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </>
          </TabsContent>
        </Tabs>
      </Card>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              invoice.
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
              Please review item quantities before submitting.
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
                    Contract: {row.contractQty} | Entered: {row.enteredQty}
                  </p>
                </div>

                {row.status === "ok" && (
                  <span className="text-green-600">✔</span>
                )}

                {row.status === "mismatch" && (
                  <span className="text-red-600">✖</span>
                )}

                {row.status === "extra" && (
                  <span className="text-orange-600">⚠</span>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setOpenQtyDialog(false)}>
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setOpenQtyDialog(false);
                  submitInvoice();
                }}
              >
                Skip & Submit
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceForm;
