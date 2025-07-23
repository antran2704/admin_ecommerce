import { Collapse, CollapseProps } from "antd";
import clsx from "clsx";

interface IProps {
  label: string;
  children?: React.ReactNode;
  collapseProps?: CollapseProps;
  collapseItemProps?: CollapseProps["items"][number];
}

const CollapseGroup = ({
  label,
  children,
  collapseProps,
  collapseItemProps,
}: IProps) => {
  return (
    <Collapse
      defaultActiveKey={["collapse"]}
      items={[
        {
          ...collapseItemProps,
          key: "collapse",
          label: label,
          children,
          headerClass: clsx(
            "text-lg font-semibold text-gray-900",
            collapseItemProps?.headerClass,
          ),
        },
      ]}
      size="large"
      {...collapseProps}
      expandIconPosition="end"
      className={clsx("border-gray-200", collapseProps?.className)}
    />
  );
};

export default CollapseGroup;
