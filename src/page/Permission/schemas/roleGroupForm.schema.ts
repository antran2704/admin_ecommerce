import { TFunction } from "i18next";
import { object, string } from "yup";
import MESSAGE_ERROR from "~/common/errorMessage";

const groupRoleFormSchema = (t: TFunction<"Error">) => {
  return object().shape({
    name: string().required(t(MESSAGE_ERROR.PLEASE_INPUT)),
  });
};

export { groupRoleFormSchema };
