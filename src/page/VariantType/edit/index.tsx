import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { MainLayout } from "~/layout";
import { InforForm } from "../components";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import useMessageAntd from "~/hooks/useMessageAntd";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_ERROR from "~/common/errorMessage";
import { ModalConfirm } from "~/components/Modal";
import { FormFooter } from "~/components/Footer";
import MESSAGE_SUCCESS from "~/common/successMessage";
import PATH_NAME from "~/routes/paths";
import {
  IUpdateVariantTypeRequest,
  IVariantTypeForm,
  IVariantTypeResponse,
} from "../interfaces";
import { initVariantTypeForm } from "../common/variantTypeForm";
import { variantTypeFormSchema } from "../schema/variantTypeForm.schema";
import { apiVariantTypeService } from "~/api-client/variantType";

const EditPage = () => {
  const { t } = useTranslation("VariantTypePage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { variant_type_id } = useParams();
  const { edit: editParam } = useGetSearchParams<{
    edit: string;
  }>({
    edit: "string",
  });

  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState<boolean>(editParam ? true : false);

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  const form = useForm<IVariantTypeForm>({
    defaultValues: initVariantTypeForm,
    resolver: yupResolver(variantTypeFormSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const [data, setData] = useState<IVariantTypeResponse | null>(null);

  const [loading, setLoading] = useState<{ getData: boolean; submit: boolean }>(
    { getData: false, submit: false },
  );

  const [modal, setModal] = useState<{
    changePassword: boolean;
    submit: boolean;
  }>({ changePassword: false, submit: false });

  const onModal = (type: keyof typeof modal, value: boolean) => {
    setModal({
      ...modal,
      [type]: value,
    });
  };

  const onLoading = (type: keyof typeof loading, value: boolean) => {
    setLoading({
      ...loading,
      [type]: value,
    });
  };

  const handleGetData = async (id: string) => {
    onLoading("getData", true);

    await apiVariantTypeService
      .variantType(id)
      .then((payload: IVariantTypeResponse) => {
        form.reset({
          title: payload.variantTypeName,
        });
        setData(payload);
        onLoading("getData", false);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 404) {
          navigate(PATH_NAME.VARIANT_TYPES);
        }
      });
  };

  const onSubmit = async (values: IVariantTypeForm) => {
    const dataSend: IUpdateVariantTypeRequest = {
      variantTypeName: values.title,
    };

    onLoading("submit", true);

    try {
      await apiVariantTypeService.update(data.variantTypeId, dataSend);

      onModal("submit", false);
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "VARIANT_TYPE_NAME_EXISTED") {
        messageAntd.error(t("error.VARIANT_TYPE_NAME_EXISTED"));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }

    onLoading("submit", false);
  };

  useEffect(() => {
    if (!variant_type_id) return;

    handleGetData(variant_type_id);
  }, [variant_type_id]);

  return (
    <MainLayout
      titleText={isEdit ? t("editTitle") : t("viewInfoTitle")}
      className="bg-white"
      backUrl={PATH_NAME.VARIANT_TYPES}
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: PATH_NAME.VARIANT_TYPES },
        { title: isEdit ? t("breadcrumb.update") : t("breadcrumb.viewInfo") },
      ]}>
      {/* Form */}
      <div className="w-full p-5">
        {data && <InforForm isEdit={isEdit} form={form} data={data} />}
      </div>

      {isEdit && (
        <FormFooter
          okText={tCommon("save")}
          cancelText={tCommon("cancel")}
          onOk={form.handleSubmit(
            () => onModal("submit", true),
            () => {
              messageAntd.error(
                tError(MESSAGE_ERROR.PLEASE_FILL_REQUIRED_FIELDS),
              );
            },
          )}
          onCancel={onEdit}
          okProps={{
            loading: loading.submit,
            disabled: loading.submit,
          }}
        />
      )}

      {!isEdit && (
        <FormFooter
          okText={tCommon("update")}
          cancelText={tCommon("cancel")}
          onOk={onEdit}
          onCancel={() => navigate(PATH_NAME.VARIANT_TYPES)}
        />
      )}

      {/* Modal Disable Collection */}
      <ModalConfirm
        title={t("modalUpdate.title")}
        subtitle={t("modalUpdate.subtitle")}
        open={modal.submit}
        onCancel={() => {
          if (loading.submit) return;
          onModal("submit", false);
        }}
        onOk={form.handleSubmit(onSubmit)}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        destroyOnClose={true}
        cancelButtonProps={{
          disabled: loading.submit,
        }}
        okButtonProps={{
          loading: loading.submit,
          disabled: loading.submit,
        }}
      />
    </MainLayout>
  );
};

export default EditPage;
