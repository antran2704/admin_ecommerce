import { memo } from "react";
import { CustomTagProps } from "~/interface/select";

const SelectTag = (
  props: CustomTagProps & {
    items: string[] | number[];
    separator?: string;
    className?: string;
  },
) => {
  const { label, value, items, separator = " - ", className } = props;

  return (
    <p className={className}>
      {label}
      {items[items.length - 1] !== value && separator}
    </p>
  );
};

export default memo(SelectTag);
