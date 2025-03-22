import { DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import clsx from "clsx";
import { forwardRef, LegacyRef } from "react";

import FormField from "../../Input/FormField";
import { IFormField } from "~/interface/form";
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

type Props = IFormField &
  RangePickerProps & {
    borderBottom?: boolean;
    typeDisabledDate?: keyof typeof typeDisable;
    onChangeDate?: (value: string | string[]) => void;
  };

const DateRangeFilter = (props: Props, ref: LegacyRef<undefined>) => {
  const {
    title,
    className,
    borderBottom,
    typeDisabledDate,
    sizeText = "medium",
    direction = "vertical",
    required,
    classNameWrap,
    error,
    errorMessage,
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
      <DatePicker.RangePicker
        disabledDate={typeDisabledDate && typeDisable[typeDisabledDate]}
        ref={ref}
        {...rest}
        status={error ? "error" : ""}
        className={clsx("!py-2", className)}
      />
    </FormField>
  );
};

export default forwardRef(DateRangeFilter);
