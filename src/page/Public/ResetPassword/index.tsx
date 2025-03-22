import { Button } from "antd";
import axios from "axios";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { isInForgotPassword, resetPassword } from "~/api-client/auth";
import { LOGO } from "~/common/image";
import { checkPassword, getListCheckPassword } from "~/helper/auth";
import { decodeUrl } from "~/helper/url";
import { IForgotPassword } from "~/interface/auth";
import { ErrorResponse } from "~/interface/response";

import { InputPassword } from "~/components/Core/Input";
import { ICheckPassword } from "~/interface/password";
import CheckPassword from "~/components/Password/Check";

interface IFormData {
  password: string;
  confirmPassword: string;
}

const initData: IFormData = {
  password: "",
  confirmPassword: "",
};

const SetupForgotPassword = () => {
  const { email_otp } = useParams();
  const navigate = useNavigate();

  // decoded uri to get phone and otp
  const [email, otpCode] = decodeUrl(email_otp as string).split("-");

  const { t: tCommon, i18n } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      password: string().required(tError("PLEASE_INPUT")),
      confirmPassword: string().required(tError("PLEASE_INPUT")),
    });
  }, [i18n.resolvedLanguage]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<IFormData>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [listValid, setListValid] = useState<number[]>([]);

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

  const handleCheckInForgot = async (email: string) => {
    await isInForgotPassword(email)
      .then((isInForgot) => {
        if (!isInForgot) {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  };

  const onSubmit = async (values: IFormData) => {
    const inValidPassword = checkPassword(values.password);

    if (inValidPassword) {
      setError("password", { message: inValidPassword });
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", {
        message: tError("CONFIRM_PASSWORD_INCORRECT"),
      });
      return;
    }

    setLoading(true);

    const dataSend: IForgotPassword = {
      verifyAccountOtp: otpCode,
      email,
      newPassword: values.password,
      confirmPassword: values.confirmPassword,
    };

    try {
      await resetPassword(dataSend).then((res) => res);
      navigate("/login");
    } catch (err) {
      if (!axios.isAxiosError(err)) return;

      const response = err.response;

      if (!response) return;

      const errorReponse: ErrorResponse = response.data;

      if (errorReponse.statusCode === 409) {
        setMessage(tError("foundUser"));
      }

      if (errorReponse.statusCode === 400) {
        switch (errorReponse.message) {
          case "INVALID_OTP":
            setMessage("Sai OTP");
            break;
        }
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!email || !otpCode) {
      navigate("/login");
    }

    handleCheckInForgot(email);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <Link to={"/"}>
        <img
          src={LOGO}
          className="2xl:w-[140px] w-[120px]"
          alt="NFT Trade"
          title="NFT Trade"
        />
      </Link>

      <div>
        <div
          className={clsx(
            { "opacity-40": loading },
            "w-full flex flex-col gap-3",
          )}
        >
          <div>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <InputPassword
                  title={tCommon("field.password")}
                  placeholder={tError("PLEASE_INPUT")}
                  className="!py-2"
                  error={!!errors.password}
                  errorMessage={errors.password?.message}
                  sizeText="small"
                  required={true}
                  onPressEnter={handleSubmit(onSubmit)}
                  onChange={(e) => {
                    if (message) {
                      setMessage(null);
                    }

                    onChange(e);
                    handleCheckValid(e.target.value);
                  }}
                  {...rest}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <InputPassword
                  title={tCommon("field.rePassword")}
                  className="!py-2"
                  placeholder={tError("PLEASE_INPUT")}
                  error={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword?.message}
                  sizeText="small"
                  required={true}
                  onPressEnter={handleSubmit(onSubmit)}
                  onChange={(e) => {
                    if (message) {
                      setMessage(null);
                    }
                    onChange(e);
                  }}
                  {...rest}
                />
              )}
            />
          </div>

          {message && <p className="text-sm text-red-500">{message}</p>}
        </div>

        <CheckPassword
          className="mt-5"
          listCheck={listCheck}
          listValid={listValid}
        />
      </div>

      <Button
        size="large"
        type="primary"
        loading={loading}
        onClick={handleSubmit(onSubmit)}
        className="w-full !py-6 !flex items-center justify-center !text-lg !font-semibold"
      >
        {tCommon("confirm")}
      </Button>
    </div>
  );
};

export default SetupForgotPassword;
