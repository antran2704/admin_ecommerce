import changePasswordImage from "@assets/images/AccountPage/changePassword.png";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";

interface Props {
  onModal?: () => void;
  children?: JSX.Element;
}

const ChangePassword = (props: Props) => {
  const { onModal, children } = props;

  const { t: tCommon } = useTranslation("Common");

  return (
    <Fragment>
      <p
        onClick={onModal}
        className="flex items-center font-medium text-sm hover:text-primary-color mx-auto mt-4 cursor-pointer gap-2"
      >
        <img
          src={changePasswordImage}
          alt="change password icon"
          title="change password icon"
          className="size-6 min-w-6"
        />
        {tCommon("changePassword")}
      </p>

      {children}
    </Fragment>
  );
};

export default ChangePassword;
