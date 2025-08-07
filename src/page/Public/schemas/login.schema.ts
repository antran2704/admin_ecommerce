import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const loginFormSchema = (t: TFunction<"Error">) => {
  return object().shape({
    email: string()
      .required(t(MESSAGE_ERROR.PLEASE_INPUT))
      .email(t(MESSAGE_ERROR.INVALID_EMAIL)),
    password: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
  });
};

export { loginFormSchema };
