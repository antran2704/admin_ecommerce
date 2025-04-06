import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { InputPassword } from "~/components/Core/Input";

import { ModalConfirm } from "~/components/Modal";
import CheckPassword from "~/components/Password/Check";
import { checkPassword, getListCheckPassword } from "~/helper/auth";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import { ICheckPassword } from "~/interface/password";
import { initChangePasswordData } from "../common/changePasswordForm";
import { changePasswordFormSchema } from "../schemas/changePasswordForm.schema";
import apiMeService from "~/api-client/me";
import { IChangePasswordMeForm } from "../interfaces/changePasswordForm.interface";
import { IChangePasswordMeRequest } from "../interfaces";
import MESSAGE_SUCCESS from "~/common/successMessage";
import MESSAGE_ERROR from "~/common/errorMessage";
import useMessageAntd from "~/hooks/useMessageAntd";

interface Props {
  open: boolean;
  onCancel: () => void;
}

const ChangePasswordModal = (props: Props) => {
  const { open, onCancel } = props;

  const { t, i18n } = useTranslation("AccountPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tSuccess } = useTranslation("Success");
  const { t: tError } = useTranslation("Error");

  const { messageAntd } = useMessageAntd();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm<IChangePasswordMeForm>({
    defaultValues: initChangePasswordData,
    resolver: yupResolver(changePasswordFormSchema(tError)) as any,
  });

  const [listValid, setListValid] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const listCheck: ICheckPassword[] = useMemo(
    () => getListCheckPassword(tCommon),
    [i18n.resolvedLanguage],
  );

  const handleCheckValid = (value: string) => {
    const newListValid = [];

    for (const item of listCheck) {
      if (item.id === 1 && value.length >= 8) {
        newListValid.push(item.id);
        continue;
      }

      if (item.regex?.test(value)) {
        newListValid.push(item.id);
      }
    }

    setListValid(newListValid);
  };

  const onSubmitChangePassword = async (values: IChangePasswordMeForm) => {
    const inValidPassword = checkPassword(values.newPassword);

    if (inValidPassword) {
      setError("newPassword", { message: inValidPassword });
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError("confirmPassword", {
        message: tError("CONFIRM_PASSWORD_INCORRECT"),
      });
      return;
    }

    const dataSend: IChangePasswordMeRequest = {
      password: values.password,
      newPassword: values.newPassword,
    };

    setLoading(true);

    try {
      await apiMeService.changePassword(dataSend);

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
      onCancel();
      setListValid([]);
      reset(initChangePasswordData);
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "PASSWORD_INCORRECT") {
        setError("password", {
          message: tError(MESSAGE_ERROR.PASSWORD_INCORRECT),
        });
      }
    }

    setLoading(false);
  };

  return (
    <ModalConfirm
      title={t("changePasswordModal.title")}
      open={open}
      type="info"
      onCancel={onCancel}
      onOk={handleSubmit(onSubmitChangePassword)}
      okText={tCommon("confirm")}
      cancelText={tCommon("goBack")}
      okButtonProps={{
        loading,
        disabled: loading,
      }}>
      {/* Form change password */}
      <div className="flex flex-col py-5 gap-5">
        <div className="flex flex-col">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputPassword
                title={t("changePasswordModal.currentPassword")}
                placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
                error={!!errors.password}
                errorMessage={errors.password?.message}
                sizeText="small"
                required={true}
                onPressEnter={handleSubmit(onSubmitChangePassword)}
                {...field}
              />
            )}
          />
        </div>
        <div className="flex flex-col">
          <Controller
            name="newPassword"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <InputPassword
                title={t("changePasswordModal.newPassword")}
                placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
                error={!!errors.newPassword}
                errorMessage={errors.newPassword?.message}
                sizeText="small"
                required={true}
                onChange={(e) => {
                  onChange(e);
                  handleCheckValid(e.target.value);
                }}
                onPressEnter={handleSubmit(onSubmitChangePassword)}
                {...rest}
              />
            )}
          />
        </div>
        <div className="flex flex-col">
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <InputPassword
                title={t("changePasswordModal.confirmPassword")}
                placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
                error={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
                sizeText="small"
                required={true}
                onPressEnter={handleSubmit(onSubmitChangePassword)}
                {...field}
              />
            )}
          />
        </div>

        <CheckPassword listCheck={listCheck} listValid={listValid} />
      </div>
    </ModalConfirm>
  );
};

export default ChangePasswordModal;
