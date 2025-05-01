import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { IoMdAddCircleOutline } from "react-icons/io";

const BtnAdd = (props: ButtonProps) => {
  return (
    <Button
      type="text"
      icon={
        <IoMdAddCircleOutline
          className={clsx("text-xl text-primary-color", props.classNames?.icon)}
        />
      }
      size="large"
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default BtnAdd;
