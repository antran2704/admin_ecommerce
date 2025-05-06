import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { InforForm } from "../components";
import useMessageAntd from "~/hooks/useMessageAntd";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_ERROR from "~/common/errorMessage";
import { ModalAlert, ModalConfirm } from "~/components/Modal";
import { FormFooter } from "~/components/Footer";
import MESSAGE_SUCCESS from "~/common/successMessage";
import {
  IUpdateVariantTypeValueRequest,
  IVariantTypeValueForm,
  IVariantTypeValueResponse,
} from "../interfaces";
import { initVariantTypeValueForm } from "../common/variantTypeForm";
import { variantTypeValueFormSchema } from "../schema/variantTypeValueForm.schema";
import { apiVariantTypeValueService } from "~/api-client/variantTypeValue";

interface Props {
  variantTypeValueId: string;
  openModal: boolean;
  isEdit: boolean;
  onCloseModal: () => void;
  refreshData: () => void;
  onEdit: (value: boolean) => void;
}

const UpdateForm = (props: Props) => {
  const {
    variantTypeValueId,
    openModal,
    isEdit,
    onCloseModal,
    refreshData,
    onEdit,
  } = props;

  const { t } = useTranslation("VariantTypeValuePage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const form = useForm<IVariantTypeValueForm>({
    defaultValues: initVariantTypeValueForm,
    resolver: yupResolver(variantTypeValueFormSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const [data, setData] = useState<IVariantTypeValueResponse | null>(null);

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

    await apiVariantTypeValueService
      .variantTypeValue(id)
      .then((payload: IVariantTypeValueResponse) => {
        form.reset({
          title: payload.variantTypeValueName,
        });
        setData(payload);
        onLoading("getData", false);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 404) {
          onCloseModal();
        }
      });
  };

  const onSubmit = async (values: IVariantTypeValueForm) => {
    if (!form.formState.isDirty) return;

    const dataSend: IUpdateVariantTypeValueRequest = {
      variantValueName: values.title,
    };

    onLoading("submit", true);

    try {
      await apiVariantTypeValueService.update(
        data.variantTypeValueId,
        dataSend,
      );

      onModal("submit", false);
      onCloseModal();
      onEdit(false);
      refreshData();
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "VARIANT_VALUE_NAME_EXISTED") {
        messageAntd.error(t("error.VARIANT_VALUE_NAME_EXISTED"));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }

    onLoading("submit", false);
  };

  useEffect(() => {
    if (!variantTypeValueId) return;

    handleGetData(variantTypeValueId);
  }, [variantTypeValueId]);

  return (
    <ModalAlert
      title={isEdit ? t("editTitle") : t("viewInfoTitle")}
      open={openModal}
      alignBottom="right"
      destroyOnClose={true}
      width={"50%"}
      footer={null}
      onCancel={() => {
        onCloseModal();
        onEdit(false);
      }}
    >
      {data && (
        <InforForm
          isEdit={isEdit}
          form={form}
          data={data}
          onSubmit={onSubmit}
        />
      )}

      {isEdit && (
        <FormFooter
          className="pt-5 pb-0 px-0"
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
          onCancel={() => {
            onEdit(false);
          }}
          okProps={{
            loading: loading.submit,
            disabled: loading.submit || !form.formState.isDirty,
          }}
        />
      )}

      {!isEdit && (
        <FormFooter
          className="pt-5 pb-0 px-0"
          okText={tCommon("update")}
          cancelText={tCommon("cancel")}
          onOk={() => onEdit(true)}
          onCancel={onCloseModal}
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
    </ModalAlert>
  );
};

export default UpdateForm;
