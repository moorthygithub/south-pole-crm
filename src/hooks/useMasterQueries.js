import {
  BANK_API,
  BRANCH_API,
  BUYER_LIST,
  CARTONBOX_API,
  CONTAINERSIZE_API,
  CONTRACT_API,
  COUNTRY_API,
  COUNTRYPORT_API,
  GRCODE_API,
  INVOICE_API,
  ITEMS_API,
  MARKING_API,
  PAYMENT_API,
  PAYMENTTERM_API,
  PORT_API,
  PRECARRIAGES_API,
  PRERECEIPTS_API,
  PRODUCT_API,
  PURCHASE_API,
  SCHEME_API,
  SHIPPER_API,
  STATE_API,
  VENDOR_API,
  VESSEL_API,
  YEAR,
} from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

const MASTER_APIS = {
  port: { url: PORT_API.active, queryKey: ["port-active"] },
  country: { url: COUNTRY_API.active, queryKey: ["country-active"] },
  state: { url: STATE_API.active, queryKey: ["state-active"] },
  precarriage: {
    url: PRECARRIAGES_API.active,
    queryKey: ["precarriage-active"],
  },
  prereceipt: { url: PRERECEIPTS_API.active, queryKey: ["prerecepit-active"] },
  scheme: { url: SCHEME_API.active, queryKey: ["scheme-active"] },
  countryPort: {
    url: COUNTRYPORT_API.active,
    queryKey: ["countryport-active"],
  },
  item: {
    url: ITEMS_API.active,
    queryKey: ["item-active"],
  },
  branch: {
    url: BRANCH_API.active,
    queryKey: ["branch-active"],
  },
  vendor: {
    url: VENDOR_API.active,
    queryKey: ["vendor-active"],
  },
  buyer: {
    url: BUYER_LIST.active,
    queryKey: ["buyer-active"],
  },
  paymentterm: {
    url: PAYMENTTERM_API.active,
    queryKey: ["paymentterm-active"],
  },
  marking: {
    url: MARKING_API.active,
    queryKey: ["marking-active"],
  },
  product: {
    url: PRODUCT_API.active,
    queryKey: ["product-active"],
  },
  container: {
    url: CONTAINERSIZE_API.active,
    queryKey: ["container-active"],
  },
  grcode: {
    url: GRCODE_API.active,
    queryKey: ["grcode-active"],
  },
  contractref: {
    url: CONTRACT_API.getActiveContractRef,
    queryKey: ["contract-ref"],
  },
  bank: {
    url: BANK_API.active,
    queryKey: ["bank-ref"],
  },
  invoicestatus: {
    url: INVOICE_API.status,
    queryKey: ["invoice-status"],
  },
  shipper: {
    url: SHIPPER_API.active,
    queryKey: ["shipper-active"],
  },
  vessel: {
    url: VESSEL_API.active,
    queryKey: ["vessel-active"],
  },
  purchaseitem: {
    url: PURCHASE_API.active,
    queryKey: ["purchaseitem-active"],
  },
  activepurchaseother: {
    url: PURCHASE_API.activeother,
    queryKey: ["activepurchaseother-active"],
  },
  cartonbox: {
    url: CARTONBOX_API.active,
    queryKey: ["cartonbox-active"],
  },
  paymentamount: {
    url: PAYMENT_API.paymentamount,
    queryKey: ["payment-amount"],
  },
  paymentstatus: {
    url: PAYMENT_API.status,
    queryKey: ["payment-status"],
  },

  year: {
    url: YEAR.year,
    queryKey: ["year"],
  },
};

const useMasterQueries = (keys = Object.keys(MASTER_APIS), enabled = true) => {
  const result = {};

  keys.forEach((key) => {
    const { url, queryKey } = MASTER_APIS[key];
    const query = useGetApiMutation({
      url,
      queryKey,
      options: { enabled },
    });
    result[key] = query;
  });

  return result;
};

export default useMasterQueries;
