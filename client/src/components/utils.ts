import dayjs, { Dayjs } from "dayjs";

export const formatInt = (n: number, digits?: number): string => {
  if (digits === undefined) {
    return "" + n;
  } else {
    return n.toLocaleString("ja-JP", {
      minimumIntegerDigits: digits,
      useGrouping: false,
    });
  }
};

const tzOffset = new Date().getTimezoneOffset();
const offsetSign = tzOffset <= 0 ? "+" : "-";
const offsetHour = Math.abs(tzOffset) / 60;
const offsetMinute = Math.abs(tzOffset) % 60;
const offsetString =
  offsetSign + formatInt(offsetHour, 2) + formatInt(offsetMinute, 2);

export const formatDateTime = (d: Date, isUtc: boolean = false): string => {
  let ret = `${formatDate(d, isUtc)}T${formatTime(d, isUtc)}`;
  if (isUtc) {
    return ret + "Z";
  } else {
    return ret + offsetString;
  }
};

export const toUtc = (d: Date): Date => {
  const sign = offsetSign === "+" ? -1 : 1;
  const durationInMinutes = offsetHour * 60 + offsetMinute;
  return new Date(d.valueOf() + sign * durationInMinutes * 60000);
};

export const formatDate = (d: Date, isUtc: boolean = false): string => {
  const d2 = isUtc ? toUtc(d) : d;
  return (
    formatInt(d2.getFullYear(), 4) +
    "-" +
    formatInt(d2.getMonth() + 1, 2) +
    "-" +
    formatInt(d2.getDate(), 2)
  );
};

export const parseDate = (s: string): Dayjs => {
  return dayjs(s, "YYYY-MM-DD");
};

export const formatTime = (d: Date, isUtc: boolean = false): string => {
  const d2 = isUtc ? toUtc(d) : d;
  return (
    formatInt(d2.getHours(), 2) +
    ":" +
    formatInt(d2.getMinutes(), 2) +
    ":" +
    formatInt(d2.getSeconds(), 2)
  );
};

export const secToStr = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const m = ("" + (minutes % 60)).padStart(2, "0");
  const hours = Math.floor(minutes / 60);
  return `${hours}:${m}`;
};
