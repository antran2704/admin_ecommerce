import { TFunction } from "i18next";
import { mixed, object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const categoryFormSchema = (t: TFunction) => {
  return object().shape({
    title: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
    thumbnailUrl: string().required(t(MESSAGE_ERROR.PLEASE_SELECT_IMAGE)),
    // thumbnailFile: mixed<File>().required(t(MESSAGE_ERROR.PLEASE_SELECT_IMAGE)),
  });
};

export { categoryFormSchema };
