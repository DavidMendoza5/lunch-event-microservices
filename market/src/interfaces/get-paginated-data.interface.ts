export interface IDataWithPagination<T> {
  data: T[];
  totalData: number;
  totalPages: number;
}
