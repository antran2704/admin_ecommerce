import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Button, message as messageAntd, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { IAuthToken, ILogin } from "~/interface/auth";
import { login } from "~/api-client/auth";

import MESSAGE_ERROR from "~/common/error";
import { setAuthToken } from "~/helper/auth";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import { LOGO } from "~/common/image";
import { InputPassword, InputText } from "~/components/Core/Input";

const initData: ILogin = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const { t, i18n } = useTranslation("LoginPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const navigate = useNavigate();

  // validation form
  const schema = useMemo(() => {
    return object().shape({
      email: string()
        .required(tError("PLEASE_INPUT"))
        .email(tError("INVALID_EMAIL")),
      password: string().required(tError("PLEASE_INPUT")),
    });
  }, [i18n.resolvedLanguage]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<ILogin>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [message, setMessage] = useState<string | null>(null);

  const [modal, setModal] = useState<{ banned: boolean }>({ banned: false });

  const [loading, setLoading] = useState<boolean>(false);

  const onModal = (key: keyof typeof modal, value: boolean) => {
    setModal({ ...modal, [key]: value });
  };

  const onSubmit = async (values: ILogin) => {
    setLoading(true);

    try {
      const payload: IAuthToken = await login(values);

      if (!payload) {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }

      const { accessToken, refreshToken } = payload;
      setAuthToken("accessToken", accessToken);
      setAuthToken("refreshToken", refreshToken);

      navigate("/");
    } catch (err) {
      const response = hanldeErrorAxios(err);

      if (response.statusCode === 401) {
        setMessage(tError(response.message));
        setValue("password", "");
      }

      if (message === "USER_DISABLED") {
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
          alt="NFT Trade"
          title="NFT Trade"
        />
      </Link>

      <div>
        <h1 className="2xl:text-3xl md:text-2xl text-xl font-bold text-green-500 mb-3 2xl:mt-10 mt-5">
          {t("title")}
        </h1>
        {/* Form */}
        <div
          className={clsx(
            { "opacity-40": loading },
            "w-full flex flex-col gap-3",
          )}
        >
          <div>
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

          <div>
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
                  onChange={(e) => {
                    if (message) {
                      setMessage(null);
                    }

                    onChange(e);
                    // handleCheckValid(e.target.value);
                  }}
                  {...rest}
                />
              )}
            />
          </div>

          {message && <p className="text-sm text-red-500 pt-2">*{message}</p>}
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
            Tài khoản tạm ngưng hoạt động. Vui lòng liên hệ Admin để mở tài
            khoản
          </p>

          <Button type="primary" size="large" className="mt-5 px-10">
            <Link to="/">Liên hệ hỗ trợ</Link>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
