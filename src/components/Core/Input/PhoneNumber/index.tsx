import { Input, InputProps, InputRef } from "antd";
import { ChangeEvent, forwardRef, Ref } from "react";
import { IFormField } from "~/interface/form";
import FormField from "../FormField";
import { revertBigNumberToString } from "~/helper/format";
import SelectFilter from "../../Filter/Select";

type Props = IFormField &
  InputProps & {
    codeArea?: string;
    onChangeCodeArea?: (value: string) => void;
  };

const InputText = (props: Props, ref: Ref<InputRef>) => {
  const {
    title,
    error,
    required = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    classNameWrap,
    codeArea,
    disabled,
    onChange,
    onChangeCodeArea,
    ...rest
  } = props;

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const validValue = Number(revertBigNumberToString(value));

    if (isNaN(validValue)) return;

    if (onChange) onChange(e);
  };

  const onSelect = (value: string) => {
    if (onChangeCodeArea) onChangeCodeArea(value);
  };

  return (
    <FormField
      title={title}
      error={error}
      errorMessage={errorMessage}
      required={required}
      sizeText={sizeText}
      direction={direction}
      classNameWrap={classNameWrap}
    >
      <Input
        ref={ref}
        size="large"
        {...rest}
        addonBefore={
          <SelectFilter
            defaultValue="+84"
            className="flex items-center"
            value={codeArea || "84"}
            showSearch={false}
            disabled={disabled}
            onChange={onSelect}
            options={[
              { label: "+84", value: "84" },
              { label: "+85", value: "85" },
            ]}
          />
        }
        onChange={onChangeValue}
        status={error ? "error" : ""}
        disabled={disabled}
      />
    </FormField>
  );
};

export default forwardRef(InputText);
