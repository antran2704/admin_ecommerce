import { DatePickerProps } from "antd";
import dayjs from "dayjs";

const disabledBeforeDaysWhenSelect: DatePickerProps["disabledDate"] = (
  current,
  { from },
) => {
  if (from) {
    return Math.abs(current.diff(from, "days")) > current.diff(from, "days");
  }

  return false;
};

const disabledBeforeDays: DatePickerProps["disabledDate"] = (current) => {
  return current && current < dayjs().startOf("day");
};

const disabledBeforeDaysInMonth: DatePickerProps["disabledDate"] = (
  current,
) => {
  return (
    current &&
    (current < dayjs().startOf("day") || current > dayjs().endOf("month"))
  );
};

const disabledOneWeekWhenSelect: DatePickerProps["disabledDate"] = (
  current,
  { from },
) => {
  if (from) {
    return Math.abs(current.diff(from, "days")) > current.get("days");
  }

  return false;
};

const disabledOneWeek: DatePickerProps["disabledDate"] = (current) => {
  return (
    current &&
    (current < dayjs().startOf("week") || current > dayjs().endOf("week"))
  );
};

const disabledOneMonthWhenSelect: DatePickerProps["disabledDate"] = (
  current,
  { from },
) => {
  if (from) {
    return Math.abs(current.diff(from, "days")) > current.daysInMonth();
  }

  return false;
};

const disabledOneMonth: DatePickerProps["disabledDate"] = (current) => {
  return (
    current &&
    (current < dayjs().startOf("month") || current > dayjs().endOf("month"))
  );
};

export {
  disabledBeforeDays,
  disabledBeforeDaysInMonth,
  disabledBeforeDaysWhenSelect,
  disabledOneWeek,
  disabledOneWeekWhenSelect,
  disabledOneMonth,
  disabledOneMonthWhenSelect,
};
