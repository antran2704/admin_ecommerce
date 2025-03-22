import { InputNumber, InputNumberProps } from "antd";
import { forwardRef } from "react";
import { IFormField } from "~/interface/form";
import FormField from "../FormField";
import clsx from "clsx";

type Props = IFormField & InputNumberProps;

const InputDecimal = (props: Props, ref: any) => {
  const {
    title,
    error,
    required = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    classNameWrap,
    className,
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
      <InputNumber
        type="number"
        size="large"
        className={clsx("w-full", className)}
        ref={ref}
        {...rest}
        status={error ? "error" : ""}
      />
    </FormField>
  );
};

export default forwardRef(InputDecimal);
