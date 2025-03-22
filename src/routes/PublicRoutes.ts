import { lazy } from "react";
import { v4 as uuidv4 } from "uuid";
import { IRoute } from "~/interface/route";

const LoignPage = lazy(() => import("~/page/Public/Login"));
const ForgotPage = lazy(() => import("~/page/Public/Forgot"));
const ConfirmOtpPage = lazy(() => import("~/page/Public/ConfirmOTP"));
const ResetPasswordPage = lazy(() => import("~/page/Public/ResetPassword"));

const PublicRoutes: IRoute[] = [
  {
    id: uuidv4(),
    href: "/login",
    element: LoignPage,
  },
  {
    id: uuidv4(),
    href: "/forgot",
    element: ForgotPage,
  },
  {
    id: uuidv4(),
    href: "/confirm-otp/:email",
    element: ConfirmOtpPage,
  },
  {
    id: uuidv4(),
    href: "/reset-password/:email_otp",
    element: ResetPasswordPage,
  },
];

export default PublicRoutes;
