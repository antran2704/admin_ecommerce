import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { IErrorResponse } from "../response";

export type TMutationOptions<P = any, R = any> = Omit<
  UseMutationOptions<R, IErrorResponse, P>,
  "mutationKey" | "mutationFn"
>;

export type TQueryOptions<R = any> = Omit<
  UseQueryOptions<R, IErrorResponse>,
  "queryKey" | "queryFn" | "onSuccess"
>;
