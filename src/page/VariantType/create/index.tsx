import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { MainLayout } from "~/layout";
import { InforForm } from "../components";
import { FormFooter } from "~/components/Footer";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_SUCCESS from "~/common/successMessage";
import PATH_NAME from "~/routes/paths";
import { ICreateVariantTypeRequest, IVariantTypeForm } from "../interfaces";
import { initVariantTypeForm } from "../common/variantTypeForm";
import { variantTypeFormSchema } from "../schema/variantTypeForm.schema";
import { apiVariantTypeService } from "~/api-client/variantType";

const CreatePage = () => {
  const { t } = useTranslation("VariantTypePage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const form = useForm<IVariantTypeForm>({
    defaultValues: initVariantTypeForm,
    resolver: yupResolver(variantTypeFormSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const onSubmit = async (values: IVariantTypeForm) => {
    const dataSend: ICreateVariantTypeRequest = {
      variantTypeName: values.title,
    };

    try {
      await apiVariantTypeService.create(dataSend);

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));
      navigate(PATH_NAME.VARIANT_TYPES);
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "VARIANT_TYPE_NAME_EXISTED") {
        messageAntd.error(t("error.VARIANT_TYPE_NAME_EXISTED"));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }
  };

  return (
    <MainLayout
      titleText={t("createTitle")}
      className="bg-white"
      backUrl={PATH_NAME.VARIANT_TYPES}
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: PATH_NAME.VARIANT_TYPES },
        { title: t("breadcrumb.create") },
      ]}>
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
    </MainLayout>
  );
};

export default CreatePage;
