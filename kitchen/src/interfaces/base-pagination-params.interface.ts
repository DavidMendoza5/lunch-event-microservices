type BasePaginationFilter<T> = Partial<T> & {
  limit?: number;
  pageNumber?: number;
  sortBy?: keyof T;
  sortOrder?: 'ASC' | 'DESC';
};
