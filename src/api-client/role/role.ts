import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import {
  ICreateRoleRequest,
  IGetRolesRequest,
  IUpdateRoleRequest,
} from "~/page/Permission/interfaces";

const apiRoleService = {
  getRoles: async (paramater: IGetRolesRequest) => {
    const parseParameter = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/roles" + parseParameter,
    ).then((res) => res.data);
  },
  create: async (data: ICreateRoleRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/roles",
      data,
    ).then((res) => res.data);
  },

  update: async (roleId: string, data: IUpdateRoleRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/roles/${roleId}`,
      data,
    ).then((res) => res.data);
  },
  delete: async (roleId: string) => {
    return await AxiosClient.delete(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/roles/${roleId}`,
    ).then((res) => res.data);
  },
};

export default apiRoleService;
