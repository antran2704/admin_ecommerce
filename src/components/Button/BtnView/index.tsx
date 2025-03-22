import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { IoEyeOutline } from "react-icons/io5";

const BtnView = (props: ButtonProps) => {
  return (
    <Button
      type="text"
      icon={
        <IoEyeOutline
          className={clsx("text-xl text-blue-500", props.classNames?.icon)}
        />
      }
      size="large"
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default BtnView;
