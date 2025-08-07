import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";
import { ENUM_CANCELLATION_REASON } from "../enums";

const cancelOrderFormSchema = (t: TFunction<"Error">) => {
  return object().shape({
    reason: string().required(t(MESSAGE_ERROR.PLEASE_SELECT)),
    otherReason: string().when(["reason"], {
      is: (value: ENUM_CANCELLATION_REASON) =>
        value === ENUM_CANCELLATION_REASON.OTHER,
      then: (schema) => schema.required(t(MESSAGE_ERROR.PLEASE_INPUT)).max(300),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};

export { cancelOrderFormSchema };
