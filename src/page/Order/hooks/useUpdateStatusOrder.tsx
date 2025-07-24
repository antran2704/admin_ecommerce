import { useMutation } from "@tanstack/react-query";

import { TMutationOptions } from "~/interface/reactQuery";
import { IUpdateOrderStatusRequest } from "../interfaces/updateStatusRequest.interface";
import { apiOrderService } from "~/api-client/order";

export const useUpdateStatusOrder = (
  options?: TMutationOptions<IUpdateOrderStatusRequest>,
) => {
  const query = useMutation({
    mutationFn: (payload: IUpdateOrderStatusRequest) =>
      apiOrderService.updateStatus(payload),
    ...options,
  });

  return query;
};
