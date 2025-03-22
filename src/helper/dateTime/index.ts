import { DefaultOptionType } from "antd/es/select";
import { VALUE_OF_24_HOURS } from "~/common/format";
import { ITimeStartEndSlot } from "~/interface/select";

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

const generateTimeSlots = (
  durationStep: number,
  startTime: number = 0,
  endTime: number = 24,
): { options: DefaultOptionType[] } => {
  if (durationStep < 1) {
    durationStep = 30;
  }

  const times: DefaultOptionType[] = [];

  for (let i = startTime; i <= endTime; i++) {
    const hour = i.toString().padStart(2, "0");
    let minuteLeft = durationStep;

    times.push({ label: `${hour}:00`, value: i });

    while (minuteLeft < 60 && i < endTime) {
      const minute = minuteLeft.toString().padStart(2, "0");
      const time = `${hour}:${minute}`;
      times.push({ label: time, value: i + minuteLeft / 60 });
      minuteLeft += durationStep;
    }
  }

  return { options: times };
};

const decimalToTime = (decimal: number): { hours: number; minutes: number } => {
  // if value is 23.98, return 24:00
  if (decimal === VALUE_OF_24_HOURS) {
    return { hours: 24, minutes: 0 };
  }

  const hours = Math.floor(decimal);
  const minutes = (decimal - hours) * 60;
  return { hours, minutes };
};

const formatTime = (hours: number, minutes: number): string => {
  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}`;
};

const generateTimeStartEndSlots = (
  startTime: number,
  endTime: number,
  stepDuration: number,
): ITimeStartEndSlot[] => {
  if (stepDuration < 1) {
    stepDuration = 30;
  }

  const slots: ITimeStartEndSlot[] = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    const { hours: startHours, minutes: startMinutes } =
      decimalToTime(currentTime);
    const nextTime = currentTime + stepDuration / 60;
    const { hours: endHours, minutes: endMinutes } = decimalToTime(nextTime);
    const slot = `${formatTime(startHours, startMinutes)} - ${formatTime(endHours, endMinutes)}`;

    if (nextTime > endTime) break;

    slots.push({
      label: slot,
      from: currentTime,
      to: nextTime,
    });

    currentTime = nextTime;
  }

  return slots;
};

function getTimezoneOffset(timezone: string) {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat([], {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });
  const utcHours = new Date(date.toUTCString()).getUTCHours();
  const localHours = +formatter.format().split(" ")[0];

  return localHours - utcHours;
}

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export {
  formatDate,
  generateTimeSlots,
  generateTimeStartEndSlots,
  decimalToTime,
  formatTime,
  getTimezoneOffset,
  getUserTimezone,
};
