export interface Dish {
  id: number
  name: string
  recipe_ingredients: { ingredient_id: number; qty: number; ingredient_name: string }[]
}
