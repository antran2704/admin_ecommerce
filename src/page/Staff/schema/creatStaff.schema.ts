import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const createStaffSchema = (t: TFunction<"Error">) => {
  return object().shape({
    name: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    password: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    confirmPassword: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    email: string()
      .email(t(MESSAGE_ERROR.INVALID_EMAIL))
      .required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    role: string().required(t(MESSAGE_ERROR.PLEASE_SELECT)),
    groupRole: string().required(t(MESSAGE_ERROR.PLEASE_SELECT)),
  });
};

export { createStaffSchema };
