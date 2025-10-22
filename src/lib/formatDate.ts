const FORMATTERS = {
  short: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }),
  long: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
  numeric: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC" }),
} as const;

export type DateFormatStyle = keyof typeof FORMATTERS;

type DateInput = string | number | Date | null | undefined;

export function formatDate(value: DateInput, style: DateFormatStyle = "short"): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return FORMATTERS[style].format(date);
}
