const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

const formatTime = (hours: number, minutes: number): string => {
  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}`;
};

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export { formatDate, formatTime, getUserTimezone };
