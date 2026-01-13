import ApiErrorPage from "@/components/api-error/api-error";
import LoadingBar from "@/components/loader/loading-bar";
import { INVOICE_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const PackingInvoice = () => {
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
      setInvoiceSubData(response.data.subs1);
    } catch (error) {
      console.warn(error);
    }
  };
  useEffect(() => {
    fetchContractData();
  }, [id]);
  const cartons = invoiceSubData.reduce((acc, item) => {
    const cartonNo = item.invoicePackingSub_carton_no;

    if (!acc[cartonNo]) {
      acc[cartonNo] = {
        cartonNo,
        boxSize: item.invoicePackingSub_box_size,
        netWeight: Number(item.invoicePackingSub_net_weight || 0),
        grossWeight: Number(item.invoicePackingSub_gross_weight || 0),
        items: [],
      };
    }

    acc[cartonNo].items.push(item);
    return acc;
  }, {});

  const safe = (v) => (v ? v : "\u00A0");

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
                    PACKING INVOICE
                  </div>
                </div>
                {/* //SECTION___1 */}
                <div className="grid grid-cols-12 border-b border-black text-[12px]">
                  <div className="col-span-5 border-r border-black">
                    <div className="p-2">
                      <p className="font-bold text-[13px]">
                        {invoicePackingData.branch_name}
                      </p>

                      <div className="mt-1">
                        <span className="font-semibold">Corp office:</span>{" "}
                        {branchData.branch_crop_address || ""}
                      </div>

                      <div>
                        <span className="font-semibold">Mobile:</span>{" "}
                        {branchData.branch_mobile_no || ""}
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

                  <div className="col-span-7  text-[12px]">
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        <span className="font-bold "> Invoice No: </span>
                        {safe(invoicePackingData?.invoice_ref)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {" "}
                        <span className="font-bold "> IEC No: </span>
                        {safe(branchData?.branch_iec)}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        <span className="font-bold "> Invoice Date: </span>
                        {invoicePackingData?.invoice_date
                          ? moment(invoicePackingData.invoice_date).format(
                              "DD-MM-YYYY"
                            )
                          : "\u00A0"}{" "}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {" "}
                        <span className="font-bold "> GST: </span>
                        {safe(branchData?.branch_gst)}
                      </div>
                    </div>

                    <div className="grid border-b border-black">
                      <div className="px-2 py-0.5  min-h-[22px] text-center">
                        DL : TN-05-20B, 21B-00584
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5  min-h-[22px]">
                        <span className="font-bold "> Country of Origin :</span>{" "}
                        India{" "}
                      </div>
                      <div className="px-2 py-0.5  min-h-[22px]">
                        <span className="font-bold ">Final Destination :</span>{" "}
                        {safe(invoicePackingData?.invoice_destination_country)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5  min-h-[22px]">
                        <span className="font-bold "> Place of Loading :</span>{" "}
                        {safe(invoicePackingData?.invoice_loading)}
                      </div>
                      <div className="px-2 py-0.5  min-h-[22px]">
                        <span className="font-bold ">Place of Receipt :</span>{" "}
                        --
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5  min-h-[22px]">
                        <span className="font-bold "> Vessel / Flight No.</span>{" "}
                        {safe(invoicePackingData?.invoice_vessel_flight_no)}
                      </div>
                      <div className="px-2 py-0.5  min-h-[22px]">
                        <span className="font-bold ">
                          Pre-Carriage by Air :
                        </span>{" "}
                        {safe(invoicePackingData?.invoice_precarriage)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 text-[11px]">
                      <div className="border-r border-black px-2 py-1">
                        <span className="font-bold">
                          BUYER (IF OTHER THAN CONSIGNEE).
                        </span>
                        <div>-----------</div>
                      </div>

                      <div className="px-2 py-1 min-h-20">
                        <span className="font-bold">Terms of Delivery :</span>
                        <div>
                          {safe(invoicePackingData?.invoice_payment_terms)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[12px] border-b border-black">
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-black">
                        <th
                          className="border-r border-black w-[10%] text-center"
                          rowSpan={2}
                        >
                          CARTON NO
                        </th>
                        <th
                          className="border-r border-black w-[10%] text-center"
                          rowSpan={2}
                        >
                          DIMENSIONS
                        </th>
                        <th
                          className="border-r border-black w-[8%] text-center"
                          rowSpan={2}
                        >
                          BATCH
                        </th>
                        <th
                          className="border-r border-black w-[7%] text-center"
                          rowSpan={2}
                        >
                          MFG
                        </th>
                        <th
                          className="border-r border-black w-[7%] text-center"
                          rowSpan={2}
                        >
                          EXP
                        </th>
                        <th
                          className="border-r border-black w-[25%] text-center"
                          rowSpan={2}
                        >
                          DESCRIPTION
                        </th>
                        <th
                          className="border-r border-black w-[5%] text-center"
                          rowSpan={2}
                        >
                          PKG
                        </th>
                        <th
                          className="border-r border-black w-[7%] text-center"
                          rowSpan={2}
                        >
                          QTY
                        </th>
                        <th className="border-black text-center" colSpan={2}>
                          Remarks
                        </th>
                      </tr>

                      <tr className="border-b border-black">
                        <th className="border-r border-black text-center">
                          Net Wgt
                        </th>
                        <th className="text-center">Gross Wgt</th>
                      </tr>
                    </thead>

                    <tbody>
                      {Object.values(cartons).map((carton, cIdx) => {
                        const rowSpan = carton.items.length;

                        return (
                          <Fragment key={cIdx}>
                            {carton.items.map((it, iIdx) => (
                              <tr key={iIdx} className="border-t border-black">
                                {iIdx === 0 && (
                                  <td
                                    rowSpan={rowSpan}
                                    className="border-r border-black text-center align-middle font-medium"
                                  >
                                    {carton.cartonNo}
                                  </td>
                                )}

                                {iIdx === 0 && (
                                  <td
                                    rowSpan={rowSpan}
                                    className="border-r border-black text-center align-middle"
                                  >
                                    {carton.boxSize}
                                  </td>
                                )}

                                <td className="border-r border-black text-center">
                                  {it.invoicePackingSub_batch_no}
                                </td>

                                <td className="border-r border-black text-center">
                                  {moment(
                                    it.invoicePackingSub_manufacture_date
                                  ).format("MMM-YY")}
                                </td>

                                <td className="border-r border-black text-center">
                                  {moment(
                                    it.invoicePackingSub_expire_date
                                  ).format("MMM-YY")}
                                </td>

                                <td className="border-r border-black px-2"></td>

                                <td className="border-r border-black text-center">
                                  {it.invoicePackingSub_box_size}
                                </td>

                                <td className="border-r border-black text-center">
                                  {Number(it.invoicePackingSub_qnty)}
                                </td>

                                {iIdx === 0 && (
                                  <>
                                    <td
                                      rowSpan={rowSpan}
                                      className="border-r border-black text-center align-middle"
                                    >
                                      {carton.netWeight.toFixed(2)}
                                    </td>

                                    <td
                                      className="border-black text-center align-middle"
                                      rowSpan={rowSpan}
                                    >
                                      {carton.grossWeight.toFixed(2)}
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </Fragment>
                        );
                      })}

                      <tr className="border-t border-black">
                        <td
                          colSpan={7}
                          className="border-r border-black text-center px-2"
                        >
                          TOTAL
                        </td>

                        <td className="border-r border-black text-center">
                          {Object.values(cartons)
                            .flatMap((c) => c.items)
                            .reduce(
                              (sum, it) =>
                                sum + Number(it.invoicePackingSub_qnty || 0),
                              0
                            )}
                        </td>

                        <td className="border-r border-black text-center">
                          {Object.values(cartons)
                            .reduce(
                              (sum, c) => sum + Number(c.netWeight || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>

                        <td className="text-center">
                          {Object.values(cartons)
                            .reduce(
                              (sum, c) => sum + Number(c.grossWeight || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                      {/* SUMMARY ROWS */}
                      <tr className="border-t border-black">
                        <td colSpan={10} className="px-2 py-1">
                          NET WEIGHT TOTAL :
                          {Object.values(cartons)
                            .reduce(
                              (sum, c) => sum + Number(c.netWeight || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>

                      <tr className="border-t border-black">
                        <td colSpan={10} className="px-2 py-1">
                          GROSS WEIGHT TOTAL :
                          {Object.values(cartons)
                            .reduce(
                              (sum, c) => sum + Number(c.grossWeight || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>

                      <tr className="border-t border-black">
                        <td colSpan={10} className="px-2 py-1">
                          NO OF QUANTITY :
                          {Object.values(cartons)
                            .flatMap((c) => c.items)
                            .reduce(
                              (sum, it) =>
                                sum + Number(it.invoicePackingSub_qnty || 0),
                              0
                            )}
                        </td>
                      </tr>

                      <tr className="border-t border-black">
                        <td colSpan={10} className="px-2 py-1">
                          NO OF PACKAGES :{Object.values(cartons).length}
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

export default PackingInvoice;
