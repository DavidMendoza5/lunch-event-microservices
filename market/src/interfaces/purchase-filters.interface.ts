export interface IPurchaseFilters {
  id?: number;
  created_at?: Date;
}

export interface IPaginatedPurchaseFilters
  extends BasePaginationFilter<IPurchaseFilters> {}
