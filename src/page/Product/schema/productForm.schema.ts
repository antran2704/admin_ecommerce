import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const productFormSchema = (t: TFunction) => {
  return object().shape({
    title: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
  });
};

export { productFormSchema };
