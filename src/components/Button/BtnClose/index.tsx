import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { CLOSE_IMAGE_PATH } from "~/common/image";

const BtnClose = (props: ButtonProps) => {
  return (
    <Button
      type="text"
      icon={
        <img
          src={CLOSE_IMAGE_PATH}
          className={clsx("size-5", props.classNames?.icon)}
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

export default BtnClose;
