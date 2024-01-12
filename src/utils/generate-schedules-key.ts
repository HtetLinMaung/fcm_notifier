import moment from "moment-timezone";

function prefixChar(
  input: string | number,
  desiredLength: number,
  char: string = "0"
): string {
  input = input.toString().trim();
  while (input.length < desiredLength) {
    input = char + input;
  }
  return input;
}

export default function generateSchedulesKey(time: string, timezone: string) {
  const timeInTimeZone = moment(time).tz(timezone);
  return `${prefixChar(timeInTimeZone.year(), 4)}-${prefixChar(
    timeInTimeZone.month() + 1,
    2
  )}-${prefixChar(timeInTimeZone.day(), 2)} ${prefixChar(
    timeInTimeZone.hour(),
    2
  )}:${prefixChar(timeInTimeZone.minute(), 2)}:${prefixChar(
    timeInTimeZone.second(),
    2
  )} ${timezone}`;
}
