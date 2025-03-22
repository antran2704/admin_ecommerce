import { Button, GetProp, Input, message as messageAntd } from "antd";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { decodeUrl, urlToBase64 } from "~/helper/url";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LOGO } from "~/common/image";
import { isInForgotPassword, resendOTP, verifyOTP } from "~/api-client/auth";
import MESSAGE_ERROR from "~/common/error";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import { ENUM_OTP_TYPE } from "~/enum/auth";
import { IResponseOTP } from "~/interface/auth";

let timmer: NodeJS.Timeout;

const ForgotOtpPage = () => {
  const { email } = useParams();
  const decodeEmail: string = decodeUrl(email as string);

  const { t } = useTranslation("ConfirmOtpPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");

  const navigate = useNavigate();

  const [second, setSecond] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");
  const [countDownLocalstorage, setCountDownLocalstorage] = useState<string>(
    () => {
      return localStorage.getItem("otp_expired");
    },
  );

  const otpLocalstorage = useMemo(() => {
    return localStorage.getItem("otp_expired");
  }, []);

  const [expired, setExpired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [message, setMessage] = useState<string | null>(null);

  const [messageApi, contextHolder] = messageAntd.useMessage();

  // handle call api check code here
  const onChange: GetProp<typeof Input.OTP, "onChange"> = async (
    text: string,
  ) => {
    setLoading(true);

    await verifyOTP({
      email: decodeEmail,
      otp: text,
      type: ENUM_OTP_TYPE.FORGOT_PASSWORD,
    })
      .then(() => {
        const uri = urlToBase64(decodeEmail + "-" + text);

        // remove otp_expired in localStorage if success
        // localStorage.removeItem("otp_expired");
        navigate(`/reset-password/${uri}`);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 401) {
          setMessage(tError("INVALID_OTP"));
        } else {
          messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });

    setLoading(false);
  };

  const onCountDown = () => {
    const now = new Date().getTime();
    const distance = new Date(countDownLocalstorage).getTime() - now;

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (minutes <= 0 && seconds <= 0) {
      setExpired(true);
      setMinute("00");
      setSecond("00");

      clearInterval(timmer);
      return;
    }

    setMinute(minutes.toString().padStart(2, "0"));
    setSecond(seconds.toString().padStart(2, "0"));
  };

  const handleResendOTP = async () => {
    setExpired(true);
    setLoading(true);

    await resendOTP({
      email: decodeEmail,
      type: ENUM_OTP_TYPE.FORGOT_PASSWORD,
    })
      .then(({ expiredTime }: IResponseOTP) => {
        messageApi.success(tCommon("success"));

        // save new expired time to local storage
        localStorage.setItem("otp_expired", expiredTime);

        setExpired(false);
        setCountDownLocalstorage(expiredTime);
      })
      .catch(() => {
        messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      });

    setExpired(false);
    setLoading(false);
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

  useEffect(() => {
    timmer = setInterval(() => {
      onCountDown();
    }, 1000);

    return () => {
      clearInterval(timmer);
    };
  }, [countDownLocalstorage]);

  useEffect(() => {
    if (!email || !decodeEmail || !otpLocalstorage) {
      navigate("/login");
    }

    handleCheckInForgot(decodeEmail);
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
        <div className="mt-10 mb-5">
          <h1 className="md:text-2xl text-xl text-center font-bold text-primary-200 mb-2">
            {t("title")}
          </h1>
          <h2 className="2xl:text-base text-sm font-semibold text-center">
            {t("description")}
          </h2>
          <p className="2xl:text-base text-sm text-center font-semibold text-green-500 my-1">
            {decodeEmail}
          </p>
        </div>
      </div>

      <div>
        <div className="inp__otp relative flex items-center justify-center">
          <div className={clsx({ "opacity-40": loading })}>
            <Input.OTP
              disabled={expired}
              length={6}
              formatter={(str) => str.toUpperCase()}
              onChange={onChange}
              onInput={() => setMessage(null)}
            />
            {message && (
              <p className="text-base text-red-500 pt-2 text-center">
                *{message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center text-sm font-medium py-3">
          <p>{minute}</p>
          <span>:</span>
          <p>{second}</p>
        </div>

        <p className="flex items-center text-sm justify-center gap-2">
          {t("noReceiveCode")}
          <span
            onClick={handleResendOTP}
            className="block text-sm text-green-500 text-center font-medium hover:text-green-500 hover:underline cursor-pointer"
          >
            {t("resend")}
          </span>
        </p>
      </div>

      <Button
        size="large"
        type="primary"
        loading={loading}
        disabled={expired || !!message}
        className="w-full !py-6 !flex items-center justify-center !text-lg !font-semibold"
      >
        {tCommon("continute")}
      </Button>

      {/* message Antd */}
      {contextHolder}
    </div>
  );
};

export default ForgotOtpPage;
