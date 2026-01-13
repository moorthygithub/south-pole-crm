export const YEAR = {
  year: "/panel-fetch-year",
};
export const LOGOUT = {
  logout: "/panel-logout",
};
export const FORGOTPASSWORD = {
  sendPasswordReset: "/panel-send-password",
};
export const LOGIN = {
  postLogin: "/panel-login",
};
export const PANEL_CHECK = {
  getPanelStatus: "/panel-check-status",
  getEnvStatus: "/panel-fetch-dotenv",
};
export const PROFILE = {
  getlist: "/panel-fetch-profile",
  chnagepassword: "/change-password",
  updateById: `/panel-update-profile`,
};
export const USERTYPE = {
  getlist: "/panel-fetch-usertype",
  getById: (id) => `/panel-fetch-usertype-by-id/${id}`,
  updateById: (id) => `/panel-update-usertype/${id}`,
};
export const USERMANAGEMENT = {
  pageControl: "/panel-fetch-usercontrol-new",
  buttonControl: "/panel-fetch-usercontrol",
};
export const TEAM_API = {
  list: "/panel-fetch-team-list",
  create: "/panel-create-usercontrol-new",
  createbutton: "/panel-create-usercontrol",
  getById: (id) => `/panel-fetch-usercontrol/${id}`,
  updateButtonById: (id) => `/panel-update-usercontrol/${id}`,
  updatePageById: (id) => `/panel-update-usercontrol-new/${id}`,
  updateStatus: (id) => `/panel-update-team-status/${id}`,
};

export const BUYER_LIST = {
  getlist: "/buyer",
  active: "/activeBuyers",
  create: "/buyer",
  getById: (id) => `/buyer/${id}`,
  updateById: (id) => `/buyer/${id}`,
  getEnvStatus: "/panel-fetch-dotenv",
};

