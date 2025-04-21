import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const variantTypeFormSchema = (t: TFunction) => {
  return object().shape({
    title: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
  });
};

export { variantTypeFormSchema };
