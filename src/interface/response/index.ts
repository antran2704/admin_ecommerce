interface ErrorResponse {
  message: string;
  statusCode: number;
  path: string;
  timestamp: string;
}

interface IPaginationResponse {
  page: number;
  take: number;
  totalPage: number;
  total: number;
}

interface IResponseDataWithPagination<T> {
  data: T;
  meta: IPaginationResponse;
}

export type { ErrorResponse, IResponseDataWithPagination, IPaginationResponse };
