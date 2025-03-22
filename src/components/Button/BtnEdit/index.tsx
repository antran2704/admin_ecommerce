import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { LuPencil } from "react-icons/lu";

const BtnEdit = (props: ButtonProps) => {
  return (
    <Button
      type="text"
      icon={
        <LuPencil
          className={clsx("text-lg text-orange-500", props.classNames?.icon)}
        />
      }
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default BtnEdit;
