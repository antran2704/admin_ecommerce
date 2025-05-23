import { Modal, ModalProps } from "antd";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { BiSolidError } from "react-icons/bi";
import { FaInfoCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";

interface Props extends ModalProps {
  title: string;
  titleCenter?: boolean;
  subtitle?: string;
  type?: "info" | "danger" | "error";
  description?: string;
  children?: React.ReactNode;
}

const ModalConfirm = (props: Props) => {
  const {
    title,
    titleCenter = false,
    subtitle,
    type = "info",
    description,
    children,
    okButtonProps,
    cancelButtonProps,
    ...prop
  } = props;

  const { t: tCommon } = useTranslation("Common");

  return (
    <Modal
      centered
      title={
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center rounded-full">
            {type === "danger" && (
              <BiSolidError className="text-3xl text-yellow-500" />
            )}
            {type === "info" && (
              <FaInfoCircle className="text-3xl text-primary-color" />
            )}
            {type === "error" && (
              <MdOutlineError className="text-3xl text-red-500" />
            )}
          </div>
          <div className={clsx("w-full")}>
            <p className={clsx("text-lg", [titleCenter && "text-center"])}>
              {title}
            </p>
            {subtitle && (
              <p className={clsx("text-base font-normal")}>{subtitle}</p>
            )}
            {description && (
              <p className={clsx("text-base font-normal italic py-2")}>
                {description}
              </p>
            )}
          </div>
        </div>
      }
      cancelButtonProps={{
        className: "md:w-[120px] w-1/2 bg-gray-1000",
        type: "text",
        size: "large",
        ...cancelButtonProps,
      }}
      okButtonProps={{
        size: "large",
        ...okButtonProps,
        className: clsx(
          "md:w-[120px] w-1/2",
          [
            type === "danger" &&
              "!bg-text-yellow-500 hover:!bg-text-yellow-600",
          ],
          [type === "info" && "!bg-primary-color hover:!bg-green-600"],
          [type === "error" && "!bg-red-500 hover:!bg-red-600"],
          okButtonProps?.className,
        ),
      }}
      okText={tCommon("confirm")}
      cancelText={tCommon("goBack")}
      {...prop}
    >
      {children}
    </Modal>
  );
};

export default ModalConfirm;
