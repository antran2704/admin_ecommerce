import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import {
  ICreateVariantProductRequest,
  IGetVariantProductsRequest,
  IRemoveVariantProductFollowValuesRequest,
  IUpdateVariantProductRequest,
} from "~/page/VariantProduct/interfaces";

const apiVariantProductService = {
  products: async (paramater: Partial<IGetVariantProductsRequest>) => {
    const parseParamater = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/variant-products" +
        parseParamater,
    ).then((res) => res.data);
  },
  product: async (id: string) => {
    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-products/${id}`,
    ).then((res) => res.data);
  },
  create: async (data: ICreateVariantProductRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/variant-products",
      data,
    ).then((res) => res.data);
  },
  update: async (id: string, data: IUpdateVariantProductRequest) => {
    return await AxiosClient.patch(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-products/${id}`,
      data,
    ).then((res) => res.data);
  },
  removeFollowVariantValues: async (
    productId: string,
    data: IRemoveVariantProductFollowValuesRequest,
  ) => {
    return await AxiosClient.post(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-products/${productId}/remove-follow-variant-values`,
      data,
    ).then((res) => res.data);
  },
  delete: async (id: string) => {
    return await AxiosClient.delete(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-products/${id}`,
    ).then((res) => res.data);
  },
  deleteAll: async (productId: string) => {
    return await AxiosClient.delete(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-products/${productId}/all`,
    ).then((res) => res.data);
  },
  enable: async (id: string) => {
    return await AxiosClient.patch(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-products/${id}/enable`,
    ).then((res) => res.data);
  },
  disable: async (id: string) => {
    return await AxiosClient.patch(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-products/${id}/disable`,
    ).then((res) => res.data);
  },
};

export { apiVariantProductService };
