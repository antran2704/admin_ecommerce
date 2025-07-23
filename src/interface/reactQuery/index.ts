import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { IErrorResponse } from "../response";

export interface IMutationOptions<P = any, R = any> {
  queryConfig?: Omit<
    UseMutationOptions<R, IErrorResponse, P>,
    "mutationKey" | "mutationFn"
  >;
}

export interface IQueryOptions<R = any> {
  queryConfig?: Omit<
    UseQueryOptions<R, IErrorResponse>,
    "queryKey" | "queryFn"
  >;
}
