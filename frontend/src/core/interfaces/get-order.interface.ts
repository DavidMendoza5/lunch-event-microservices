export interface IGetOrder {
  id: number
  plates: number
  status: string
  updated_at: string
  orders_dishes: { recipe_id: number; status: string; recipe_name: string }[]
}
