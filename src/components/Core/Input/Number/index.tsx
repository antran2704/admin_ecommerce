import { Input, InputProps } from "antd";
import { forwardRef } from "react";
import { revertBigNumberToString } from "~/helper/format";
import { IFormField } from "~/interface/form";
import FormField from "../FormField";

type Props = IFormField &
  InputProps & {
    maximum?: number;
    onChangeValue?: (value: number) => void;
  };

const InputNumber = (props: Props, ref: any) => {
  const {
    title,
    error,
    required = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    classNameWrap,
    maximum,
    onChangeValue,
    ...rest
  } = props;

  const onChange = (value: string) => {
    const validValue = Number(revertBigNumberToString(value));
    if (isNaN(validValue)) return;

    if (onChangeValue && maximum && validValue > maximum) {
      onChangeValue(maximum);
      return;
    }

    if (onChangeValue) onChangeValue(validValue);
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
        size="large"
        ref={ref}
        {...rest}
        status={error ? "error" : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormField>
  );
};

export default forwardRef(InputNumber);
