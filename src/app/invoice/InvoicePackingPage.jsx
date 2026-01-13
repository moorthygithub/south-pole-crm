"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { StepBack, StepForward, Printer } from "lucide-react";
import ExportInvoice from "./export-invoice";
import PackingInvoice from "./packing-invoice";

export default function InvoicePackingPage() {
  const [activeView, setActiveView] = useState("invoice");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const invoiceRef = useRef(null);
  const packingRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () =>
      activeView === "invoice" ? invoiceRef.current : packingRef.current,
    documentTitle:
      activeView === "invoice" ? "Invoice Report" : "Packing Report",
    pageStyle: `
      @page {
        size: auto;
        margin: 3mm;
      }

      @media print {
        body {
          margin: 1mm;
          padding: 1mm;
        }

        .print-hide {
          display: none !important;
        }
      }
    `,
  });

  return (
    <div className="relative flex w-full">
      {/* MAIN CONTENT */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-[85%]" : "w-full"
        } p-4 overflow-auto`}
      >
        <div className="bg-white rounded-lg shadow-sm min-h-[85vh] p-4">
          {activeView === "invoice" && (
            <div ref={invoiceRef}>
              <ExportInvoice />
            </div>
          )}

          {activeView === "packing" && (
            <div ref={packingRef}>
              <PackingInvoice />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div
        className={`fixed right-0 top-20 h-[75vh] bg-white rounded-lg transition-all duration-300 print-hide ${
          sidebarOpen
            ? "w-[15%] p-4 border border-gray-200"
            : "w-0 p-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col h-full justify-between gap-4">
          {/* SWITCH BUTTONS */}
          <div className="flex flex-col gap-3">
            <Button
              variant={activeView === "invoice" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setActiveView("invoice")}
            >
              Export Invoice
            </Button>

            <Button
              variant={activeView === "packing" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setActiveView("packing")}
            >
              Packing Invoice
            </Button>
          </div>

          {/* PRINT BUTTON */}
          <Button
            variant="default"
            className="w-full flex gap-2"
            onClick={handlePrint}
          >
            <Printer size={16} />
            Print
          </Button>
        </div>
      </div>

      {/* SIDEBAR TOGGLE BUTTON */}
      <div
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-10 right-5 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:opacity-90 transition print-hide"
      >
        {sidebarOpen ? <StepForward /> : <StepBack />}
      </div>
    </div>
  );
}