export const BAG_API = {
  getlist: "/bagType",
  create: "/bagType",
  getById: (id) => `/bagType/${id}`,
  updateById: (id) => `/bagType/${id}`,
  updateStatus: (id) => `/bagTypes/${id}/status`,
};
export const BANK_API = {
  getlist: "/bank",
  create: "/bank",
  active: "/activeBanks",
  getById: (id) => `/bank/${id}`,
  updateById: (id) => `/bank/${id}`,
  updateStatus: (id) => `/banks/${id}/status`,
};
export const CONTAINERSIZE_API = {
  getlist: "/containerSize",
  create: "/containerSize",
  active: "/activeContainerSizes",
  getById: (id) => `/containerSize/${id}`,
  updateById: (id) => `/containerSize/${id}`,
  updateStatus: (id) => `/containerSizes/${id}/status`,
};
export const COUNTRY_API = {
  getlist: "/country",
  create: "/country",
  active: "/activeCountrys",
  getById: (id) => `/country/${id}`,
  updateById: (id) => `/country/${id}`,
  updateStatus: (id) => `/countrys/${id}/status`,
};
export const GRCODE_API = {
  getlist: "/grcode",
  create: "/grcode",
  active: "/activeGrCodes",
  getById: (id) => `/grcode/${id}`,
  updateById: (id) => `/grcode/${id}`,
  updateStatus: (id) => `/grcodes/${id}/status`,
};
export const MARKING_API = {
  getlist: "/marking",
  create: "/marking",
  active: "/activeMarkings",
  getById: (id) => `/marking/${id}`,
  updateById: (id) => `/marking/${id}`,
  updateStatus: (id) => `/markings/${id}/status`,
};
export const ORDERTYPE_API = {
  getlist: "/orderType",
  create: "/orderType",
  getById: (id) => `/orderType/${id}`,
  updateById: (id) => `/orderType/${id}`,
  updateStatus: (id) => `/orderTypes/${id}/status`,
};
export const PAYMENTTERM_API = {
  getlist: "/paymentTerms",
  create: "/paymentTerms",
  active: "/activePaymentTermss",
  getById: (id) => `/paymentTerms/${id}`,
  updateById: (id) => `/paymentTerms/${id}`,
  updateStatus: (id) => `/paymentTermss/${id}/status`,
};
export const COUNTRYPORT_API = {
  active: "activeCountrysPort",
};
export const PORT_API = {
  getlist: "/portofloading",
  create: "/portofloading",
  active: "activePortofLoadings",
  getById: (id) => `/portofloading/${id}`,
  updateById: (id) => `/portofloading/${id}`,
  updateStatus: (id) => `/portofloadings/${id}/status`,
};
export const PRERECEIPTS_API = {
  getlist: "/prereceipts",
  create: "/prereceipts",
  active: "activePrereceiptss",
  getById: (id) => `/prereceipts/${id}`,
  updateById: (id) => `/prereceipts/${id}`,
  updateStatus: (id) => `/prereceiptss/${id}/status`,
};
export const PRODUCT_API = {
  getlist: "/product",
  create: "/product",
  active: "activeProducts",
  getById: (id) => `/product/${id}`,
  updateById: (id) => `/product/${id}`,
  updateStatus: (id) => `/products/${id}/status`,
};
export const SCHEME_API = {
  getlist: "/scheme",
  create: "/scheme",
  active: "activeSchemes",
  getById: (id) => `/scheme/${id}`,
  updateById: (id) => `/scheme/${id}`,
  updateStatus: (id) => `/schemes/${id}/status`,
};
export const SHIPPER_API = {
  getlist: "/shipper",
  create: "/shipper",
  active: "activeShippers",
  getById: (id) => `/shipper/${id}`,
  updateById: (id) => `/shipper/${id}`,
  updateStatus: (id) => `/shippers/${id}/status`,
};
export const VESSEL_API = {
  getlist: "/vessel",
  create: "/vessel",
  active: "activeVessels",
  getById: (id) => `/vessel/${id}`,
  updateById: (id) => `/vessel/${id}`,
  updateStatus: (id) => `/vessels/${id}/status`,
};
export const BRANCH_API = {
  getlist: "/panel-fetch-branch-list",
  create: "/panel-create-branch",
  active: "/panel-fetch-branch",
  getById: (id) => `/panel-fetch-branch-by-id/${id}`,
  updateById: (id) => `/panel-update-branch/${id}`,
};
export const STATE_API = {
  getlist: "/panel-fetch-state-list",
  create: "/panel-create-state",
  active: "/panel-fetch-state",
  getById: (id) => `/panel-fetch-state-by-id/${id}`,
  updateById: (id) => `/panel-update-state/${id}`,
};
export const ITEMS_API = {
  getlist: "/item",
  create: "/item",
  active: "/activeItems",
  getById: (id) => `/item/${id}`,
  updateById: (id) => `/item/${id}`,
  updateStatus: (id) => `/items/${id}/status`,
};
export const PRECARRIAGES_API = {
  getlist: "/precarriages",
  create: "/precarriages",
  active: "/activePrecarriages",
  getById: (id) => `/precarriages/${id}`,
  updateById: (id) => `/precarriages/${id}`,
  updateStatus: (id) => `/precarriagess/${id}/status`,
};
export const VENDOR_API = {
  getlist: "/vendor",
  create: "/vendor",
  active: "/activeVendors",
  getById: (id) => `/vendor/${id}`,
  updateById: (id) => `/vendor/${id}`,
  updateStatus: (id) => `/vendors/${id}/status`,
};
export const PURCHASE_API = {
  getlist: "/purchase",
  create: "/purchase",
  active: "/activePurchaseItems",
  activeother: "/activePurchaseItemsOther",
  getById: (id) => `/purchase/${id}`,
  updateById: (id) => `/purchase/${id}`,
  updateStatus: (id) => `/purchases/${id}/status`,
  deleteSubs: (id) => `/deletepurchaseSub/${id}`,
};
export const CONTRACT_API = {
  getlist: "/contract",
  create: "/contract",
  getActiveContractRef: "/getActiveContractRef",
  getActiveContractRefwithData: "/getActiveContractRefwithData",
  getContractNo: "/getContractNo",
  checkContractRef: "/checkContractRef",
  getById: (id) => `/contract/${id}`,
  updateById: (id) => `/contract/${id}`,
  updateStatus: (id) => `/contracts/${id}/status`,
  deleteSubs: (id) => `/deletecontractSub/${id}`,
};
export const INVOICE_API = {
  getlist: "/invoice",
  create: "/invoice",
  createpacking: "/invoice-packingss",
  status: "/panel-fetch-invoice-status",
  geInvoiceNo: "/getInvoiceNo",
  checkInvoiceRef: "/checkInvoiceRef",
  getById: (id) => `/invoice/${id}`,
  documentgetById: (id) => `/getInvoiceDocumentById/${id}`,
  documentupdateById: (id) => `/updateInvoiceDocument/${id}`,
  updateById: (id) => `/invoice/${id}`,
  updateStatus: (id) => `/invoices/${id}/status`,
  deleteSubs: (id) => `/deleteinvoiceSub/${id}`,
  deletePackingSubs: (id) => `/deleteinvoicePackingSub/${id}`,
};
export const CARTONBOX_API = {
  getlist: "/cartonbox",
  create: "/cartonbox",
  active: "/activeCartonboxs",
  getById: (id) => `/cartonbox/${id}`,
  updateById: (id) => `/cartonbox/${id}`,
  updateStatus: (id) => `/cartonboxs/${id}/status`,
};
export const PRODUCTDESCRIPTION_API = {
  getlist: "/product-description",
  create: "/product-description",
  getById: (id) => `/product-description/${id}`,
  updateById: (id) => `/product-description/${id}`,
  updateStatus: (id) => `/product-descriptions/${id}/status`,
};
export const DUTYDRAWBACK_API = {
  getlist: "/getDutyDrawback/Pending",
  getById: (id) => `/getDutyDrawback/Pending/${id}`,
  updateById: (id) => `/updateDutyDrawback/${id}`,
};
export const PAYMENT_API = {
  getlist: "/invoice-payment",
  create: "/invoice-payment",
  paymentamount: "/getInvoicePaymentAmount",
  status: "/getInvoicePaymentStatus",
  getById: (id) => `/invoice-payment/${id}`,
  updateById: (id) => `/invoice-payment/${id}`,
  DeleteById: (id) => `/invoice-payment/${id}`,
  deletePaymentSUb: (id) => `/deleteinvoicePaymentSub/${id}`,
};
export const REPORT_API = {
  salesreport: "/sales-accounts-report",
  drawbackreport: "/drawback-report",
  stockreport: "/stock-report",
};
