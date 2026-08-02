// Relative URL: works both via `netlify dev` (proxies /api to the local
// function) and once deployed (Netlify redirects /api to the function).
export const BASE_URL = "";

// utils/apiPaths.js
export const API_PATHS = {
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },
  INCOME:{
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get",
    DELETE_INCOME: (incomeId) =>  `/api/v1/income/${incomeId}`,
    DOWNLOAD_INCOME: `/api/v1/income/downloadexcel`,
  },
  EXPENSE:{
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/get",
    DELETE_EXPENSE: (expenseId) =>  `/api/v1/expense/${expenseId}`,
    DOWNLOAD_EXPENSE: `/api/v1/expense/downloadexcel`,
  },
  ACCOUNTS: {
    ADD_ACCOUNT: "/api/v1/accounts/add",
    GET_ALL_ACCOUNTS: "/api/v1/accounts/get",
    ADD_BALANCE: (accountId) => `/api/v1/accounts/${accountId}/balance`,
    DELETE_ACCOUNT: (accountId) => `/api/v1/accounts/${accountId}`,
    DELETE_HISTORY: (accountId, historyId) =>
      `/api/v1/accounts/${accountId}/history/${historyId}`,
  },
  DATA: {
    EXPORT: "/api/v1/data/export",
    IMPORT: "/api/v1/data/import",
  },
};
