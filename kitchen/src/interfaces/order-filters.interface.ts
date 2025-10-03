export interface IOrderFilters {
  id?: number;
  status?: string;
  updated_at?: Date;
}

export interface IPaginatedOrderFilters
  extends BasePaginationFilter<IOrderFilters> {}
