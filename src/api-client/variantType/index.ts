import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import {
  ICreateVariantTypeRequest,
  IGetVariantTypesRequest,
  IUpdateVariantTypeRequest,
} from "~/page/VariantType/interfaces";

const apiVariantTypeService = {
  variantTypes: async (paramater: Partial<IGetVariantTypesRequest>) => {
    const parseParamater = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/variant-types" +
        parseParamater,
    ).then((res) => res.data);
  },
  variantType: async (id: string) => {
    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/variant-types/${id}`,
    ).then((res) => res.data);
  },
  create: async (data: ICreateVariantTypeRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/variant-types",
      data,
    ).then((res) => res.data);
  },
  update: async (id: string, data: IUpdateVariantTypeRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/variant-types/${id}`,
      data,
    ).then((res) => res.data);
  },
  delete: async (id: string) => {
    return await AxiosClient.delete(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/variant-types/${id}`,
    ).then((res) => res.data);
  },
};

export { apiVariantTypeService };
