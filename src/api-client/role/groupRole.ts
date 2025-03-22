import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import { ICreateRoleGroup, IGroupRoleSearch } from "~/interface/role/group";

const getRoleGroups = async (paramater?: IGroupRoleSearch) => {
  const parseParamater = parseQueryString(paramater);

  return await AxiosClient.get(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/groups" + parseParamater,
  ).then((res) => res.data);
};

const createRoleGroup = async (data: ICreateRoleGroup) => {
  return await AxiosClient.post(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/groups",
    data,
  ).then((res) => res.data);
};

const updateRoleGroup = async (id: string, data: ICreateRoleGroup) => {
  return await AxiosClient.patch(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/groups/${id}`,
    data,
  ).then((res) => res.data);
};

const deleteRoleGroup = async (id: string) => {
  return await AxiosClient.delete(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/groups/${id}`,
  ).then((res) => res.data);
};

export { getRoleGroups, createRoleGroup, updateRoleGroup, deleteRoleGroup };
