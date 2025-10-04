export interface IPurchase {
  id: number
  qty: number
  ingredient_id: number
  ingredient?: string
  created_at: Date
}
