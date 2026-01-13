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
import { CONTRACT_API } from "@/constants/apiConstants";
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
  contractSub_item_id: "",
  contractSub_qnty: "",
  contractSub_mrp: "",
  contractSub_selling_rate: "",
  contractSub_item_gst: "",
  contractSub_batch_no: "",
  contractSub_manufacture_date: "",
  contractSub_expire_date: "",
};

const INITIAL_STATE = {
  branch_short: "",
  branch_name: "",
  branch_address: "",

  contract_date: moment().format("YYYY-MM-DD"),
  contract_no: "",
  contract_ref: "",
  contract_pono: "",
  contract_buyer_id: "",
  contract_buyer: "",
  contract_buyer_add: "",
  contract_consignee_id: "",
  contract_consignee: "",
  contract_consignee_add: "",

  contract_container_size: "",
  contract_product: "",
  contract_product_cust_des: "",
  contract_gr_code: "",
  contract_lut_code: "",
  contract_vessel_flight_no: "",

  contract_loading: "",
  contract_prereceipts: "",
  contract_precarriage: "",

  contract_destination_port: "",
  contract_discharge: "",
  contract_cif: "",
  contract_destination_country: "",

  contract_freight_charges: "",
  contract_dollar_rate: "",
  contract_shipment: "",
  contract_ship_date: "",

  contract_specification1: "",
  contract_specification2: "",
  contract_payment_terms: "",
  contract_remarks: "",
  contract_status: "Open",

  subs: [{ ...EMPTY_SUB }],
};
const REQUIRED_FIELDS = {
  contract_buyer: "Buyer is required",
  contract_consignee: "Consignee is required",
  branch_short: "Company is required",
  contract_no: "Contract No is required",
  contract_ref: "Ref is required",
  contract_pono: "Pono is required",
  contract_date: "Contract Date is required",
  contract_product: "Product is required",
  contract_loading: "Port is required",
  contract_destination_port: "Destination Port is required",
  contract_destination_country: "Destination Country is required",
  contract_discharge: "Discharge is required",
  contract_cif: "CIF is required",
  contract_gr_code: "GR Code is required",
  contract_lut_code: "Lut Code is required",
  contract_container_size: "Container/Size is required",
  contract_payment_terms: "Payment Terms is required",
};
const ContractForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [availableQuantity, setAvailableQuantity] = useState({});
  const [contractNoOptions, setContractNoOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const { trigger, loading } = useApiMutation();
  const { trigger: fetchRef, loading: refloading, referror } = useApiMutation();
  const { trigger: fetchData, loading: loadingData, error } = useApiMutation();
  const [step, setStep] = useState(1);
  const {
    trigger: Deletetrigger,
    loading: loadingdelete,
    deleteerror,
  } = useApiMutation();

  const master = useMasterQueries([
    "branch",
    "buyer",
    "countryPort",
    "port",
    "paymentterm",
    "product",
    "purchaseitem",
    "year",
    "country",
    "container",
    "grcode",
    "prereceipt",
    "precarriage",
    "scheme",
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
    data: purchaseitemData,
    loading: loadingPurchaseItem,
    error: purchaseitemError,
    refetch: refetchPurchaseItem,
  } = master.purchaseitem;
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

  useEffect(() => {
    if (!isEdit || !id) return;

    (async () => {
      const res = await fetchData({
        url: CONTRACT_API.getById(id),
      });

      const data = res?.data || {};

      setFormData({
        ...INITIAL_STATE,
        branch_short: data.branch_short ?? "",
        branch_name: data.branch_name ?? "",
        branch_address: data.branch_address ?? "",

        contract_date: data.contract_date
          ? moment(data.contract_date).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),

        contract_no: data.contract_no ?? "",
        contract_ref: data.contract_ref ?? "",
        contract_pono: data.contract_pono ?? "",

        contract_buyer_id: data.contract_buyer_id ?? "",
        contract_buyer: data.contract_buyer ?? "",
        contract_buyer_add: data.contract_buyer_add ?? "",

        contract_consignee_id: data.contract_consignee_id ?? "",
        contract_consignee: data.contract_consignee ?? "",
        contract_consignee_add: data.contract_consignee_add ?? "",

        contract_container_size: data.contract_container_size ?? "",
        contract_product: data.contract_product ?? "",
        contract_product_cust_des: data.contract_product_cust_des ?? "",
        contract_gr_code: data.contract_gr_code ?? "",
        contract_lut_code: data.contract_lut_code ?? "",
        contract_vessel_flight_no: data.contract_vessel_flight_no ?? "",

        contract_loading: data.contract_loading ?? "",
        contract_prereceipts: data.contract_prereceipts ?? "",
        contract_precarriage: data.contract_precarriage ?? "",

        contract_destination_port: data.contract_destination_port ?? "",
        contract_discharge: data.contract_discharge ?? "",
        contract_cif: data.contract_cif ?? "",
        contract_destination_country: data.contract_destination_country ?? "",

        contract_freight_charges: data.contract_freight_charges ?? "",
        contract_dollar_rate: data.contract_dollar_rate ?? "",
        contract_shipment: data.contract_shipment ?? "",
        contract_ship_date: data.contract_ship_date ?? "",

        contract_specification1: data.contract_specification1 ?? "",
        contract_specification2: data.contract_specification2 ?? "",
        contract_payment_terms: data.contract_payment_terms ?? "",
        contract_remarks: data.contract_remarks ?? "",
        contract_status: data.contract_status ?? "",
        subs:
          Array.isArray(data.subs) && data.subs.length > 0
            ? data.subs.map((s) => ({
                ...EMPTY_SUB,
                id: s.id ?? "",
                contractSub_item_id: String(s.contractSub_item_id) ?? "",
                contractSub_qnty: s.contractSub_qnty ?? "",
                contractSub_mrp: s.contractSub_mrp ?? "",
                contractSub_selling_rate: s.contractSub_selling_rate ?? "",
                contractSub_item_gst: s.contractSub_item_gst ?? "",
                contractSub_batch_no: s.contractSub_batch_no ?? "",
                contractSub_manufacture_date:
                  s.contractSub_manufacture_date ?? "",
                contractSub_expire_date: s.contractSub_expire_date ?? "",
              }))
            : [{ ...EMPTY_SUB }],
      });
    })();
  }, [id, isEdit]);

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

    if (name === "branch_short") {
      const selectedBranch = branchData?.data?.find(
        (b) => b.branch_short === value
      );

      const res = await fetchRef({
        url: `${CONTRACT_API.getContractNo}/${value}`,
        method: "get",
      });
      const ref = selectedBranch
        ? `${selectedBranch.branch_name_short}/${
            formData.buyer_sort ? formData.buyer_sort : ""
          }/${yearData?.data?.current_year}/${formData.contract_no}`
        : "";
      const options = res?.data ? [{ contract_no: String(res.data) }] : [];

      setContractNoOptions(options);

      setFormData((p) => ({
        ...p,
        branch_short: value,
        branch_name: selectedBranch?.branch_name || "",
        branch_address: selectedBranch?.branch_address || "",
        contract_loading: selectedBranch?.branch_port_of_loading || "",
        contract_no: "",
        contract_ref: ref,
        contract_pono: ref,
      }));
      clearErrors(
        "branch_short",
        "contract_loading",
        "contract_no",
        "contract_ref",
        "contract_pono"
      );
      return;
    }

    if (name === "contract_buyer") {
      const selectedBuyer = buyerData?.data?.find(
        (x) => x.buyer_name === value
      );

      if (!selectedBuyer) return;
      const branch = branchData?.data?.find(
        (b) => b.branch_short == formData.branch_short
      );

      const ref = branch
        ? `${branch.branch_name_short}/${selectedBuyer.buyer_sort}/${yearData?.data?.current_year}/${formData.contract_no}`
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
        contract_buyer: value,
        contract_buyer_id: selectedBuyer.id,
        contract_buyer_add: selectedBuyer.buyer_address,
        contract_consignee: selectedBuyer.buyer_name,
        contract_consignee_add: selectedBuyer.buyer_address,
        contract_consignee_id: selectedBuyer.id,
        contract_destination_country: validCountry
          ? selectedBuyer.buyer_country
          : "",
        contract_ref: ref,
        contract_pono: ref,
        contract_destination_port: destinationPort,
        contract_discharge: destinationPort,
        contract_cif: destinationPort,
      }));
      clearErrors("contract_buyer", "contract_consignee");

      if (validCountry) {
        clearErrors("contract_destination_country");
      }
      if (ref) {
        clearErrors("contract_ref", "contract_pono");
      }

      if (destinationPort) {
        clearErrors(
          "contract_destination_port",
          "contract_discharge",
          "contract_cif"
        );
      }
      return;
    }

    if (name === "contract_destination_port") {
      const cp = countryPortData?.data?.find((x) => x.country_port === value);
      const validCountry = countryData?.data?.some(
        (p) => p.country_port === cp.buyer_port
      );
      console.log(validCountry);
      setFormData((p) => ({
        ...p,
        contract_destination_port: value,
        contract_discharge: value,
        contract_cif: value,
        contract_destination_country: validCountry ? cp?.country_name : "",
      }));
      clearErrors(
        "contract_destination_port",
        "contract_discharge",
        "contract_cif"
      );
      if (validCountry) {
        clearErrors("contract_destination_country");
      }
      return;
    }

    if (name === "contract_no") {
      const branch = branchData?.data?.find(
        (b) => b.branch_short === formData.branch_short
      );

      const buyer = buyerData?.data?.find(
        (b) => b.buyer_name === formData.contract_buyer
      );

      const ref =
        branch && buyer
          ? `${branch.branch_name_short}/${buyer.buyer_sort}/${yearData?.data?.current_year}/${value}`
          : "";

      setFormData((p) => ({
        ...p,
        contract_no: value,
        contract_ref: ref,
        contract_pono: ref,
      }));
      clearErrors("contract_no", "contract_ref", "contract_pono");
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
      if (!row.contractSub_item_id) {
        newErrors[`subs.${idx}.contractSub_item_id`] = "Item is required";
      }
      if (!row.contractSub_qnty) {
        newErrors[`subs.${idx}.contractSub_qnty`] = "Qty is required";
      }

      if (!row.contractSub_selling_rate) {
        newErrors[`subs.${idx}.contractSub_selling_rate`] = "Mrp is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      if (!isEdit) {
        const refCheckRes = await trigger({
          url: CONTRACT_API.checkContractRef,
          method: "POST",
          data: { contract_ref: formData.contract_ref },
        });

        if (refCheckRes?.code !== 201) {
          toast.error(
            refCheckRes?.message || "Contract reference already exists"
          );
          return;
        }
      }

      const res = await trigger({
        url: isEdit ? CONTRACT_API.updateById(id) : CONTRACT_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Contract saved successfully");
        queryClient.invalidateQueries(["contract-list"]);
        navigate("/contract");
        return;
      }

      toast.error(res?.message || "Something went wrong");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  // const handleSubChange = (index, key, value) => {
  //   const subs = [...formData.subs];
  //   subs[index][key] = value;
  //   setFormData((p) => ({ ...p, subs }));
  //   clearErrors(`subs.${index}.${key}`);
  // };
  const handleSubChange = (index, key, value) => {
    const subs = [...formData.subs];

    // Set selected value
    subs[index][key] = value;

    if (key === "contractSub_item_id") {
      const selectedItem = purchaseitemData?.data?.find(
        (item) => String(item.id) === String(value)
      );
      setAvailableQuantity((prev) => ({
        ...prev,
        [index]: selectedItem?.total_qnty ?? 0,
      }));
      subs[index].contractSub_item_gst = selectedItem?.item_gst ?? "";
    }

    setFormData((p) => ({
      ...p,
      subs,
    }));

    clearErrors(`subs.${index}.${key}`);
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
  const confirmDelete = async () => {
    if (!subToDelete) return;

    try {
      const res = await Deletetrigger({
        url: CONTRACT_API.deleteSubs(subToDelete.id),
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
    purchaseitemError ||
    referror ||
    yearError ||
    countryError ||
    containerError ||
    grcodeError ||
    schemeError ||
    precarriageError ||
    prereceiptError
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
          refetchPurchaseItem();
          refetchYear();
          refetchcountry();
          refetchcontainer();
          refetchgrcode();
          refetchscheme();
          refetchprereceipt();
          refetchprecarriage();
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
    loadingPurchaseItem ||
    loadingYear ||
    loadingcountry ||
    loadingcontainer ||
    loadinggrcode ||
    loadingscheme ||
    loadingprereceipt ||
    loadingprecarriage;
  return (
    <>
      {isLoading && <LoadingBar />}

      <PageHeader
        icon={FileText}
        title={isEdit ? "Edit Contract" : "Create Contract"}
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
                    label="Buyer"
                    required
                    value={formData.contract_buyer}
                    onChange={(v) => handleSelectChange("contract_buyer", v)}
                    options={buyerData?.data}
                    optionKey="buyer_name"
                    optionLabel="buyer_name"
                    error={errors.contract_buyer}
                  />

                  <SelectField
                    label="Consignee"
                    required
                    value={formData.contract_consignee}
                    onChange={(v) =>
                      handleSelectChange("contract_consignee", v)
                    }
                    options={buyerData?.data}
                    optionKey="buyer_name"
                    optionLabel="buyer_name"
                    error={errors.contract_consignee}
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

                  {!isEdit ? (
                    <SelectField
                      label="Contract No "
                      required
                      value={formData.contract_no}
                      onChange={(v) => handleSelectChange("contract_no", v)}
                      options={contractNoOptions}
                      optionKey="contract_no"
                      optionLabel="contract_no"
                      error={errors.contract_no}
                    />
                  ) : (
                    <Field
                      label="Contract No"
                      value={formData.contract_no}
                      disabled
                    />
                  )}
                </div>
              </div>
              <div className="mt-[2px]">
                <div className="grid md:grid-cols-4 gap-4">
                  <Textarea
                    value={formData.contract_buyer_add || ""}
                    className="text-[9px] bg-white"
                    onChange={(e) =>
                      handleChange("contract_buyer_add", e.target.value)
                    }
                  />

                  <Textarea
                    value={formData.contract_consignee_add || ""}
                    className="text-[9px] bg-white"
                    onChange={(e) =>
                      handleChange("contract_consignee_add", e.target.value)
                    }
                  />

                  <div
                    style={{ textAlign: "center" }}
                    className="bg-white rounded-md border"
                  >
                    <span style={{ fontSize: "12px" }}>
                      {formData.branch_name}
                    </span>
                    <br />
                    <span style={{ fontSize: "9px", display: "block" }}>
                      {formData.branch_address}
                    </span>
                  </div>
                  <Field
                    label="Contract Date *"
                    type="date"
                    value={formData.contract_date}
                    onChange={(v) => handleChange("contract_date", v)}
                    error={errors.contract_date}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Field
                  label="Contract Ref *"
                  value={formData.contract_ref}
                  disabled
                  error={errors.contract_ref}
                />
                <Field
                  label="Contract Pono *"
                  value={formData.contract_pono}
                  onChange={(v) => handleChange("contract_pono", v)}
                  error={errors.contract_pono}
                />
                <SelectField
                  label="Product"
                  required
                  value={formData.contract_product}
                  onChange={(v) => handleChange("contract_product", v)}
                  options={productData?.data}
                  optionKey="product_name"
                  optionLabel="product_name"
                  error={errors.contract_product}
                />

                <SelectField
                  label="Port of Loading"
                  required
                  value={formData.contract_loading}
                  onChange={(v) => handleChange("contract_loading", v)}
                  options={portData?.data}
                  optionKey="portofLoading"
                  optionLabel="portofLoading"
                  error={errors.contract_loading}
                />

                <SelectField
                  label="Destination Port"
                  required
                  value={formData.contract_destination_port}
                  onChange={(v) =>
                    handleSelectChange("contract_destination_port", v)
                  }
                  options={countryPortData?.data}
                  optionKey="country_port"
                  optionLabel="country_port"
                  error={errors.contract_destination_port}
                />
              </div>

              <div className="grid grid-cols-1  md:grid-cols-6 gap-4">
                <SelectField
                  label="Port of Discharge"
                  required
                  value={formData.contract_discharge}
                  onChange={(v) => handleSelectChange("contract_discharge", v)}
                  options={countryPortData?.data}
                  optionKey="country_port"
                  optionLabel="country_port"
                  error={errors.contract_discharge}
                />

                <SelectField
                  label="CIF"
                  required
                  value={formData.contract_cif}
                  onChange={(v) => handleSelectChange("contract_cif", v)}
                  options={countryPortData?.data}
                  optionKey="country_port"
                  optionLabel="country_port"
                  error={errors.contract_cif}
                />

                <SelectField
                  label="Dest Country"
                  required
                  value={formData.contract_destination_country}
                  onChange={(v) =>
                    handleSelectChange("contract_destination_country", v)
                  }
                  options={countryData?.data}
                  optionKey="country_name"
                  optionLabel="country_name"
                  error={errors.contract_destination_country}
                />
                <SelectField
                  label="Container Size"
                  required
                  value={formData.contract_container_size}
                  onChange={(v) => handleChange("contract_container_size", v)}
                  options={containerData?.data}
                  optionKey="containerSize"
                  optionLabel="containerSize"
                  error={errors.contract_container_size}
                />
                <Field
                  label="Shipment Date"
                  type="date"
                  value={formData.contract_ship_date}
                  onChange={(v) => handleChange("contract_ship_date", v)}
                />

                <SelectField
                  label="GR Code"
                  required
                  value={formData.contract_gr_code}
                  onChange={(v) => handleChange("contract_gr_code", v)}
                  options={grcodeData?.data}
                  optionKey="product_name"
                  optionLabel="product_name"
                  error={errors.contract_gr_code}
                />
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <SelectField
                  label="LUT Code"
                  required
                  value={formData.contract_lut_code}
                  onChange={(v) => handleChange("contract_lut_code", v)}
                  error={errors.contract_lut_code}
                  options={schemeData?.data}
                  optionKey="scheme_short"
                  optionLabel="scheme_short"
                />

                <Field
                  label="Vessel / Flight No"
                  value={formData.contract_vessel_flight_no}
                  onChange={(v) => handleChange("contract_vessel_flight_no", v)}
                />

                <SelectField
                  label="Pre-Receipt"
                  value={formData.contract_prereceipts}
                  onChange={(v) => handleChange("contract_prereceipts", v)}
                  options={prereceiptData?.data}
                  optionKey="prereceipts_name"
                  optionLabel="prereceipts_name"
                />
                <SelectField
                  label="Pre-Carriage"
                  value={formData.contract_precarriage}
                  onChange={(v) => handleChange("contract_precarriage", v)}
                  options={precarriageData?.data}
                  optionKey="precarriage_name"
                  optionLabel="precarriage_name"
                />
              </div>

              <div
                className={`grid gap-4 ${
                  isEdit ? "md:grid-cols-5" : "md:grid-cols-4"
                }`}
              >
                <Field
                  label="Customer Description"
                  value={formData.contract_product_cust_des}
                  onChange={(v) => handleChange("contract_product_cust_des", v)}
                />
                <Field
                  label="Freight Charges"
                  type="number"
                  value={formData.contract_freight_charges}
                  onChange={(v) => handleChange("contract_freight_charges", v)}
                />

                <Field
                  label="Dollar Rate"
                  type="number"
                  value={formData.contract_dollar_rate}
                  onChange={(v) => handleChange("contract_dollar_rate", v)}
                />

                <Field
                  label="Shipment Terms"
                  value={formData.contract_shipment}
                  onChange={(v) => handleChange("contract_shipment", v)}
                />
                {isEdit && (
                  <div className="col-span-1">
                    <Label className="text-sm font-medium">Status</Label>

                    <Select
                      value={formData.contract_status}
                      onValueChange={(v) => handleChange("contract_status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Open">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                            Open
                          </div>
                        </SelectItem>

                        <SelectItem value="Close">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                            Close
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Label>Specification 1</Label>
                  <Textarea
                    value={formData.contract_specification1 ?? ""}
                    onChange={(e) =>
                      handleChange("contract_specification1", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Label>Specification 2</Label>
                  <Textarea
                    value={formData.contract_specification2 ?? ""}
                    onChange={(e) =>
                      handleChange("contract_specification2", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <SelectField
                    label="Payment Terms"
                    required
                    value={formData.contract_payment_terms}
                    onChange={(v) => handleChange("contract_payment_terms", v)}
                    options={paymentTermData?.data}
                    optionKey="paymentTerms"
                    optionLabel="paymentTerms"
                    error={errors.contract_payment_terms}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Remarks</Label>
                  <Textarea
                    value={formData.contract_remarks}
                    onChange={(e) =>
                      handleChange("contract_remarks", e.target.value)
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
                      <TableHead className="w-[15%]">Qty *</TableHead>
                      <TableHead className="w-[15%]">Batch </TableHead>
                      <TableHead className="w-[15%]">Manufacture </TableHead>
                      <TableHead className="w-[10%]">Expire </TableHead>
                      <TableHead className="w-[10%]">MRP </TableHead>
                      <TableHead className="w-[15%]">Selling *</TableHead>
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
                            value={row.contractSub_item_id}
                            onChange={(v) =>
                              handleSubChange(idx, "contractSub_item_id", v)
                            }
                            options={purchaseitemData?.data || []}
                            optionKey="id"
                            optionLabel="item_brand_name"
                            error={errors[`subs.${idx}.contractSub_item_id`]}
                          />
                        </TableCell>

                        {/* QTY */}
                        <TableCell>
                          <Field
                            hideLabel
                            value={row.contractSub_qnty ?? ""}
                            onChange={(v) =>
                              handleSubChange(
                                idx,
                                "contractSub_qnty",
                                v.replace(/[^0-9]/g, "")
                              )
                            }
                            error={errors[`subs.${idx}.contractSub_qnty`]}
                          />
                          {!isEdit && (
                            <span className="font-medium text-[11px]">
                              Available Quantity:{" "}
                              <span>{availableQuantity[idx] ?? 0}</span>
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <Field
                            hideLabel
                            value={row.contractSub_batch_no ?? ""}
                            onChange={(v) =>
                              handleSubChange(idx, "contractSub_batch_no", v)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Field
                            hideLabel
                            type="date"
                            value={row.contractSub_manufacture_date ?? ""}
                            onChange={(v) =>
                              handleSubChange(
                                idx,
                                "contractSub_manufacture_date",
                                v
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Field
                            hideLabel
                            type="date"
                            value={row.contractSub_expire_date ?? ""}
                            onChange={(v) =>
                              handleSubChange(idx, "contractSub_expire_date", v)
                            }
                          />
                        </TableCell>
                        {/* MRP */}
                        <TableCell>
                          <Field
                            hideLabel
                            value={row.contractSub_mrp ?? ""}
                            onChange={(v) =>
                              handleSubChange(
                                idx,
                                "contractSub_mrp",
                                v.replace(/[^0-9.]/g, "")
                              )
                            }
                          />
                        </TableCell>
                        {/* MRP */}
                        <TableCell>
                          <Field
                            hideLabel
                            value={row.contractSub_selling_rate ?? ""}
                            onChange={(v) =>
                              handleSubChange(
                                idx,
                                "contractSub_selling_rate",
                                v.replace(/[^0-9.]/g, "")
                              )
                            }
                            error={
                              errors[`subs.${idx}.contractSub_selling_rate`]
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

export default ContractForm;
