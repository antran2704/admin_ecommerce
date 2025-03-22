import { DatePickerProps } from "antd";
import { TFunction } from "i18next";
import dayjs from "dayjs";

import { ENUM_DAY_OF_WEEK } from "~/enum/constants";
import { decimalToTime, formatTime } from "~/helper/dateTime";

const getDayOfWeekOptions = (t: TFunction) => {
  return [
    {
      label: t("monday"),
      value: ENUM_DAY_OF_WEEK.MONDAY,
    },
    {
      label: t("tuesday"),
      value: ENUM_DAY_OF_WEEK.TUESDAY,
    },
    {
      label: t("wednesday"),
      value: ENUM_DAY_OF_WEEK.WEDNESDAY,
    },
    {
      label: t("thursday"),
      value: ENUM_DAY_OF_WEEK.THURSDAY,
    },
    {
      label: t("friday"),
      value: ENUM_DAY_OF_WEEK.FRIDAY,
    },
    {
      label: t("saturday"),
      value: ENUM_DAY_OF_WEEK.SATURDAY,
    },
    {
      label: t("sunday"),
      value: ENUM_DAY_OF_WEEK.SUNDAY,
    },
  ];
};

const getLabelForTime = (time: number) => {
  const { hours, minutes } = decimalToTime(time);
  return formatTime(hours, minutes);
};

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
  getDayOfWeekOptions,
  getLabelForTime,
};
