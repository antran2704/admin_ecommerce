import { Button, ButtonProps } from "antd";
import { MdOutlineFileUpload } from "react-icons/md";
import clsx from "clsx";

const BtnImport = (props: ButtonProps) => {
  const { children, classNames, ...rest } = props;

  return (
    <Button
      type="text"
      icon={
        <MdOutlineFileUpload
          className={clsx(
            "2xl:text-3xl text-2xl text-blue-500",
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

export default BtnImport;
