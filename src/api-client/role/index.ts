import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import { ICreateRole, IRoleSearch } from "~/interface/role";

const getRoles = async (paramater: IRoleSearch) => {
  const parseParameter = parseQueryString(paramater);

  return await AxiosClient.get(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/roles" + parseParameter,
  ).then((res) => res.data);
};

const createRole = async (data: ICreateRole) => {
  return await AxiosClient.post(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/roles",
    data,
  ).then((res) => res.data);
};

const updateRole = async (roleId: string, data: ICreateRole) => {
  return await AxiosClient.patch(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/roles/${roleId}`,
    data,
  ).then((res) => res.data);
};

const deleteRole = async (roleId: string) => {
  return await AxiosClient.delete(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/roles/${roleId}`,
  ).then((res) => res.data);
};

export { getRoles, createRole, updateRole, deleteRole };
