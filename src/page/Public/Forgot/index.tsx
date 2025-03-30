import { useState } from "react";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { urlToBase64 } from "~/helper/url";
import { LOGO } from "~/common/image";
import { InputText } from "~/components/Core/Input";
import apiAuthService from "~/api-client/auth";
import {
  IForgotPasswordForm,
  IForgotPasswordOtpResponse,
} from "../interfaces/forgotPassword.interface";
import { forgotPasswordFormSchema } from "../schemas/forgotPassword.chema";
import initForgotPasswordForm from "../common/forgotPasswordForm";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_ERROR from "~/common/errorMessage";

const ForgotPage = () => {
  const navigate = useNavigate();

  const { t } = useTranslation("ForgotPasswordPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
  } = useForm<IForgotPasswordForm>({
    defaultValues: initForgotPasswordForm,
    resolver: yupResolver(forgotPasswordFormSchema(tError)) as any,
  });

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const onSubmit = async (values: IForgotPasswordForm) => {
    setIsSubmit(true);

    const payload: IForgotPasswordForm = {
      email: values.email,
    };

    await apiAuthService
      .forgotPassword(payload)
      .then(({ expireAt }: IForgotPasswordOtpResponse) => {
        // save expired time to local storage
        localStorage.setItem("otp_expired", expireAt);

        navigate(`/confirm-otp/${urlToBase64(values.email)}`);
      })
      .catch((err) => {
        const { message } = hanldeErrorAxios(err);

        if (message === "USER_NOT_FOUND") {
          setError("email", {
            message: tError(MESSAGE_ERROR.USER_NOT_EXISTED),
          });
        }

        if (message === "USER_WAS_DISABLED") {
          setError("email", {
            message: tError(MESSAGE_ERROR.USER_WAS_DISABLED),
          });
        }

        setIsSubmit(false);
      });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <Link to={"/"}>
          <img
            src={LOGO}
            className="2xl:w-[140px] w-[120px]"
            alt="NFT Trade"
            title="NFT Trade"
          />
        </Link>

        <h1 className="2xl:text-3xl md:text-2xl text-xl font-bold text-green-500 mb-10 mt-6">
          {t("title")}
        </h1>

        <div>
          <p className="text-base mb-2 font-semibold">{t("description")}</p>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputText
                placeholder={tCommon("placeholder.email")}
                className="!py-2"
                error={!!errors.email}
                errorMessage={errors.email?.message}
                required={true}
                onPressEnter={handleSubmit(onSubmit)}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <Button
        size="large"
        type="primary"
        onClick={handleSubmit(onSubmit)}
        loading={isSubmit}
        disabled={!isValid}
        className="w-full 2xl:!py-6 !py-5 !flex items-center justify-center !text-lg !font-semibold">
        {tCommon("continute")}
      </Button>
    </div>
  );
};

export default ForgotPage;
