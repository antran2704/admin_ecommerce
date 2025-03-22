import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { GoTrash } from "react-icons/go";

const BtnTrash = (props: ButtonProps) => {
  return (
    <Button
      type="text"
      icon={
        <GoTrash
          className={clsx("text-lg text-red-500", props.classNames?.icon)}
        />
      }
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default BtnTrash;
