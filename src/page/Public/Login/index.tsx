import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button, message as messageAntd, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { IAuthToken, ILogin } from "~/interface/auth";

import MESSAGE_ERROR from "~/common/errorMessage";
import { setAuthToken } from "~/helper/auth";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import { LOGO } from "~/common/image";
import { InputPassword, InputText } from "~/components/Core/Input";
import initLoginForm from "../common/loginForm";
import { loginFormSchema } from "../schemas/login.schema";
import apiAuthService from "~/api-client/auth";

const LoginPage = () => {
  const { t } = useTranslation("LoginPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const navigate = useNavigate();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<ILogin>({
    defaultValues: initLoginForm,
    resolver: yupResolver(loginFormSchema(tError)) as any,
  });

  const [message, setMessage] = useState<string | null>(null);

  const [modal, setModal] = useState<{ banned: boolean }>({ banned: false });

  const [loading, setLoading] = useState<boolean>(false);

  const onModal = (key: keyof typeof modal, value: boolean) => {
    setModal({ ...modal, [key]: value });
  };

  const onChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => {
    if (message) {
      setMessage(null);
    }

    callback(e);
  };

  const onSubmit = async (values: ILogin) => {
    setLoading(true);

    try {
      const payload: IAuthToken = await apiAuthService.login(values);
      if (!payload) {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }

      const { accessToken, refreshToken } = payload;
      setAuthToken("accessToken", accessToken);
      setAuthToken("refreshToken", refreshToken);

      navigate("/");
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "EMAIL_OR_PASSWORD_INCORRECT") {
        setMessage(t("error.EMAIL_OR_PASSWORD_INCORRECT"));
        setValue("password", "");
      }

      if (message === "USER_NOT_FOUND") {
        setMessage(tError(MESSAGE_ERROR.USER_NOT_EXISTED));
      }

      if (message === "USER_WAS_DISABLED") {
        onModal("banned", true);
      }
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Link to={"/"}>
        <img
          src={LOGO}
          className="2xl:w-[140px] w-[120px]"
          alt="Logo"
          title="Logo"
        />
      </Link>

      <div>
        <h1 className="2xl:text-3xl md:text-2xl text-xl font-bold text-primary-color mb-3 2xl:mt-10 mt-5">
          {t("title")}
        </h1>
        {/* Form */}
        <div
          className={clsx(
            { "opacity-40": loading },
            "w-full flex flex-col gap-3",
          )}
        >
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <InputText
                title={t("form.username")}
                placeholder={tCommon("placeholder.email")}
                className="!py-2"
                error={!!errors.email}
                errorMessage={errors.email?.message}
                sizeText="small"
                required={true}
                onPressEnter={handleSubmit(onSubmit)}
                onChange={(e) => onChangeValue(e, onChange)}
                {...rest}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, ...rest } }) => (
              <InputPassword
                title={t("form.password")}
                placeholder={tCommon("placeholder.password")}
                className="!py-2"
                error={!!errors.password}
                errorMessage={errors.password?.message}
                sizeText="small"
                required={true}
                onPressEnter={handleSubmit(onSubmit)}
                onChange={(e) => onChangeValue(e, onChange)}
                {...rest}
              />
            )}
          />

          {message && <p className="text-sm text-red-500">*{message}</p>}
        </div>

        <div className="mt-5">
          <Button
            size="large"
            type="primary"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            className="w-full 2xl:!py-6 !py-5 !flex items-center justify-center !text-lg !font-semibold"
          >
            {t("title")}
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center pt-5">
        <Link
          to={"/forgot"}
          className="font-normal hover:underline text-green-300 text-base"
        >
          {t("btn.forgotPassword")}
        </Link>
      </div>

      <Modal
        width={400}
        classNames={{ content: "!rounded-xl" }}
        centered
        open={modal.banned}
        onCancel={() => onModal("banned", false)}
        closeIcon={null}
        footer={null}
      >
        <div className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-base font-semibold text-center text-gray-700">
            {t("bannedModal.title")}
          </p>

          <Button type="primary" size="large" className="mt-5 px-10">
            <Link to="/"> {t("btn.contactSupport")}</Link>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
