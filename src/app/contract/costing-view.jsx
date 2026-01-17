import ApiErrorPage from "@/components/api-error/api-error";
import LoadingBar from "@/components/loader/loading-bar";
import { CONTRACT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const CostingView = () => {
  const { id } = useParams();
  const printRef = useRef();

  const [contractData, setContractData] = useState(null);
  const [contractSubData, setContractSubData] = useState([]);
  const [contractSubDataone, setContractSubDataOne] = useState([]);

  const { trigger: fetchData, loading, error } = useApiMutation();

  const fetchContractData = async () => {
    try {
      const response = await fetchData({
        url: CONTRACT_API.getById(id),
      });

      setContractData(response.data);
      setContractSubData(response.data.subs);
      setContractSubDataOne(response.data.subs1);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [id]);

  /* ---------------- HELPERS ---------------- */

  const getPiecesPerItem = (items) =>
    Number(items.contractSub_item_pack_per_case || 0) *
    Number(items.contractSub_qnty || 0);

  const getGstMultiplier = (items) =>
    1 + Number(items.contractSub_item_gst || 0) / 100;

  /* -------- TRANSPORT GROUPING -------- */

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

  Object.values(groupedData).forEach((group) => {
    group.perItemCharge = group.count > 0 ? group.totalAmount / group.count : 0;
  });

  const transportChargePerBrandMap = Object.values(groupedData).reduce(
    (acc, item) => {
      acc[item.details] = item.perItemCharge;
      return acc;
    },
    {}
  );

  /* -------- THIRU WITH 20% MARGIN -------- */

  const getThiruWithMargin = (items) => {
    const base =
      Number(items.contractSub_item_piece_rate || 0) +
      Number(items.contractSub_item_packing_charges || 0) +
      Number(items.contractSub_item_packing_material || 0) +
      Number(items.contractSub_item_pouch || 0) +
      100 / Number(items.contractSub_item_pack_per_case || 1) +
      Number(
        transportChargePerBrandMap[items.contractSub_item_brand_name] || 0
      ) /
        getPiecesPerItem(items) +
      0.5;

    return (Math.ceil((base * 1.2) / 0.5) * 0.5).toFixed(2);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("COST SHEET");

    // ----------------- HEADER ROWS (3-row CRT) -----------------
    const row1 = sheet.addRow([
      "S.No",
      "PRODUCT NAME",
      "BRAND",
      "WEIGHT\nPER PIECE",
      "PURCHASE\nKG RATE",
      "PUR RATE\nPER PIECES",
      "PACKING\nCHARGES",
      "PACKING MATERIAL", // H-K merge
      "",
      "",
      "",
      "TRANS\nCHARGES / PCS",
      "TRANSPORT\nCHARGES",
      "PACK\nPER CASE",
      "UOM",
      "TOTAL\nPIECES",
      "WITHOUT\n20% MARGIN",
      "THIRU -\nWITH 20% MARGIN",
      "PCS RATE\nAFTER TAX",
      "SOUTHPOLE\nTOTAL AMOUNT",
    ]);

    const row2 = sheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "PACKING MATERIAL",
      "POUCH",
      "BOX (1 BOX = 55)",
      "BOX (1 BOX = 55 / 80)",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    const row3 = sheet.addRow(new Array(20).fill(""));

    // ----------------- MERGING CELLS -----------------
    sheet.mergeCells("H1:K1"); // horizontal merge for PACKING MATERIAL

    const verticalCols = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
    ];
    verticalCols.forEach((col) => {
      sheet.mergeCells(`${col}1:${col}3`);
    });

    // ----------------- HEADER STYLING -----------------
    [row1, row2, row3].forEach((row) => {
      row.eachCell((cell) => {
        cell.font = { bold: true, size: 10 };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // ----------------- DATA ROWS -----------------
    contractSubData.forEach((item, idx) => {
      const rowValues = [
        idx + 1,
        item.contractSub_item_name,
        item.contractSub_item_brand_name,
        item.contractSub_item_net_weight,
        item.contractSub_item_kg_rate || "-",
        item.contractSub_item_piece_rate,
        item.contractSub_item_packing_charges,
        item.contractSub_item_packing_material,
        item.contractSub_item_pouch,
        (100 / Number(item.contractSub_item_pack_per_case || 1)).toFixed(2),
        (Number(item.contractSub_qnty || 0) * 100).toFixed(2),
        (
          Number(
            transportChargePerBrandMap[item.contractSub_item_brand_name] || 0
          ) /
            getPiecesPerItem(item) +
          0.5
        ).toFixed(2),
        transportChargePerBrandMap[item.contractSub_item_brand_name]?.toFixed(
          2
        ),
        item.contractSub_item_pack_per_case,
        item.contractSub_qnty,
        getPiecesPerItem(item),
        (
          Number(item.contractSub_item_piece_rate || 0) +
          Number(item.contractSub_item_packing_charges || 0) +
          Number(item.contractSub_item_packing_material || 0) +
          Number(item.contractSub_item_pouch || 0) +
          100 / Number(item.contractSub_item_pack_per_case || 1) +
          Number(
            transportChargePerBrandMap[item.contractSub_item_brand_name] || 0
          ) /
            getPiecesPerItem(item) +
          0.5
        ).toFixed(2),
        getThiruWithMargin(item),
        (Number(getThiruWithMargin(item)) * getGstMultiplier(item)).toFixed(2),
        (
          getPiecesPerItem(item) *
          Number(getThiruWithMargin(item)) *
          getGstMultiplier(item)
        ).toFixed(2),
      ];

      const row = sheet.addRow(rowValues);

      row.eachCell((cell) => {
        cell.alignment = {
          wrapText: true,
          vertical: "middle",
          horizontal: "center",
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // ----------------- CONTRACT TRANSPORT DETAILS TABLE -----------------
    // Add a blank row
    sheet.addRow([]);
    // Add transport summary header
    const transportHeader = sheet.addRow([
      "Contract Transport Details",
      "Count",
      "Total Amount",
    ]);

    transportHeader.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add transport data
    tableData.forEach((rowData) => {
      const row = sheet.addRow([
        rowData.details,
        rowData.count,
        rowData.totalAmount.toFixed(2),
      ]);
      row.eachCell((cell, colNumber) => {
        cell.alignment =
          colNumber === 1 ? { horizontal: "left" } : { horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // ----------------- AUTO COLUMN WIDTH -----------------
    sheet.columns.forEach((col) => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) maxLength = columnLength;
      });
      col.width = maxLength + 5;
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Costing.xlsx");
  };

  if (error) return <ApiErrorPage />;

  return (
    <div className="relative">
      {loading && <LoadingBar />}
      <button
        onClick={exportToExcel}
        className="mb-3 px-4 py-2 bg-green-600 text-white rounded text-sm"
      >
        Export to Excel
      </button>

      <div className="font-normal" ref={printRef}>
        {contractData && (
          <div className="text-[12px] mx-10">
            <table className="w-full border-collapse table-auto border-b border-black">
              <thead>
                <tr className="border border-black text-[10px] font-bold text-center">
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

                <tr className="border border-black text-[9px] font-bold text-center">
                  <th className="border border-black px-1">PACKING MATERIAL</th>
                  <th className="border border-black px-1">POUCH</th>
                  <th className="border border-black px-1">BOX (1 BOX = 55)</th>
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
                    <td className="border border-black px-1">
                      {items.contractSub_item_brand_name}
                    </td>
                    <td className="border border-black px-1">
                      {items.contractSub_item_net_weight}
                    </td>
                    <td className="border border-black px-1">
                      {items.contractSub_item_kg_rate}
                    </td>
                    <td className="border border-black px-1">
                      {items.contractSub_item_piece_rate}
                    </td>
                    <td className="border border-black px-1">
                      {items.contractSub_item_packing_charges}
                    </td>
                    <td className="border border-black px-1">
                      {items.contractSub_item_packing_material}
                    </td>
                    <td className="border border-black px-1">
                      {items.contractSub_item_pouch}
                    </td>

                    <td className="border border-black px-1">
                      {(
                        100 / Number(items.contractSub_item_pack_per_case || 1)
                      ).toFixed(2)}
                    </td>

                    <td className="border border-black px-1">
                      {(Number(items.contractSub_qnty || 0) * 100).toFixed(2)}
                    </td>

                    <td className="border border-black px-1">
                      {(
                        Number(
                          transportChargePerBrandMap[
                            items.contractSub_item_brand_name
                          ] || 0
                        ) /
                          getPiecesPerItem(items) +
                        0.5
                      ).toFixed(2)}
                    </td>

                    <td className="border border-black px-1">
                      {transportChargePerBrandMap[
                        items.contractSub_item_brand_name
                      ]?.toFixed(2)}
                    </td>

                    <td className="border border-black px-1">
                      {items.contractSub_item_pack_per_case}
                    </td>
                    <td className="border border-black px-1">
                      {items.contractSub_qnty}
                    </td>

                    <td className="border border-black px-1">
                      {getPiecesPerItem(items)}
                    </td>

                    <td className="border border-black px-1">
                      {(
                        Number(items.contractSub_item_piece_rate || 0) +
                        Number(items.contractSub_item_packing_charges || 0) +
                        Number(items.contractSub_item_packing_material || 0) +
                        Number(items.contractSub_item_pouch || 0) +
                        100 /
                          Number(items.contractSub_item_pack_per_case || 1) +
                        Number(
                          transportChargePerBrandMap[
                            items.contractSub_item_brand_name
                          ] || 0
                        ) /
                          getPiecesPerItem(items) +
                        0.5
                      ).toFixed(2)}
                    </td>

                    <td className="border border-black px-1">
                      {getThiruWithMargin(items)}
                    </td>

                    <td className="border border-black px-1">
                      {(
                        Number(getThiruWithMargin(items)) *
                        getGstMultiplier(items)
                      ).toFixed(2)}
                    </td>

                    <td className="border border-black px-1 font-semibold">
                      {(
                        getPiecesPerItem(items) *
                        Number(getThiruWithMargin(items)) *
                        getGstMultiplier(items)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="max-w-96 mt-4">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CostingView;
