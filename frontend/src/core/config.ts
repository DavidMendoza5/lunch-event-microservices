const environment = import.meta.env

export const backendService = {
  KITCHEN_API_BASE: environment.VITE_KITCHEN_API_BASE_URL,
  WAREHOUSE_API_BASE_URL: environment.VITE_WAREHOUSE_API_BASE_URL,
  MARKET_API_BASE_URL: environment.VITE_MARKET_API_BASE_URL,
}
