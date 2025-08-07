import { TFunction } from "i18next";
import { array, object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const productFormSchema = (t: TFunction<"Error">) => {
  return object().shape({
    title: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    description: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    thumbnailUrl: string().required(t(MESSAGE_ERROR.PLEASE_SELECT_IMAGE)),
    gallery: array().min(1, t(MESSAGE_ERROR.PLEASE_SELECT_IMAGE)),
    mainCategory: string().required(t(MESSAGE_ERROR.PLEASE_SELECT)),
  });
};

export { productFormSchema };
