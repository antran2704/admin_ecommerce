import { Input, InputProps, InputRef } from "antd";
import { ChangeEvent, forwardRef, Ref } from "react";
import { IFormField } from "~/interface/form";
import FormField from "../FormField";
import { revertBigNumberToString } from "~/helper/format";

type Props = IFormField &
  InputProps & {
    type?: "text" | "number" | "phoneNumber";
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
    type = "text",
    onChange,
    ...rest
  } = props;

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (type === "text") {
      onChange && onChange(e);
      return;
    }

    const validValue = Number(revertBigNumberToString(value));
    if (isNaN(validValue)) return;

    if (onChange) onChange(e);
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
        onChange={onChangeValue}
        status={error ? "error" : ""}
      />
    </FormField>
  );
};

export default forwardRef(InputText);
