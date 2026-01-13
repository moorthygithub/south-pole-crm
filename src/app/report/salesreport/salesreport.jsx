import React, { useRef, useState } from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import Field from "@/components/SelectField/Field";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import { REPORT_API } from "@/constants/apiConstants";
import {
  Calendar,
  Download,
  Eye,
  FileSpreadsheet,
  Printer,
} from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";

const SalesAccountsReport = () => {
  const { trigger, loading } = useApiMutation();
  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));

  const [reportData, setReportData] = useState([]);
  const printRef = useRef();

  // Group data by branch
  const groupedByBranch = reportData.reduce((acc, row) => {
    if (!acc[row.branch_name]) {
      acc[row.branch_name] = [];
    }
    acc[row.branch_name].push(row);
    return acc;
  }, {});

  const downloadExcel = (data, fileName) => {
    const workbook = XLSX.utils.book_new();

    // Create worksheet data with branch grouping
    const worksheetData = [];

    Object.entries(data).forEach(([branchName, rows]) => {
      // Add branch header row
      worksheetData.push({
        Branch: `Branch: ${branchName}`,
        "Invoice No": "",
        Buyer: "",
        "S B No": "",
        "B L No": "",
        "BL Date": "",
        Product: "",
        "I Value USD": "",
        "I Value INR": "",
        "FOB USD": "",
        "FOB INR": "",
      });

      // Add branch data rows
      rows.forEach((row, index) => {
        worksheetData.push({
          Branch: "",
          "Invoice No": row.invoice_no,
          Buyer: row.invoice_buyer,
          "S B No": row.invoice_sb_no,
          "B L No": row.invoice_bl_no,
          "BL Date": moment(row.invoice_bl_date).format("DD-MM-YYYY"),
          Product: row.invoice_product,
          "I Value USD": row.invoice_i_value_usd,
          "I Value INR": row.invoice_i_value_inr,
          "FOB USD": row.invoice_fob_usd,
          "FOB INR": row.invoice_fob_inr,
        });
      });

      // Add empty row between branches
      worksheetData.push({
        Branch: "",
        "Invoice No": "",
        Buyer: "",
        "S B No": "",
        "B L No": "",
        "BL Date": "",
        Product: "",
        "I Value USD": "",
        "I Value INR": "",
        "FOB USD": "",
        "FOB INR": "",
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Branch
      { wch: 15 }, // Invoice No
      { wch: 20 }, // Buyer
      { wch: 12 }, // S B No
      { wch: 12 }, // B L No
      { wch: 12 }, // BL Date
      { wch: 20 }, // Product
      { wch: 15 }, // I Value USD
      { wch: 15 }, // I Value INR
      { wch: 15 }, // FOB USD
      { wch: 15 }, // FOB INR
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${fileName}.xlsx`);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Sales Accounts Report",
    pageStyle: `
      @page {
      size: auto;
 margin: 3mm 3mm 3mm 3mm;
        border: 0px solid black;
      
    }
    @media print {
      body {
        border: 0px solid red;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide {
        display: none;
      }
     
    }
    `,
  });

  const fetchReport = async () => {
    try {
      const res = await trigger({
        url: REPORT_API.salesreport,
        method: "POST",
        data: {
          from_date: fromDate,
          to_date: toDate,
        },
      });

      if (!res?.data?.length) {
        toast.error("No data found");
        setReportData([]);
        return;
      }

      setReportData(res.data);
      toast.success("Report loaded");
    } catch (err) {
      toast.error(err?.message || "Failed to fetch report");
    }
  };

  const handleExcelDownload = () => {
    if (!reportData.length) {
      toast.error("No data to download");
      return;
    }

    downloadExcel(groupedByBranch, "Sales_Accounts_Report");
  };

  return (
    <>
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Sales Accounts Report</h2>
            <p className="text-sm text-muted-foreground">
              From month start to today
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Field type="date" value={fromDate} onChange={setFromDate} />

          <Field type="date" value={toDate} onChange={setToDate} />

          <div className="space-x-4 col-span-2">
            <Button onClick={fetchReport} disabled={loading} className="gap-2">
              <Eye className="w-4 h-4" />
              View
            </Button>

            <Button
              variant="outline"
              onClick={handleExcelDownload}
              disabled={!reportData.length}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Excel
            </Button>
            {reportData.length > 0 && (
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            )}
          </div>
        </div>
      </Card>

      {reportData.length > 0 && (
        <div ref={printRef} className="mt-4 overflow-x-auto">
          <div className="hidden print:block">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl">Sales Accounts Report</h2>
              <div className="flex">
                <div className="mr-2">
                  From :{moment(fromDate).format("DD MMM YYYY")}
                </div>
                <div>To :{moment(toDate).format("DD MMM YYYY")}</div>
              </div>
            </div>
          </div>
          <table className="w-full text-xs border-collapse border border-black">
            <tbody>
              {Object.entries(groupedByBranch).map(
                ([branchName, rows], branchIndex) => (
                  <React.Fragment key={branchIndex}>
                    {/* Branch Header Row - Above Table Headers */}
                    <tr>
                      <td
                        colSpan={10}
                        className="border border-black px-2 py-2 font-semibold bg-gray-200 text-left"
                      >
                        Branch: {branchName}
                      </td>
                    </tr>

                    {/* Table Headers */}
                    <tr className="bg-gray-100">
                      <th className="border border-black px-2 py-2">
                        Invoice No
                      </th>
                      <th className="border border-black px-2 py-2">Buyer</th>
                      <th className="border border-black px-2 py-2">S B No</th>
                      <th className="border border-black px-2 py-2">B L No</th>
                      <th className="border border-black px-2 py-2">BL Date</th>
                      <th className="border border-black px-2 py-2">Product</th>
                      <th className="border border-black px-2 py-2">
                        I Value USD
                      </th>
                      <th className="border border-black px-2 py-2">
                        I Value INR
                      </th>
                      <th className="border border-black px-2 py-2">FOB USD</th>
                      <th className="border border-black px-2 py-2">FOB INR</th>
                    </tr>

                    {/* Branch Data Rows */}
                    {rows.map((row, i) => (
                      <tr
                        key={`${branchIndex}-${i}`}
                        className="even:bg-gray-50"
                      >
                        <td className="border border-black px-2 py-1">
                          {row.invoice_no}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {row.invoice_buyer}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {row.invoice_sb_no}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {row.invoice_bl_no}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {moment(row.invoice_bl_date).format("DD-MM-YYYY")}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {row.invoice_product}
                        </td>
                        <td className="border border-black px-2 py-1 text-right">
                          {row.invoice_i_value_usd}
                        </td>
                        <td className="border border-black px-2 py-1 text-right">
                          {row.invoice_i_value_inr}
                        </td>
                        <td className="border border-black px-2 py-1 text-right">
                          {row.invoice_fob_usd}
                        </td>
                        <td className="border border-black px-2 py-1 text-right">
                          {row.invoice_fob_inr}
                        </td>
                      </tr>
                    ))}

                    {/* Spacing between branches */}
                    {branchIndex < Object.keys(groupedByBranch).length - 1 && (
                      <tr>
                        <td colSpan={10} className="py-2"></td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default SalesAccountsReport;
