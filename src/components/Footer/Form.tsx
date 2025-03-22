import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  beforeEl?: JSX.Element;
  afterEl?: JSX.Element;
  centerEl?: JSX.Element;
  okText?: string;
  okProps?: ButtonProps;
  cancelProps?: ButtonProps;
  cancelText?: string;
  okElement?: ReactNode;
  cancelElement?: ReactNode;
  className?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const FormFooter = (props: Props) => {
  const {
    beforeEl,
    afterEl,
    centerEl,
    okText,
    okElement,
    cancelElement,
    cancelText,
    okProps,
    cancelProps,
    className,
    onCancel,
    onOk,
  } = props;
  const { t: tCommon } = useTranslation("Common");

  return (
    <div
      className={clsx(
        "sticky flex items-center justify-end w-full bottom-0 p-5 bg-white border-t gap-5 z-20",
        className,
      )}
    >
      {beforeEl}

      {!cancelElement ? (
        <Button
          size="large"
          {...cancelProps}
          onClick={onCancel}
          className={clsx(
            "min-w-[120px] w-fit text-md font-medium px-5 opacity-90 hover:opacity-100 rounded-md",
            cancelProps?.className,
            [cancelElement === null && "hidden"],
          )}
        >
          {cancelText ? cancelText : tCommon("goBack")}
        </Button>
      ) : (
        cancelElement
      )}

      {centerEl}

      {!okElement ? (
        <Button
          size="large"
          type="primary"
          {...okProps}
          onClick={onOk}
          className={clsx(
            "min-w-[120px] w-fit text-md text-primary font-medium bg-primary-100 px-5 opacity-90 hover:opacity-100 border-primary rounded-md",
            okProps?.className,
            [okElement === null && "hidden"],
          )}
        >
          {okText ? okText : tCommon("confirm")}
        </Button>
      ) : (
        okElement
      )}

      {afterEl}
    </div>
  );
};

export default FormFooter;
