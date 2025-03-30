import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const changePasswordFormSchema = (t: TFunction) => {
  return object().shape({
    password: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    newPassword: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    confirmPassword: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
  });
};

export { changePasswordFormSchema };
