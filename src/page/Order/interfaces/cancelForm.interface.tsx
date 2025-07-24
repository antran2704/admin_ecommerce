import { ENUM_CANCELLATION_REASON } from "../enums";

export interface ICancelOrderForm {
  reason: ENUM_CANCELLATION_REASON | null;
  otherReason: string;
}
