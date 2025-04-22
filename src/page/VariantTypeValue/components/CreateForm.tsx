import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { InforForm } from "../components";
import { FormFooter } from "~/components/Footer";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_SUCCESS from "~/common/successMessage";
import PATH_NAME from "~/routes/paths";
import {
  ICreateVariantTypeValueRequest,
  IVariantTypeValueForm,
} from "../interfaces";
import { initVariantTypeValueForm } from "../common/variantTypeForm";
import { variantTypeValueFormSchema } from "../schema/variantTypeValueForm.schema";
import { apiVariantTypeValueService } from "~/api-client/variantTypeValue";

interface Props {
  variantTypeId: string;
}

const CreateForm = (props: Props) => {
  const { variantTypeId } = props;

  const { t } = useTranslation("VariantTypeValuePage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const form = useForm<IVariantTypeValueForm>({
    defaultValues: initVariantTypeValueForm,
    resolver: yupResolver(variantTypeValueFormSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const onSubmit = async (values: IVariantTypeValueForm) => {
    const dataSend: ICreateVariantTypeValueRequest = {
      variantTypeId,
      variantValueName: values.title,
    };

    try {
      await apiVariantTypeValueService.create(dataSend);

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));
      navigate(PATH_NAME.VARIANT_TYPES);
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "VARIANT_VALUE_NAME_EXISTED") {
        messageAntd.error(t("error.VARIANT_VALUE_NAME_EXISTED"));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }
  };

  return (
    <div>
      {/* Form */}
      <div className="w-full p-5">
        <InforForm form={form} />
      </div>

      <FormFooter
        okText={tCommon("add")}
        cancelText={tCommon("cancel")}
        onOk={form.handleSubmit(onSubmit, () => {
          messageAntd.error(tError(MESSAGE_ERROR.PLEASE_FILL_REQUIRED_FIELDS));
        })}
        onCancel={() => navigate(PATH_NAME.VARIANT_TYPES)}
        cancelProps={{
          disabled: form.formState.isSubmitting,
        }}
        okProps={{
          loading: form.formState.isSubmitting,
          disabled: form.formState.isSubmitting,
        }}
      />
    </div>
  );
};

export default CreateForm;
