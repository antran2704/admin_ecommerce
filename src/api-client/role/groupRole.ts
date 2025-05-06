import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import { ISearch } from "~/interface";
import {
  ICreateGroupRoleRequest,
  IUpdateGroupRoleRequest,
} from "~/page/Permission/interfaces";

const apiGroupRoleService = {
  roleGroups: async (paramater?: ISearch) => {
    const parseParamater = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/group-roles" +
        parseParamater,
    ).then((res) => res.data);
  },
  create: async (data: ICreateGroupRoleRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/group-roles",
      data,
    ).then((res) => res.data);
  },
  update: async (id: string, data: IUpdateGroupRoleRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/group-roles/${id}`,
      data,
    ).then((res) => res.data);
  },
  delete: async (id: string) => {
    return await AxiosClient.delete(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/group-roles/${id}`,
    ).then((res) => res.data);
  },
};

export { apiGroupRoleService };
