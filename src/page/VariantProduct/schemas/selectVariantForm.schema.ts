import { TFunction } from "i18next";
import { object } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const selectVariantFormSchema = (t: TFunction<"Error">) => {
  return object().shape({
    variantValues: object().test(
      "each-array-not-empty",
      t(MESSAGE_ERROR.PLEASE_SELECT),
      (value) => {
        if (!value || typeof value !== "object") return false;
        return Object.values(value).every(
          (arr) => Array.isArray(arr) && arr.length > 0,
        );
      },
    ),
  });
};

export { selectVariantFormSchema };
