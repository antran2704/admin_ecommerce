import { Button, ButtonProps } from "antd";
import { LuListFilter } from "react-icons/lu";

const BtnFilter = (props: ButtonProps) => {
  return (
    <Button
      type="text"
      icon={<LuListFilter className="2xl:text-3xl text-2xl text-green-500" />}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default BtnFilter;
