import { Input } from "antd";
import { InputRef, SearchProps } from "antd/es/input";
import clsx from "clsx";
import { ChangeEvent, forwardRef, Fragment, LegacyRef } from "react";
import { GoSearch } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";

interface Props extends Omit<SearchProps, "onChange"> {
  title?: string;
  error?: boolean;
  errorMessage?: string;
  sizeText?: "large" | "medium" | "small";
  debounce?: number;
  onChangeValue?: (value: string) => void;
  onSearch?: (value: string) => void;
}

const InputSearch = (props: Props, ref: LegacyRef<InputRef>) => {
  const {
    title,
    error,
    errorMessage,
    sizeText = "medium",
    debounce = 500,
    onChangeValue,
    onSearch,
    ...rest
  } = props;

  const { t: tError } = useTranslation("Error");

  const debounceSearch = useDebouncedCallback((value: string) => {
    if (onChangeValue) {
      onChangeValue(value);
    }
  }, debounce);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const valueInp: string = e.target.value;

    debounceSearch(valueInp);
  };

  const onEnter = (text: string): void => {
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <Fragment>
      {title && (
        <p
          className={clsx("pb-2 dark:text-darkInput", [
            sizeText === "large" && "text-lg",
            sizeText === "medium" && "text-base",
            sizeText === "small" && "text-sm",
          ])}
        >
          {title}
        </p>
      )}
      <div className="w-full">
        <Input
          ref={ref}
          size="large"
          {...rest}
          classNames={{
            suffix: "text-red-500",
            groupWrapper: "bg-red-500",
          }}
          onChange={onChange}
          onPressEnter={(e) => onEnter(e.currentTarget.value)}
          suffix={
            <GoSearch className="text-2xl text-gray-500 cursor-pointer" />
          }
          allowClear
          status={error ? "error" : ""}
        />

        {error && (
          <p className="text-sm text-red-500">
            {errorMessage
              ? errorMessage
              : tError("PLEASE_FILL_REQUIRED_FIELDS")}
          </p>
        )}
      </div>
    </Fragment>
  );
};

export default forwardRef(InputSearch);
