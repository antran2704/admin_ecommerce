import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const staffSchema = (t: TFunction) => {
  return object().shape({
    fullName: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    email: string()
      .email(t(MESSAGE_ERROR.INVALID_EMAIL))
      .required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    phoneNumber: string()
      .trim()
      .test("check-phoneNumber", t(MESSAGE_ERROR.INVALID_PHONE), (value) => {
        return !value.trim() || value.trim().length >= 9;
      }),
    roles: string().required(t(MESSAGE_ERROR.PLEASE_SELECT)),
    groupRole: string().required(t(MESSAGE_ERROR.PLEASE_SELECT)),
    workLocationId: string().trim().required(t(MESSAGE_ERROR.PLEASE_SELECT)),
  });
};

export { staffSchema };
