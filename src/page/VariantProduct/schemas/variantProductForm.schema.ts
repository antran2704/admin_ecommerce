import { TFunction } from "i18next";
import { lazy, object, ObjectSchema, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const itemSchema = (t: TFunction) => {
  return object().shape({
    title: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
  });
};

const variantProductFormSchema = (t: TFunction) => {
  return lazy((obj) =>
    object(
      Object.keys(obj || {}).reduce(
        (acc, key) => {
          acc[key] = itemSchema(t);
          return acc;
        },
        {} as Record<string, ObjectSchema<any>>,
      ),
    ),
  );
};

export { variantProductFormSchema };
