import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/error";

const loginFormSchema = (t: TFunction) => {
  return object().shape({
    email: string()
      .required(t(MESSAGE_ERROR.PLEASE_INPUT))
      .email(t(MESSAGE_ERROR.INVALID_EMAIL)),
    password: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
  });
};

export { loginFormSchema };
