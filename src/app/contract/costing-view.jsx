import ApiErrorPage from "@/components/api-error/api-error";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { CONTRACT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Printer } from "lucide-react";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
const CostingView = () => {
  const { id } = useParams();
  const printRef = useRef();
  const [contractData, setContractData] = useState(null);
  const [branchData, setBranchData] = useState({});
  const [contractSubData, setContractSubData] = useState([]);
  const [contractSubDataone, setContractSubDataOne] = useState([]);
  const { trigger: fetchData, loading, error } = useApiMutation();

  const fetchContractData = async () => {
    try {
      const response = await fetchData({
        url: CONTRACT_API.getById(id),
      });
      setContractData(response.data);
      setBranchData(response.branch);
      setContractSubData(response.data.subs);
      setContractSubDataOne(response.data.subs1);
    } catch (error) {
      console.warn(error);
    }
  };
  useEffect(() => {
    fetchContractData();
  }, [id]);

  const safe = (value) => value || "\u00A0";
  const transportAmountMap = contractSubDataone.reduce((acc, item) => {
    acc[item.contractTransport_details] =
      Number(item.contractTransport_amount) || 0;
    return acc;
  }, {});

  const groupedData = contractSubData.reduce((acc, item) => {
    const key = item.contractSub_item_brand_name;

    if (!acc[key]) {
      acc[key] = {
        details: key,
        count: 0,
        totalAmount: transportAmountMap[key] || 0,
      };
    }

    acc[key].count += 1;
    return acc;
  }, {});

  const tableData = Object.values(groupedData);

  if (error) return <ApiErrorPage />;
  return (
    <div className="relative">
      {loading && <LoadingBar />}

      <div className="font-normal" ref={printRef}>
        {contractData && (
          <>
            <div className="text-[12px] mx-10">
              <table className="w-full border-collapse table-auto border-b border-black ">
                <thead>
                  {/* ================= ROW 1 ================= */}
                  <tr className="border border-black text-[10px] font-bold text-center align-middle">
                    <th rowSpan={3} className="border border-black px-1">
                      S.No
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      PRODUCT NAME
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      BRAND
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      WEIGHT
                      <br />
                      PER PIECE
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      PURCHASE
                      <br />
                      KG RATE
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      PUR RATE
                      <br />
                      PER PIECES
                    </th>

                    <th rowSpan={3} className="border border-black px-1">
                      PACKING
                      <br />
                      CHARGES
                    </th>

                    <th colSpan={4} className="border border-black px-1">
                      PACKING MATERIAL
                    </th>

                    <th rowSpan={3} className="border border-black px-1">
                      TRANS
                      <br />
                      CHARGES / PCS
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      TRANSPORT
                      <br />
                      CHARGES
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      PACK
                      <br />
                      PER CASE
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      UOM
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      TOTAL
                      <br />
                      PIECES
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      WITHOUT
                      <br />
                      20% MARGIN
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      THIRU -<br />
                      WITH 20% MARGIN
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      PCS RATE
                      <br />
                      AFTER TAX
                    </th>
                    <th rowSpan={3} className="border border-black px-1">
                      SOUTHPOLE
                      <br />
                      TOTAL AMOUNT
                    </th>
                  </tr>

                  {/* ================= ROW 3 ================= */}
                  <tr className="border border-black text-[9px] font-bold text-center align-middle">
                    <th className="border border-black px-1">
                      PACKING MATERIAL (STICKER, STRING,LAMINATION etc…)
                    </th>
                    <th className="border border-black px-1">POUCH</th>
                    <th className="border border-black px-1">
                      BOX(1 BOX=55/-)PER PCS
                    </th>
                    <th className="border border-black px-1">
                      BOX (1 BOX = 55 / 80)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {contractSubData.map((items, index) => (
                    <tr
                      key={index}
                      className="border border-black text-[10px] text-center"
                    >
                      <td className="border border-black px-1">{index + 1}</td>

                      <td className="border border-black px-1 text-left">
                        {items.contractSub_item_name}
                      </td>

                      {/* BRAND */}
                      <td className="border border-black px-1">
                        {items.contractSub_item_brand_name}
                      </td>

                      {/* WEIGHT PER PIECE */}
                      <td className="border border-black px-1">
                        {items.contractSub_item_net_weight}
                      </td>

                      {/* PURCHASE KG RATE */}
                      <td className="border border-black px-1">
                        {items.contractSub_item_kg_rate}
                      </td>

                      {/* PUR RATE PER PIECES */}
                      <td className="border border-black px-1">
                        {items.contractSub_item_piece_rate}
                      </td>

                      {/* PACKING CHARGES */}
                      <td className="border border-black px-1">
                        {items.contractSub_item_packing_charges}
                      </td>

                      <td className="border border-black px-1">
                        {items.contractSub_item_packing_material}
                      </td>

                      {/* POUCH */}
                      <td className="border border-black px-1">
                        {items.contractSub_item_pouch}
                      </td>

                      {/* BOX (1 BOX = 55) PER PCS */}
                      <td className="border border-black px-1">
                        {items.box_55_per_pcs}
                      </td>

                      {/* BOX (1 BOX = 55 / 80) */}
                      <td className="border border-black px-1">
                        {items.box_55_80}
                      </td>

                      {/* TRANS CHARGES / PCS */}
                      <td className="border border-black px-1">
                        {items.transport_per_pcs}
                      </td>

                      {/* TRANSPORT CHARGES */}
                      <td className="border border-black px-1">
                        {items.transport_charges}
                      </td>

                      {/* PACK PER CASE */}
                      <td className="border border-black px-1">
                        {items.pack_per_case}
                      </td>

                      {/* UOM */}
                      <td className="border border-black px-1">{items.uom}</td>

                      {/* TOTAL PIECES */}
                      <td className="border border-black px-1">
                        {items.total_pieces}
                      </td>

                      {/* WITHOUT 20% MARGIN */}
                      <td className="border border-black px-1">
                        {items.without_margin}
                      </td>

                      {/* THIRU - WITH 20% MARGIN */}
                      <td className="border border-black px-1">
                        {items.with_margin}
                      </td>

                      {/* PCS RATE AFTER TAX */}
                      <td className="border border-black px-1">
                        {items.pcs_rate_after_tax}
                      </td>

                      {/* SOUTHPOLE TOTAL AMOUNT */}
                      <td className="border border-black px-1 font-semibold">
                        {items.total_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="w-full border-collapse border border-black text-sm">
                <thead>
                  <tr className="border border-black font-bold text-center">
                    <th className="border border-black px-2">
                      Contract Transport Details
                    </th>
                    <th className="border border-black px-2">Count</th>
                    <th className="border border-black px-2">Total Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border border-black text-center">
                      <td className="border border-black px-2 text-left">
                        {row.details}
                      </td>
                      <td className="border border-black px-2">{row.count}</td>
                      <td className="border border-black px-2 text-right">
                        {row.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CostingView;
