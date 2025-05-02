import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import {
  ICreateProductRequest,
  IGetProductsRequest,
  IUpdateProductRequest,
} from "~/page/Product/interfaces";

const apiProductService = {
  products: async (paramater: Partial<IGetProductsRequest>) => {
    const parseParamater = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/products" +
        parseParamater,
    ).then((res) => res.data);
  },
  product: async (id: string) => {
    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/products/${id}`,
    ).then((res) => res.data);
  },
  create: async (data: ICreateProductRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/products",
      data,
    ).then((res) => res.data);
  },
  update: async (id: string, data: IUpdateProductRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/products/${id}`,
      data,
    ).then((res) => res.data);
  },
  uploadImage: async (file: File) => {
    const formData: FormData = new FormData();
    formData.append("file", file);

    return await AxiosClient.post(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/products/upload-image",
      formData,
      {
        headers: {
          "Content-Type": file.type,
        },
      },
    ).then((res) => res.data);
  },
  delete: async (id: string) => {
    return await AxiosClient.delete(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/products/${id}`,
    ).then((res) => res.data);
  },
  enable: async (id: string) => {
    return await AxiosClient.patch(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/products/${id}/enable`,
    ).then((res) => res.data);
  },
  disable: async (id: string) => {
    return await AxiosClient.patch(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/products/${id}/disable`,
    ).then((res) => res.data);
  },
};

export { apiProductService };
