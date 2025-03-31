import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { apiStaffService } from "~/api-client/staff";
import MESSAGE_ERROR from "~/common/errorMessage";
import { InputPassword } from "~/components/Core/Input";

import { ModalConfirm } from "~/components/Modal";
import CheckPassword from "~/components/Password/Check";
import { checkPassword, getListCheckPassword } from "~/helper/auth";
import { ICheckPassword } from "~/interface/password";
import { IResetPasswordStaffForm, IStaffResponse } from "../interfaces";
import { initResetPasswordStaffData } from "../common/resetPasswordForm";
import { resetPasswordStaffFormSchema } from "../schema/resetPasswordForm.schema";
import MESSAGE_SUCCESS from "~/common/successMessage";
import useMessageAntd from "~/hooks/useMessageAntd";

interface Props {
  open: boolean;
  staff: IStaffResponse;
  onCancel: () => void;
}

const ChangePasswordModal = (props: Props) => {
  const { staff, open, onCancel } = props;

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
  } = useForm<IResetPasswordStaffForm>({
    defaultValues: initResetPasswordStaffData,
    resolver: yupResolver(resetPasswordStaffFormSchema(tError)) as any,
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

  const onSubmitChangePassword = async (values: IResetPasswordStaffForm) => {
    const inValidPassword = checkPassword(values.newPassword);

    if (inValidPassword) {
      setError("newPassword", { message: inValidPassword });
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError("confirmPassword", {
        message: tError(MESSAGE_ERROR.CONFIRM_PASSWORD_INCORRECT),
      });
      return;
    }

    setLoading(true);

    try {
      await apiStaffService
        .resetPassword(staff.userId, {
          newPassword: values.newPassword,
        })
        .then((res) => res);

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
      onCancel();
      setListValid([]);
      reset(initResetPasswordStaffData);
    } catch (err) {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
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
        <Controller
          name="newPassword"
          control={control}
          render={({ field: { onChange, ...rest } }) => (
            <InputPassword
              title={t("changePasswordModal.newPassword")}
              placeholder={tError("PLEASE_INPUT")}
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

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <InputPassword
              title={t("changePasswordModal.confirmPassword")}
              placeholder={tError("PLEASE_INPUT")}
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              sizeText="small"
              required={true}
              onPressEnter={handleSubmit(onSubmitChangePassword)}
              {...field}
            />
          )}
        />

        <CheckPassword listCheck={listCheck} listValid={listValid} />
      </div>
    </ModalConfirm>
  );
};

export default ChangePasswordModal;
