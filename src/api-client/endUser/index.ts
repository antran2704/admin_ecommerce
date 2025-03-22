import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { ENUM_PRESIGNED_END_USER } from "~/enum/user";
import { parseQueryString, removeFieldsFromQueryObject } from "~/helper/url";
import {
  ICreateEndUser,
  ICreateEndUserBatch,
  IEndUserSearch,
  IUpdateEndUser,
} from "~/interface/endUser";

const getEndUsers = async (paramater: Partial<IEndUserSearch>) => {
  const newQuery = removeFieldsFromQueryObject(paramater, ["tab"]);
  const parseParamater = parseQueryString(newQuery);

  return await AxiosClient.get(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/end-users" + parseParamater,
  ).then((res) => res.data);
};

const getEndUser = async (userId: string) => {
  return await AxiosClient.get(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/end-users/${userId}`,
  ).then((res) => res.data);
};

const createEndUser = async (data: ICreateEndUser) => {
  return await AxiosClient.post(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/end-users",
    data,
  ).then((res) => res.data);
};

const createEndUserBatch = async (
  tenantId: string,
  data: ICreateEndUserBatch[],
) => {
  return await AxiosClient.post(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/end-users/batch",
    { tenantId, endUsers: data },
  ).then((res) => res.data);
};

const updateEndUser = async (id: string, data: IUpdateEndUser) => {
  return await AxiosClient.patch(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/end-users/${id}`,
    data,
  ).then((res) => res.data);
};

const presignedUrlEndUser = async (
  id: string,
  objectName: string,
  object: ENUM_PRESIGNED_END_USER,
  property?: string,
) => {
  const parseParamater = parseQueryString({ object, property, objectName });

  return await AxiosClient.get(
    BASE_URL +
      API_VERSION.V1 +
      INTERNAL_PATH +
      `/end-users/${id}/presigned-put-url` +
      parseParamater,
  ).then((res) => res.data);
};

const changePasswordEndUser = async (id: string, newPassword: string) => {
  return await AxiosClient.patch(
    BASE_URL +
      API_VERSION.V1 +
      INTERNAL_PATH +
      `/end-users/${id}/change-password`,
    { newPassword },
  ).then((res) => res.data);
};

const enableEndUser = async (id: string) => {
  return await AxiosClient.patch(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/end-users/${id}/enable`,
  ).then((res) => res.data);
};

const disableEndUser = async (id: string) => {
  return await AxiosClient.patch(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/end-users/${id}/disable`,
  ).then((res) => res.data);
};

const deleteEndUser = async (id: string) => {
  return await AxiosClient.delete(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/end-users/${id}`,
  ).then((res) => res.data);
};

export {
  getEndUsers,
  getEndUser,
  createEndUser,
  createEndUserBatch,
  updateEndUser,
  presignedUrlEndUser,
  changePasswordEndUser,
  enableEndUser,
  disableEndUser,
  deleteEndUser,
};
