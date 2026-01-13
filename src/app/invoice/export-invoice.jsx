import ApiErrorPage from "@/components/api-error/api-error";
import LoadingBar from "@/components/loader/loading-bar";
import { INVOICE_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const ExportInvoice = () => {
  const { id } = useParams();

  const [invoicePackingData, setInvoicePackingData] = useState(null);
  const [branchData, setBranchData] = useState({});
  const [invoiceSubData, setInvoiceSubData] = useState([]);
  const { trigger: fetchData, loading, error } = useApiMutation();

  const fetchContractData = async () => {
    try {
      const response = await fetchData({
        url: INVOICE_API.getById(id),
      });
      setInvoicePackingData(response.data);
      setBranchData(response.branch);
      setInvoiceSubData(response.data.subs);
    } catch (error) {
      console.warn(error);
    }
  };
  useEffect(() => {
    fetchContractData();
  }, [id]);
  const groupedItems = invoiceSubData.reduce((acc, item) => {
    if (!acc[item.invoiceSub_item_id]) {
      acc[item.invoiceSub_item_id] = [];
    }
    acc[item.invoiceSub_item_id].push(item);
    return acc;
  }, {});

  const safe = (value) => value || "\u00A0";
  const grandTotalQty = Object.values(groupedItems).reduce(
    (sum, items) =>
      sum + items.reduce((s, it) => s + Number(it.invoiceSub_qnty || 0), 0),
    0
  );

  const grandTotalValue = Object.values(groupedItems).reduce(
    (sum, items) =>
      sum +
      items.reduce(
        (s, it) =>
          s +
          Number(it.invoiceSub_qnty || 0) *
            Number(it.invoiceSub_selling_rate || 0),
        0
      ),
    0
  );
  const totalFOB = grandTotalValue;
  const totalFreight = Number(invoicePackingData?.invoice_freight_usd || 0);
  const totalCNF = totalFOB + totalFreight;
  if (error) return <ApiErrorPage />;
  return (
    <div className="relative">
      {loading && <LoadingBar />}

      <div className="font-normal">
        {invoicePackingData && (
          <>
            <div className="max-w-4xl mx-auto p-4 ">
              <div className="border-t border-r border-l border-black max-w-screen-lg mx-auto text-sm">
                <div>
                  <div className="border-b border-black px-8 py-2  text-center text-sm font-bold  ">
                    EXPORT INVOICE
                  </div>
                </div>
                {/* //SECTION___1 */}
                <div className="grid grid-cols-12 border-b border-black text-[12px]">
                  <div className="col-span-6 border-r border-black">
                    <div className="p-2">
                      <p className="font-bold text-[13px]">
                        {invoicePackingData.branch_name}
                      </p>

                      <div className="mt-1">
                        <span className="font-semibold">CORP OFF:</span>{" "}
                        {branchData.branch_crop_address || ""}
                      </div>
                      <div>
                        <span className="font-semibold">REG OFF:</span>{" "}
                        {branchData.branch_address || ""}
                      </div>
                      <div>
                        <span className="font-semibold">EMAIL:</span>{" "}
                        {branchData.branch_email_id || ""}
                      </div>
                      <div>
                        <span className="font-semibold">IEC:</span>{" "}
                        {branchData.branch_iec || ""}
                      </div>
                    </div>

                    <div className="border-t border-black">
                      <div className="p-2">
                        <p className="font-bold">Consignee:</p>
                        <p className="font-bold">TO ORDER OF:</p>
                        <p className="font-bold">
                          {invoicePackingData.invoice_consignee}
                        </p>
                        <div className="mt-1">
                          {invoicePackingData.invoice_consignee_add}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6  text-[12px]">
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Invoice No:
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px] font-bold">
                        {" "}
                        Date:
                      </div>
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5  min-h-[22px]">
                        {safe(invoicePackingData?.invoice_ref)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {invoicePackingData?.invoice_date
                          ? moment(invoicePackingData.invoice_date).format(
                              "DD-MM-YYYY"
                            )
                          : "\u00A0"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Pre Carriage by
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Place of Receipt of Pre-Carrier
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_precarriage)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.place_of_receipt)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Vessel / Flight No.
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Port Of Loading
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_vessel_flight_no)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_loading)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Port Of Discharge
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Final Destination
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_discharge)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_destination_country)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Country of Origin of Goods
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Country Of Final Destination
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        India
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_destination_country)}
                      </div>
                    </div>

                    <div className="px-2 py-2 min-h-[36px]">
                      <p className="font-bold">Terms of Delivery and Payment</p>
                      <p>{safe(invoicePackingData?.invoice_payment_terms)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-[12px]">
                  <table className="w-full border-collapse table-auto border-b border-black ">
                    <thead>
                      <tr className="border-b border-black text-[12px]">
                        <th
                          className="border-r border-black text-center text-[11px]"
                          style={{ width: "20%" }}
                        >
                          Brand Name
                        </th>
                        <th
                          className="border-r border-black text-center text-[11px]"
                          style={{ width: "30%" }}
                        >
                          Generic Name
                        </th>
                        <th
                          className="border-r border-black  text-center text-[11px]"
                          style={{ width: "15%" }}
                        >
                          Company Name
                        </th>
                        <th
                          className="border-r border-black  text-center text-[11px]"
                          style={{ width: "10%" }}
                        >
                          Qt
                        </th>
                        <th
                          className="border-r border-black  text-center text-[11px]"
                          style={{ width: "10%" }}
                        >
                          Rate (USD)
                        </th>
                        <th
                          className="text-center text-[11px]"
                          style={{ width: "10%" }}
                        >
                          Value (USD)
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {Object.values(groupedItems).map((items, groupIndex) => {
                        const first = items[0];

                        return (
                          <Fragment key={groupIndex}>
                            <tr className="border-t border-black text-[11px]">
                              <td className="border-r border-black px-2">
                                <p className="font-bold text-[10px]">
                                  {first.item_brand_name}
                                </p>
                              </td>

                              <td className="border-r border-black px-2  text-[10px]">
                                {first.item_generic_name}
                              </td>

                              <td className="border-r border-black px-2  text-center text-[10px]">
                                {first.item_company_name}
                              </td>

                              {/* Empty columns */}
                              <td className="border-r border-black"></td>
                              <td className="border-r border-black"></td>
                              <td></td>
                            </tr>

                            {/* BATCH ROWS */}
                            {items.map((it, i) => (
                              <tr key={i} className="text-[11px]">
                                <td className="border-r border-black px-2  text-[10px]">
                                  Batch : {it.invoiceSub_batch_no}
                                </td>

                                <td className="border-r border-black px-2  text-[10px]">
                                  Mfg :{" "}
                                  {moment(
                                    it.invoiceSub_manufacture_date
                                  ).format("MMM-YYYY")}
                                </td>

                                {/* Exp */}
                                <td className="border-r border-black px-2  text-[10px] text-center">
                                  Exp :{" "}
                                  {moment(it.invoiceSub_expire_date).format(
                                    "MMM-YYYY"
                                  )}
                                </td>

                                <td className="border-r border-black px-2  text-center">
                                  {it.invoiceSub_qnty}
                                </td>

                                <td className="border-r border-black px-2  text-center">
                                  {it.invoiceSub_selling_rate}
                                </td>

                                <td className="px-2 text-right">
                                  {(
                                    Number(it.invoiceSub_qnty) *
                                    Number(it.invoiceSub_selling_rate)
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </Fragment>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-y border-black text-[12px]">
                        <td className="border-r border-black px-2  text-right"></td>
                        <td className="border-r border-black px-2  text-right"></td>
                        <td className="border-r border-black px-2 text-right"></td>

                        <td className="border-r border-black px-2  text-center">
                          {grandTotalQty}
                        </td>

                        <td className="border-r border-black"></td>

                        <td className="px-2  text-right">
                          {grandTotalValue.toFixed(2)}
                        </td>
                      </tr>

                      <tr className="border-y border-black text-[11px]">
                        <td
                          colSpan={5}
                          className="border-r border-black px-2  text-center"
                        >
                          TOTAL FOB IN US$
                        </td>
                        <td className="px-2 text-right">
                          {totalFOB.toFixed(2)}
                        </td>
                      </tr>

                      <tr className="border-y border-black text-[11px]">
                        <td
                          colSpan={5}
                          className="border-r border-black px-2  text-center"
                        >
                          TOTAL FREIGHT IN US $
                        </td>
                        <td className="px-2  text-right">
                          {totalFreight.toFixed(2)}
                        </td>
                      </tr>

                      <tr className="text-[12px]">
                        <td
                          colSpan={5}
                          className="border-r border-black px-2 text-center"
                        >
                          TOTAL C&amp;F IN US$
                        </td>
                        <td className="px-2 text-right">
                          {totalCNF.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="page-break"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExportInvoice;
