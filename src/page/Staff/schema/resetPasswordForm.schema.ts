import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const resetPasswordStaffFormSchema = (t: TFunction) => {
  return object().shape({
    newPassword: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    confirmPassword: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
  });
};

export { resetPasswordStaffFormSchema };
