import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { CHECK_IMAGE_PATH } from "~/common/image";

const BtnCheck = (props: ButtonProps) => {
  return (
    <Button
      type="text"
      icon={
        <img
          src={CHECK_IMAGE_PATH}
          className={clsx("size-3", props.classNames?.icon)}
          alt="Check icon"
          title="Check icon"
        />
      }
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default BtnCheck;
