import { useMemo, useState } from "react";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { urlToBase64 } from "~/helper/url";
import { isExitUser, resendOTP } from "~/api-client/auth";
import { LOGO } from "~/common/image";
import { InputText } from "~/components/Core/Input";
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ENUM_OTP_TYPE } from "~/enum/auth";
import { IResponseOTP } from "~/interface/auth";

interface IFormData {
  email: string;
}

const initData: IFormData = {
  email: "",
};

const ConfirmOTP = () => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation("ForgotPasswordPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");

  // validation form
  const schema = useMemo(() => {
    return object().shape({
      email: string()
        .required(tError("PLEASE_INPUT"))
        .email(tError("INVALID_EMAIL")),
    });
  }, [i18n.resolvedLanguage]);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
  } = useForm<IFormData>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const onSubmit = async (values: IFormData) => {
    setIsSubmit(true);

    await isExitUser(values.email)
      .then(async (isExited: boolean) => {
        if (!isExited) {
          setError("email", { message: tError("notFoundUser") });
          setIsSubmit(false);
          return;
        }

        const res: IResponseOTP = await resendOTP({
          email: values.email,
          type: ENUM_OTP_TYPE.FORGOT_PASSWORD,
        });

        // save expired time to local storage
        localStorage.setItem("otp_expired", res.expiredTime);

        navigate(`/confirm-otp/${urlToBase64(values.email)}`);
      })
      .catch(() => {
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
        className="w-full 2xl:!py-6 !py-5 !flex items-center justify-center !text-lg !font-semibold"
      >
        {tCommon("continute")}
      </Button>
    </div>
  );
};

export default ConfirmOTP;
