import { ENUM_USER_TYPE } from "~/enum/user";
import { ENUM_CANCELLATION_REASON } from "../enums";

export interface IOrderCancellationResponse {
  id: string;
  cancelledBy: {
    id: string;
    name: string;
  };
  cancelledByType: ENUM_USER_TYPE;
  reason: ENUM_CANCELLATION_REASON;
  otherReason: string;
  createdAt: string;
}
