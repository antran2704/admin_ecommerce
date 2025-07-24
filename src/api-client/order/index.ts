import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import {
  IGetOrderItemsRequest,
  IGetOrdersRequest,
} from "~/page/Order/interfaces";
import { IUpdateOrderStatusRequest } from "~/page/Order/interfaces/updateStatusRequest.interface";

const apiOrderService = {
  orders: async (paramater: Partial<IGetOrdersRequest>) => {
    const parseParamater = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/orders" +
        parseParamater,
    ).then((res) => res.data);
  },
  order: async (id: string) => {
    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/orders/${id}`,
    ).then((res) => res.data);
  },
  orderItems: async (paramater: Partial<IGetOrderItemsRequest>) => {
    const parseParamater = parseQueryString(paramater);
    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/order-items" +
        parseParamater,
    ).then((res) => res.data);
  },
  updateStatus: async (data: IUpdateOrderStatusRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/orders/status",
      data,
    ).then((res) => res.data);
  },
};

export { apiOrderService };
