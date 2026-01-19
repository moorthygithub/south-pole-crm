import ApiErrorPage from "@/components/api-error/api-error";
import LoadingBar from "@/components/loader/loading-bar";
import { INVOICE_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import moment from "moment";
import { toWords } from "number-to-words";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const InvoicePacking = () => {
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
    0,
  );

  const grandTotalValue = Object.values(groupedItems).reduce(
    (sum, items) =>
      sum +
      items.reduce((s, it) => s + Number(it.invoiceSub_selling_rate || 0), 0),
    0,
  );
  const amountInWords = (amount) => {
    if (!amount) return "";

    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);

    const formatCase = (text) =>
      text
        .replace(/,/g, "") // remove commas
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    let words = `${formatCase(toWords(integerPart))} Dollars`;

    if (decimalPart > 0) {
      words += ` And ${formatCase(toWords(decimalPart))} Cents`;
    }

    return words + " Only";
  };
  const invoiceColGroup = (
    <colgroup>
      <col style={{ width: "3%" }} />
      <col style={{ width: "8%" }} />
      <col style={{ width: "18%" }} />
      <col style={{ width: "10%" }} />
      <col style={{ width: "8%" }} />
      <col style={{ width: "8%" }} />
      <col style={{ width: "5%" }} />
      <col style={{ width: "7%" }} />
      <col style={{ width: "7%" }} />
      <col style={{ width: "7%" }} />
      <col style={{ width: "7%" }} />
      <col style={{ width: "10%" }} />
    </colgroup>
  );

  if (error) return <ApiErrorPage />;
  return (
    <div className="relative">
      {loading && <LoadingBar />}

      <div className="font-normal">
        {invoicePackingData && (
          <>
            <div className="max-w-6xl mx-auto p-4 ">
              <div className="border-t border-r border-l border-black max-w-screen-lg mx-auto text-sm">
                <div>
                  <div className="border-b border-black px-8 py-2  text-center text-sm font-bold  ">
                    PACKING
                  </div>
                </div>
                <div className="grid grid-cols-12 border-b border-black text-[12px]">
                  <div className="col-span-7 border-r border-black">
                    <div className="p-2">
                      <p className="font-bold text-[13px]">
                        Exporter: {invoicePackingData.branch_name}
                      </p>
                      <div className="mt-1">
                        {branchData?.branch_crop_address || ""}
                      </div>
                      <div>{branchData?.branch_address || ""}</div>
                      <div>
                        <span className="font-semibold">GSTIN:</span>{" "}
                        {branchData?.branch_gst || ""}{" "}
                        <span className="font-semibold">IEC:</span>{" "}
                        {branchData?.branch_iec || ""}
                      </div>

                      <div>
                        <span className="font-semibold">Mobile:</span>{" "}
                        {branchData?.branch_mobile_no || ""}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span>{" "}
                        {branchData?.branch_email_id || ""}
                      </div>
                    </div>

                    <div className="border-t border-black grid grid-cols-2 gap-2 ">
                      <div className="p-2 border-r border-black ">
                        <p className="font-bold">Importer:</p>
                        <p className="font-bold">
                          {invoicePackingData.invoice_buyer}
                        </p>
                        <div className="mt-1">
                          {invoicePackingData.invoice_buyer_add}
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-bold">Ship To:</p>
                        <p className="font-bold">
                          {invoicePackingData.invoice_consignee}
                        </p>
                        <div className="mt-1">
                          {invoicePackingData.invoice_consignee_add}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-5  text-[12px]">
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Invoice No:
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px] font-bold">
                        {" "}
                        Date:
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5  min-h-[22px]">
                        {safe(invoicePackingData?.invoice_ref)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {invoicePackingData?.invoice_date
                          ? moment(invoicePackingData.invoice_date).format(
                              "DD-MM-YYYY",
                            )
                          : "\u00A0"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Order No. & Date
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        LUT/ARN
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_precarriage)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_lut_code)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Port of Loading
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Port of Discharge
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_loading)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {safe(invoicePackingData?.invoice_discharge)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Origin of Goods
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Final Destination
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

                    <div className="px-2  min-h-[36px]">
                      <p className="font-bold">Terms of Payment</p>
                      <p>{safe(invoicePackingData?.invoice_payment_terms)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-[12px]">
                  <table className="w-full border-collapse table-fixed border-b border-black">
                    {invoiceColGroup}

                    <thead>
                      <tr className="border-b border-black">
                        <th className="border-r border-black px-1 text-center">
                          S.No
                        </th>
                        <th className="border-r border-black px-1 text-center">
                          Marks & Nos
                        </th>
                        <th className="border-r border-black px-2 text-left">
                          Description
                        </th>
                        <th className="border-r border-black px-1 text-center">
                          QFR NO.
                        </th>
                        <th className="border-r border-black px-1 text-center">
                          HSN/SAC
                        </th>
                        <th className="border-r border-black px-1 text-center">
                          UOM
                        </th>
                        <th className="border-r border-black px-1 text-center">
                          QTY IN BOX
                        </th>
                        <th className="border-r border-black px-1 text-center">
                          QTY IN PCS
                        </th>
                        <th className="border-r border-black px-1 text-center">
                          Net Weight
                        </th>
                        <th className="border-r border-black px-1 text-center">
                          Gross Weight
                        </th>
                        <th className="border-r border-black px-1 text-center">
                          CBM
                        </th>
                        <th className="px-1 text-center">Barcode</th>
                      </tr>
                    </thead>

                    <tbody>
                      {invoiceSubData.map((item, index) => {

                        return (
                          <tr key={item.id} className="border-t border-black">
                            <td className="border-r border-black text-center">
                              {index + 1}
                            </td>

                            <td className="border-r border-black text-center">
                              {item.invoiceSub_marks_number}
                            </td>

                            <td className="border-r border-black px-2">
                              <p className="font-semibold text-[11px]">
                                {item.invoiceSub_item_name}
                              </p>
                              <p className="text-[10px]">
                                Brand: {item.invoiceSub_item_brand_name}
                              </p>
                            </td>

                            <td className="border-r border-black text-center"></td>

                            <td className="border-r border-black text-center">
                              {item.invoiceSub_item_hsn_code}
                            </td>

                            <td className="border-r border-black text-center">
                              {item.invoiceSub_item_order_uom}
                            </td>

                            <td className="border-r border-black text-center"></td>

                            <td className="border-r border-black text-center">
                              {" "}
                              {item.invoiceSub_item_piece_rate || ""}
                            </td>
                            <td className="border-r border-black text-center">
                              {item.invoiceSub_item_net_weight || ""}
                            </td>
                            <td className="border-r border-black text-center"></td>
                            <td className="border-r border-black text-center"></td>
                            <td>
                              {" "}
                              {item.invoiceSub_item_barcode || ""}
                            </td>
                          </tr>
                        );
                      })}

                      <tr className="border-t border-black font-semibold">
                        <td
                          colSpan={6}
                          className="border-r border-black px-2 text-right"
                        >
                          TOTAL
                        </td>

                        <td className="border-r border-black text-center"></td>

                        <td className="border-r border-black text-center"></td>

                        <td className="border-r border-black text-center"></td>

                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                      </tr>
                      <tr className="border-t border-black font-semibold">
                        <td
                          colSpan={3}
                          className="border-r border-black px-2 text-right"
                        >
                          Company's PAN / IEC Code:
                        </td>

                        <td
                          className="border-r border-black text-center"
                          colSpan={3}
                        >
                          BFFPP1027R
                        </td>
                        <td className="text-xs border-r border-black" colSpan={3}>
                          For Southpole Tradelink
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="w-full  text-[11px] table-fixed">
                    {invoiceColGroup}

                    <tbody>
                      <tr>
                        <td
                          colSpan={5}
                          className="border-b border-black px-2 text-[10px] italic"
                        >
                          Declaration:We Declare that this Invoice shows the
                          actual price of the goods described and that all
                          particulars are true and correct
                        </td>
                        <td className="border-b border-r border-black text-right px-2"></td>
                        <td className="border-b border-r border-black text-right px-2"></td>
                        <td className="border-b border-r border-black text-right px-2"></td>
                        <td
                          colSpan={4}
                          className="border-b border-black text-right px-2"
                        >
                          Authorised Signatory
                        </td>
                      </tr>
                    </tbody>
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

export default InvoicePacking;
