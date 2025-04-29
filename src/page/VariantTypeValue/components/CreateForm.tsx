import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { InforForm } from "../components";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_SUCCESS from "~/common/successMessage";
import {
  ICreateVariantTypeValueRequest,
  IVariantTypeValueForm,
} from "../interfaces";
import { initVariantTypeValueForm } from "../common/variantTypeForm";
import { variantTypeValueFormSchema } from "../schema/variantTypeValueForm.schema";
import { apiVariantTypeValueService } from "~/api-client/variantTypeValue";
import { ModalAlert } from "~/components/Modal";

interface Props {
  variantTypeId: string;
  openModal: boolean;
  onCloseModal: () => void;
  refreshData: () => void;
}

const CreateForm = (props: Props) => {
  const { variantTypeId, openModal, onCloseModal, refreshData } = props;

  const { t } = useTranslation("VariantTypeValuePage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

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
      onCloseModal();
      refreshData();
      form.reset(initVariantTypeValueForm);
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));
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
    <ModalAlert
      title={t("createTitle")}
      open={openModal}
      alignBottom="right"
      destroyOnClose={true}
      width={"50%"}
      okText={tCommon("add")}
      onCancel={onCloseModal}
      onOk={form.handleSubmit(onSubmit)}
      okButtonProps={{
        loading: form.formState.isSubmitting,
        disabled: form.formState.isSubmitting,
      }}>
      <InforForm form={form} onSubmit={onSubmit} />
    </ModalAlert>
  );
};

export default CreateForm;
