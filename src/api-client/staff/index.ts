import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import {
  IChangePasswordStaff,
  ICreateStaff,
  ICreateStaffBatch,
  IStaffSearch,
  IUpdateStaff,
} from "~/interface/staff";

const getStaffs = async (paramater: Partial<IStaffSearch>) => {
  const parseParamater = parseQueryString(paramater);

  return await AxiosClient.get(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admins" + parseParamater,
  ).then((res) => res.data);
};

const getStaff = async (userId: string) => {
  return await AxiosClient.get(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${userId}`,
  ).then((res) => res.data);
};

const createStaff = async (data: ICreateStaff) => {
  return await AxiosClient.post(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admins",
    data,
  ).then((res) => res.data);
};

const createStaffBatch = async (data: ICreateStaffBatch[]) => {
  return await AxiosClient.post(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admins/batch",
    { admins: data },
  ).then((res) => res.data);
};

const updateStaff = async (userId: string, data: IUpdateStaff) => {
  return await AxiosClient.patch(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${userId}`,
    data,
  ).then((res) => res.data);
};

const changePasswordStaff = async (
  userId: string,
  data: IChangePasswordStaff,
) => {
  return await AxiosClient.patch(
    BASE_URL +
      API_VERSION.V1 +
      INTERNAL_PATH +
      `/admins/${userId}/change-password`,
    data,
  ).then((res) => res.data);
};

const enableStaff = async (userId: string) => {
  return await AxiosClient.patch(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${userId}/enable`,
  ).then((res) => res.data);
};

const disableStaff = async (userId: string) => {
  return await AxiosClient.patch(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${userId}/disable`,
  ).then((res) => res.data);
};

const deleteStaff = async (userId: string) => {
  return await AxiosClient.delete(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${userId}`,
  ).then((res) => res.data);
};

const presignedUrlStaff = async (userId: string, objectName: string) => {
  return await AxiosClient.get(
    BASE_URL +
      API_VERSION.V1 +
      INTERNAL_PATH +
      `/admins/${userId}/presigned-put-url?objectName=${objectName}`,
  ).then((res) => res.data);
};

export {
  getStaffs,
  getStaff,
  createStaff,
  createStaffBatch,
  updateStaff,
  deleteStaff,
  presignedUrlStaff,
  changePasswordStaff,
  enableStaff,
  disableStaff,
};
