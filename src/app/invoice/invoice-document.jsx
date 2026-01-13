import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
import LoadingBar from "@/components/loader/loading-bar";
import Field from "@/components/SelectField/Field";
import SelectField from "@/components/SelectField/SelectField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { INVOICE_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const InvoiceDocumentForm = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoice_ref: "",
    invoice_bl_no: "",
    invoice_bl_date: "",
    invoice_sb_no: "",
    invoice_sb_date: "",
    invoice_container: "",
    invoice_voyage: "",
    invoice_seal: "",
    invoice_shipper: "",
    invoice_etd_date: "",
    invoice_eta_date: "",
    invoice_i_value_usd: "",
    invoice_i_value_inr: "",
    invoice_fob_usd: "",
    invoice_fob_inr: "",
    invoice_exch_rate: "",
    invoice_let_exports_date: "",
    invoice_vessel: "",
    invoice_insurance: "",
    invoice_freight: "",
  });
  const master = useMasterQueries(["shipper", "vessel"]);
  const { trigger, loading } = useApiMutation();
  const { trigger: fetchData, loading: loadingData, error } = useApiMutation();

  const {
    data: vesselData,
    loading: loadingvessel,
    error: vesselError,
    refetch: refetchvessel,
  } = master.vessel;
  const {
    data: shipperData,
    loading: loadingshipper,
    error: shipperError,
    refetch: refetchshipper,
  } = master.shipper;
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetchData({
          url: INVOICE_API.documentgetById(id),
        });

        const data = res?.data || {};

        setFormData((prev) => ({
          ...prev,
          invoice_ref: data.invoice_ref ?? "",
          invoice_bl_no: data.invoice_bl_no ?? "",
          invoice_bl_date: data.invoice_bl_date
            ? moment(data.invoice_bl_date).format("YYYY-MM-DD")
            : "",
          invoice_sb_no: data.invoice_sb_no ?? "",
          invoice_sb_date: data.invoice_sb_date
            ? moment(data.invoice_sb_date).format("YYYY-MM-DD")
            : "",
          invoice_container: data.invoice_container ?? "",
          invoice_voyage: data.invoice_voyage ?? "",
          invoice_seal: data.invoice_seal ?? "",
          invoice_shipper: data.invoice_shipper ?? "",
          invoice_etd_date: data.invoice_etd_date
            ? moment(data.invoice_etd_date).format("YYYY-MM-DD")
            : "",
          invoice_eta_date: data.invoice_eta_date
            ? moment(data.invoice_eta_date).format("YYYY-MM-DD")
            : "",
          invoice_i_value_usd: data.invoice_i_value_usd ?? "",
          invoice_i_value_inr: data.invoice_i_value_inr ?? "",
          invoice_fob_usd: data.invoice_fob_usd ?? "",
          invoice_fob_inr: data.invoice_fob_inr ?? "",
          invoice_exch_rate: data.invoice_exch_rate ?? "",
          invoice_let_exports_date: data.invoice_let_exports_date
            ? moment(data.invoice_let_exports_date).format("YYYY-MM-DD")
            : "",
          invoice_vessel: data.invoice_vessel ?? "",
          invoice_insurance: data.invoice_insurance ?? "",
          invoice_freight: data.invoice_freight ?? "",
        }));
      } catch (err) {
        toast.error(err.message || "Something Went Wrong");
        console.error(err);
      }
    })();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDecimalInputChange = (value, field) => {
    if (!/^\d*\.?\d*$/.test(value)) return;

    const parts = value.split(".");
    if (parts[1]?.length > 2) {
      value = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDecimal = (value) => {
    if (!value) return "0.00";
    return Number(value).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedData = {
        ...formData,
        invoice_i_value_usd: formatDecimal(formData.invoice_i_value_usd),
        invoice_i_value_inr: formatDecimal(formData.invoice_i_value_inr),
        invoice_fob_usd: formatDecimal(formData.invoice_fob_usd),
        invoice_fob_inr: formatDecimal(formData.invoice_fob_inr),
        invoice_exch_rate: formatDecimal(formData.invoice_exch_rate),
      };

      const res = await trigger({
        url: INVOICE_API.documentupdateById(id),
        method: "PUT",
        data: formattedData,
      });

      if (res?.code === 200 || res?.code === 201) {
        toast.success(res.message || "Invoice updated successfully");
        navigate("/invoice");
        queryClient.invalidateQueries(["invoice-list"]);
      } else {
        toast.error(res?.message || "Failed to update invoice");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const isINRValueValid = (enteredValue, expectedValue) => {
    const lowerBound = expectedValue - 2;
    const upperBound = expectedValue + 2;
    return enteredValue >= lowerBound && enteredValue <= upperBound;
  };
  const usd_value = Number(formData.invoice_i_value_usd);
  const freight_value = Number(formData.invoice_freight);
  const insurance_value = Number(formData.invoice_insurance);
  const exchange_value = Number(formData?.invoice_exch_rate);
  const inr_value = Number(formData.invoice_i_value_inr);

  const expectedINRValue = usd_value * exchange_value;

  const isINRValid = isINRValueValid(inr_value, expectedINRValue);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoice_fob_usd: (usd_value - (freight_value + insurance_value)).toFixed(
        2
      ),
      invoice_fob_inr: (
        (usd_value - (freight_value + insurance_value)) *
        exchange_value
      ).toFixed(2),
    }));
  }, [usd_value, freight_value, insurance_value, exchange_value]);

  if (vesselError || shipperError || error) {
    return (
      <ApiErrorPage
        onRetry={() => {
          refetchshipper();
          refetch();
          refetchvessel();
          fetchData();
        }}
      />
    );
  }
  const isLoading = loadingshipper || loadingvessel || loadingData;
  return (
    <>
      {isLoading && <LoadingBar />}
      <PageHeader
        icon={FileText}
        title="Update Document"
        description="update the data to change document data"
        rightContent={
          <Button onClick={handleSubmit}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update
          </Button>
        }
      />
      <form>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Field
                  label="BL No"
                  type="date"
                  value={formData.invoice_bl_no}
                  onChange={(v) => handleChange("invoice_bl_no", v)}
                />
              </div>
              <div>
                <Field
                  label="Invoice Date"
                  type="date"
                  value={formData.invoice_bl_date}
                  onChange={(v) => handleChange("invoice_bl_date", v)}
                />
              </div>

              <div>
                <Field
                  label="Shipping Bill No"
                  value={formData.invoice_sb_no}
                  onChange={(v) => handleChange("invoice_sb_no", v)}
                />
              </div>
              <div>
                <Field
                  label="Shipping Bill Date"
                  type="date"
                  value={formData.invoice_sb_date}
                  onChange={(v) => handleChange("invoice_sb_date", v)}
                />
              </div>

              <div className="col-span-1 lg:col-span-2">
                <Field
                  label="Container"
                  value={formData.invoice_container}
                  onChange={(v) => handleChange("invoice_container", v)}
                />
              </div>

              <div>
                <Field
                  label="Voyage"
                  value={formData.invoice_voyage}
                  onChange={(v) => handleChange("invoice_voyage", v)}
                />
              </div>

              <div>
                <SelectField
                  label="Vessel "
                  required
                  value={formData.invoice_vessel}
                  onChange={(v) => handleSelectChange("invoice_vessel", v)}
                  options={vesselData?.data}
                  optionKey="vessel_name"
                  optionLabel="vessel_name"
                />
              </div>
              <div>
                <Field
                  label="Seal"
                  value={formData.invoice_seal}
                  onChange={(v) => handleChange("invoice_seal", v)}
                />
              </div>

              <div>
                <SelectField
                  label="Shipper "
                  required
                  value={formData.invoice_shipper}
                  onChange={(v) => handleSelectChange("invoice_shipper", v)}
                  options={shipperData?.data}
                  optionKey="shipper_name"
                  optionLabel="shipper_name"
                />
              </div>

              <div>
                <Field
                  label="USD Value"
                  value={formData.invoice_i_value_usd}
                  onChange={(e) =>
                    handleDecimalInputChange(e, "invoice_i_value_usd")
                  }
                  placeholder="Enter  USD Value"
                />
              </div>
              <div>
                <Field
                  label="Invoice Exchange rate"
                  value={formData.invoice_exch_rate}
                  onChange={(e) =>
                    handleDecimalInputChange(e, "invoice_exch_rate")
                  }
                  placeholder="Enter Invoice Exchange rate"
                />
              </div>

              <div>
                <Field
                  label="Insurance"
                  value={formData.invoice_insurance}
                  onChange={(e) =>
                    handleDecimalInputChange(e, "invoice_insurance")
                  }
                  placeholder="Enter Insurance"
                />
              </div>

              <div>
                <Field
                  label="Freight"
                  value={formData.invoice_freight}
                  onChange={(e) =>
                    handleDecimalInputChange(e, "invoice_freight")
                  }
                  placeholder="Enter Freight"
                />
              </div>

              <div>
                <Field
                  label={
                    <div className="flex justify-between mt-3">
                      Invoice Value <span>{expectedINRValue}</span>
                    </div>
                  }
                  className={`bg-white ${!isINRValid ? "border-red-500" : ""}`}
                  value={formData.invoice_i_value_inr}
                  onChange={(e) =>
                    handleDecimalInputChange(e, "invoice_i_value_inr")
                  }
                  placeholder="Enter Invoice Value"
                />
              </div>

              <div>
                <Field
                  label="FOB USD"
                  value={formData.invoice_fob_usd}
                  onChange={(e) =>
                    handleDecimalInputChange(e, "invoice_fob_usd")
                  }
                  placeholder="Enter FOB Value"
                />
              </div>
              <div>
                <Field
                  label="FOB INR"
                  value={formData.invoice_fob_inr}
                  onChange={(v) =>
                    handleDecimalInputChange(v, "invoice_fob_inr")
                  }
                  placeholder="Enter FOB INR Value"
                />
              </div>

              <div>
                <Field
                  label="Let Export date"
                  type="date"
                  value={formData.invoice_let_exports_date}
                  onChange={(v) => handleChange("invoice_let_exports_date", v)}
                  placeholder="Enter Let Export date"
                />
              </div>

              <div>
                <Field
                  label="Etd Date"
                  type="date"
                  value={formData.invoice_etd_date}
                  onChange={(v) => handleChange("invoice_etd_date", v)}
                  placeholder="Enter  Etd Date"
                />
              </div>

              <div>
                <Field
                  label="Eta Date"
                  type="date"
                  value={formData.invoice_eta_date}
                  onChange={(v) => handleChange("invoice_eta_date", v)}
                  placeholder="Enter  Eta Date"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default InvoiceDocumentForm;
