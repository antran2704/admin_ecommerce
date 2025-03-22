import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";

const updatePermisionsForRole = async (roleId: string, data: string[]) => {
  return await AxiosClient.post(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/permissions/${roleId}`,
    data,
  ).then((res) => res.data);
};

export { updatePermisionsForRole };
