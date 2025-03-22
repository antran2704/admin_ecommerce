import { Button, ButtonProps } from "antd";
import { RxDownload } from "react-icons/rx";
import clsx from "clsx";

const BtnExport = (props: ButtonProps) => {
  const { children, classNames, ...rest } = props;

  return (
    <Button
      type="text"
      icon={
        <RxDownload
          className={clsx(
            "2xl:text-2xl text-xl text-orange-500",
            classNames?.icon,
          )}
        />
      }
      size="large"
      {...rest}
    >
      {children}
    </Button>
  );
};

export default BtnExport;
