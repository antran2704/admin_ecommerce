import clsx from "clsx";
import { memo, useEffect, useState } from "react";
import { ISelectItem } from "~/interface/select";

interface Props {
  options?: ISelectItem[];
  value?: string | string[];
  type?: "single" | "multiple";
  classNames?: {
    wrap?: string;
    item?: string;
  };
  onChange?: (value: string | string[]) => void;
}

const SelectItem = ({
  type,
  data,
  value,
  className,
  onChange,
}: {
  type: "single" | "multiple";
  data: ISelectItem;
  value: string | string[];
  className: string;
  onChange?: (value: string | string[]) => void;
}) => {
  const onChangeMultiple = (item: string) => {
    let newValue: string[] = [...value];

    if (newValue.includes(item)) {
      newValue = newValue.filter((value: string) => value !== item);
    } else {
      newValue.push(item);
    }

    if (onChange) onChange(newValue);
  };

  if (type === "multiple") {
    return (
      <li
        className={clsx(
          "text-sm font-medium px-5 py-2 border rounded-md cursor-pointer select-none",
          [
            value?.includes(data.value)
              ? "border-primary-color text-primary-color "
              : "border-gray-300 text-gray-300 ",
          ],
          [data.disabled && "pointer-events-none opacity-50"],
          className,
        )}
        onClick={() => onChangeMultiple(data.value)}
      >
        {data.label}
      </li>
    );
  }

  return (
    <li
      className={clsx(
        "text-sm font-medium px-5 py-2 border rounded-md cursor-pointer select-none",
        [
          value === data.value
            ? "border-primary-color text-primary-color "
            : "border-gray-300 text-gray-300 ",
        ],
        [data.disabled && "pointer-events-none opacity-50"],
        className,
      )}
      onClick={() => onChange(data.value)}
    >
      {data.label}
    </li>
  );
};

const SelectItems = (props: Props) => {
  const { options = [], type = "single", value, classNames, onChange } = props;

  const [selectItems, setSelectItems] = useState<string | string[]>(
    type === "single" ? "" : [],
  );

  const onSelect = (data: string | string[]) => {
    setSelectItems(data);

    if (onChange) onChange(data);
  };

  useEffect(() => {
    setSelectItems(value);
  }, [value]);

  return (
    <ul className={clsx("flex flex-wrap items-center gap-5", classNames?.wrap)}>
      {options.map((option: ISelectItem) => (
        <SelectItem
          key={option.value}
          type={type}
          value={selectItems}
          data={option}
          className={classNames?.item}
          onChange={onSelect}
        />
      ))}
    </ul>
  );
};

export default memo(SelectItems);
