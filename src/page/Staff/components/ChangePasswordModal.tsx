import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";

import { changePasswordStaff } from "~/api-client/staff";
import MESSAGE_ERROR from "~/common/errorMessage";
import { InputPassword } from "~/components/Core/Input";

import { ModalConfirm } from "~/components/Modal";
import CheckPassword from "~/components/Password/Check";
import { checkPassword, getListCheckPassword } from "~/helper/auth";
import { IChangePassword, ICheckPassword } from "~/interface/password";
import { IStaff } from "~/interface/staff";

interface Props {
  open: boolean;
  staff: IStaff;
  onCancel: () => void;
}

const initData: IChangePassword = {
  confirmPassword: "",
  newPassword: "",
  currentPassword: "",
};

const ChangePasswordModal = (props: Props) => {
  const { staff, open, onCancel } = props;

  const { t, i18n } = useTranslation("AccountPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tSuccess } = useTranslation("Success");
  const { t: tError } = useTranslation("Error");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      newPassword: string().required(tError("PLEASE_INPUT")),
      confirmPassword: string().required(tError("PLEASE_INPUT")),
    });
  }, [i18n.resolvedLanguage]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm<IChangePassword>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [listValid, setListValid] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

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

  const onSubmitChangePassword = async (values: IChangePassword) => {
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

    setLoading(true);

    try {
      await changePasswordStaff(staff.userId, {
        newPassword: values.newPassword,
      }).then((res) => res);

      messageApi.success(tSuccess("update"));
      onCancel();
      setListValid([]);
      reset(initData);
    } catch (err) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
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
      }}
    >
      {/* Form change password */}
      <div className="flex flex-col py-5 gap-5">
        <div className="flex flex-col">
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
                placeholder={tError("PLEASE_INPUT")}
                error={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
                sizeText="small"
                required={true}
                {...field}
              />
            )}
          />
        </div>

        <CheckPassword listCheck={listCheck} listValid={listValid} />

        {/* message Antd */}
        {contextHolder}
      </div>
    </ModalConfirm>
  );
};

export default ChangePasswordModal;
