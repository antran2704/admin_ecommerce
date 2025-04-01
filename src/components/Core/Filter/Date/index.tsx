import { DatePicker, DatePickerProps } from "antd";
import clsx from "clsx";
import { PickerRef } from "rc-picker";
import { forwardRef, LegacyRef } from "react";

import { IFormField } from "~/interface/form";
import FormField from "../../Input/FormField";
import {
  disabledBeforeDays,
  disabledBeforeDaysInMonth,
  disabledBeforeDaysWhenSelect,
  disabledOneMonth,
  disabledOneMonthWhenSelect,
  disabledOneWeek,
  disabledOneWeekWhenSelect,
} from "~/common/dateTime";

const typeDisable = {
  disabledBeforeDays,
  disabledBeforeDaysInMonth,
  disabledBeforeDaysWhenSelect,
  disabledOneWeek,
  disabledOneWeekWhenSelect,
  disabledOneMonth,
  disabledOneMonthWhenSelect,
};

type Props = DatePickerProps &
  IFormField & {
    borderBottom?: boolean;
    typeDisabledDate?: keyof typeof typeDisable;
  };

const DateSelect = (props: Props, ref: LegacyRef<PickerRef>) => {
  const {
    title,
    className,
    required = false,
    error = false,
    errorMessage,
    borderBottom,
    direction = "vertical",
    classNameWrap,
    sizeText = "medium",
    typeDisabledDate,
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
      {borderBottom && (
        <span className={"pb-4 border-b border-b-neutral-200"}></span>
      )}
      <DatePicker
        className={clsx("!py-2 w-full", className)}
        status={error ? "error" : ""}
        ref={ref}
        {...rest}
        disabledDate={typeDisabledDate && typeDisable[typeDisabledDate]}
      />
    </FormField>
  );
};

export default forwardRef(DateSelect);
