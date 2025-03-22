import { Modal, ModalProps } from "antd";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface Props extends ModalProps {
  alignBottom?: "center" | "left" | "right";
  description?: string;
}

const ModalAlert = (props: Props) => {
  const {
    title,
    children,
    classNames,
    alignBottom = "center",
    description,
    okButtonProps,
    cancelButtonProps,
    ...rest
  } = props;

  const { t: tCommon } = useTranslation("Common");

  return (
    <Modal
      title={
        <h4 className="text-xl font-semibold text-center pb-2">{title}</h4>
      }
      centered
      classNames={{
        ...classNames,
        footer: clsx(
          "flex !pt-5 gap-5",
          [alignBottom === "center" && "justify-center"],
          [alignBottom === "left" && "justify-start"],
          [alignBottom === "right" && "justify-end"],
        ),
        content: "!px-5 !py-8 !rounded-2xl",
      }}
      closable={false}
      okText={tCommon("confirm")}
      cancelText={tCommon("goBack")}
      {...rest}
      cancelButtonProps={{
        size: "large",
        className: "min-w-[130px] bg-gray-1000",
        type: "text",
        ...cancelButtonProps,
      }}
      okButtonProps={{
        size: "large",
        className: "min-w-[130px]",
        ...okButtonProps,
      }}
    >
      {description && <p className="text-base text-center">{description}</p>}
      {children}
    </Modal>
  );
};

export default ModalAlert;
