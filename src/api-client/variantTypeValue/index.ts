import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString, removeFieldsFromQueryObject } from "~/helper/url";
import {
  ICreateVariantTypeValueRequest,
  IGetVariantTypeValuesRequest,
  IUpdateVariantTypeValueRequest,
} from "~/page/VariantTypeValue/interfaces";

const apiVariantTypeValueService = {
  variantTypeValues: async (
    paramater: Partial<IGetVariantTypeValuesRequest>,
  ) => {
    const formatParamater = removeFieldsFromQueryObject(paramater, ["tab"]);
    const parseParamater = parseQueryString(formatParamater);

    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/variant-type-values" +
        parseParamater,
    ).then((res) => res.data);
  },
  variantTypeValue: async (id: string) => {
    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-type-values/${id}`,
    ).then((res) => res.data);
  },
  create: async (data: ICreateVariantTypeValueRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/variant-type-values",
      data,
    ).then((res) => res.data);
  },
  update: async (id: string, data: IUpdateVariantTypeValueRequest) => {
    return await AxiosClient.patch(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-type-values/${id}`,
      data,
    ).then((res) => res.data);
  },
  delete: async (id: string) => {
    return await AxiosClient.delete(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/variant-type-values/${id}`,
    ).then((res) => res.data);
  },
};

export { apiVariantTypeValueService };
