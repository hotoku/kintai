export function formatInt(n: number, digits: number | undefined): string {
  if (digits === undefined) {
    return "" + n;
  } else {
    return n.toLocaleString("ja-JP", {
      minimumIntegerDigits: digits,
      useGrouping: false,
    });
  }
}

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

export function updateArray<T extends { id: number }>(array: T[], obj: T): T[] {
  const ret = [] as T[];
  for (const x of array) {
    if (x.id === obj.id) {
      ret.push(obj);
    } else {
      x;
    }
  }
  return ret;
}
