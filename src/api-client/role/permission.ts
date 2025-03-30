import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { IUpdatePermissionRequest } from "~/page/Permission/interfaces";

const apiPermissionService = {
  update: async (roleId: string, data: IUpdatePermissionRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/permissions/${roleId}`,
      data,
    ).then((res) => res.data);
  },
};

export { apiPermissionService };
