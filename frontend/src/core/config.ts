const environment = import.meta.env

export const kitchenService = {
  API_BASE: environment.VITE_KITCHEN_API_BASE_URL,
}
