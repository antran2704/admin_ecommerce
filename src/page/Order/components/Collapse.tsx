import { Collapse, CollapseProps } from "antd";
import clsx from "clsx";

interface IProps {
  label: string;
  children?: React.ReactNode;
  collapseProps?: CollapseProps;
}

const CollapseGroup = ({ label, children, collapseProps }: IProps) => {
  return (
    <Collapse
      defaultActiveKey={["collapse"]}
      items={[
        {
          key: "collapse",
          label: label,
          children,
          headerClass: "text-lg font-semibold text-gray-900",
        },
      ]}
      size="large"
      {...collapseProps}
      expandIconPosition="right"
      className={clsx("border-gray-200", collapseProps?.className)}
    />
  );
};

export default CollapseGroup;
