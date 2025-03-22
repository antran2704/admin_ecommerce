import { Input, InputProps, InputRef } from "antd";
import { forwardRef, Ref } from "react";
import { IFormField } from "~/interface/form";
import FormField from "../FormField";

type Props = IFormField & InputProps;

const InputPassword = (props: Props, ref: Ref<InputRef>) => {
  const {
    title,
    error,
    required = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    classNameWrap,
    ...rest
  } = props;

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
      <Input.Password
        ref={ref}
        size="large"
        {...rest}
        status={error ? "error" : ""}
      />
    </FormField>
  );
};

export default forwardRef(InputPassword);
