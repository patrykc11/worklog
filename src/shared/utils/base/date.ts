import { TimeUnit } from '@worklog/shared/definitions/enums/time.enums';
import { DateTime, Interval } from 'luxon';

type DatePrimitive = Date | number | string;

export class DateUtil {
  private constructor() {}

  static get now(): Date {
    return DateTime.utc().toJSDate();
  }

  static get nowInSeconds(): number {
    return Math.floor(DateTime.utc().toSeconds());
  }

  public static isValidDate(value: DatePrimitive): boolean {
    const date = this.fromPrimitive(value);

    return (
      date instanceof Date &&
      !isNaN(date.getTime()) &&
      DateTime.fromJSDate(date).isValid
    );
  }

  public static setZone(value: DatePrimitive, zone: string): Date {
    return DateTime.fromJSDate(this.fromPrimitive(value))
      .setZone(zone)
      .toJSDate();
  }

  public static getTimeZone(value: DatePrimitive): string | null {
    return DateTime.fromJSDate(this.fromPrimitive(value)).zoneName;
  }

  public static fromPrimitive(value: DatePrimitive): Date {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'number') {
      return new Date(value);
    }

    return DateTime.fromISO(value).toJSDate();
  }

  public static fromSeconds(seconds: number): Date {
    return DateTime.fromSeconds(seconds).toJSDate();
  }

  public static fromFormat(input: DatePrimitive, format: string): Date {
    const datetime = DateTime.fromFormat(input.toString(), format);
    return datetime.toJSDate();
  }

  public static format(input: DatePrimitive, format: string): string {
    return DateTime.fromJSDate(this.fromPrimitive(input)).toFormat(format);
  }

  public static getUTCOffsetInMinutes(value: DatePrimitive): number {
    const date = this.fromPrimitive(value);
    return DateTime.fromJSDate(date).offset;
  }

  public static getDuration(start: DatePrimitive, end: DatePrimitive): number {
    const { max, min } = this.getMinAndMax(start, end);

    return DateTime.fromJSDate(max).diff(DateTime.fromJSDate(min)).milliseconds;
  }

  public static max(...values: Array<Date | number | string>): Date {
    return DateTime.max(
      ...values.map((value) => DateTime.fromJSDate(this.fromPrimitive(value))),
    ).toJSDate();
  }

  public static min(...values: Array<Date | number | string>): Date {
    return DateTime.min(
      ...values.map((value) => DateTime.fromJSDate(this.fromPrimitive(value))),
    ).toJSDate();
  }

  public static getMinAndMax(...values: Array<Date | number | string>): {
    min: Date;
    max: Date;
  } {
    const dates = values.map((value) =>
      DateTime.fromJSDate(this.fromPrimitive(value)),
    );

    return {
      min: DateTime.min(...dates).toJSDate(),
      max: DateTime.max(...dates).toJSDate(),
    };
  }

  public static isBefore(start: DatePrimitive, end: DatePrimitive): boolean {
    return (
      DateTime.fromJSDate(this.fromPrimitive(start)) <
      DateTime.fromJSDate(this.fromPrimitive(end))
    );
  }

  public static isAfter(start: DatePrimitive, end: DatePrimitive): boolean {
    return (
      DateTime.fromJSDate(this.fromPrimitive(start)) >
      DateTime.fromJSDate(this.fromPrimitive(end))
    );
  }

  public static isPast(value: DatePrimitive): boolean {
    return this.fromPrimitive(value) < this.now;
  }

  public static isFuture(value: DatePrimitive): boolean {
    return this.fromPrimitive(value) > this.now;
  }

  public static isInRage({
    dateToCheck,
    from,
    to,
  }: {
    from: DatePrimitive;
    to: DatePrimitive;
    dateToCheck: DatePrimitive;
  }): boolean {
    const start = this.fromPrimitive(from);
    const end = this.fromPrimitive(to);
    const date = this.fromPrimitive(dateToCheck);
    const interval = Interval.fromDateTimes(start, end);
    return interval.contains(DateTime.fromJSDate(date));
  }

  public static diffInHours(start: DatePrimitive, end: DatePrimitive): number {
    const startDate = DateTime.fromJSDate(this.fromPrimitive(start));
    const endDate = DateTime.fromJSDate(this.fromPrimitive(end));

    return Math.round(endDate.diff(startDate, 'hours').hours);
  }

  public static toTimestamp(value?: Date | number | string): number {
    const date = value ? this.fromPrimitive(value) : this.now;
    return DateTime.fromJSDate(date).toMillis();
  }

  public static toUTC(value: DatePrimitive): Date {
    return DateTime.fromJSDate(this.fromPrimitive(value)).toUTC().toJSDate();
  }

  public static toISO(value: DatePrimitive): string {
    return (
      DateTime.fromJSDate(this.fromPrimitive(value)).toISO() ||
      new Date().toISOString()
    );
  }

  public static toMillis(value: DatePrimitive): number {
    return DateTime.fromJSDate(this.fromPrimitive(value)).toMillis();
  }

  public static toMinute(value: DatePrimitive): number {
    return DateTime.fromJSDate(this.fromPrimitive(value)).minute;
  }

  public static toHour(value: DatePrimitive): number {
    return DateTime.fromJSDate(this.fromPrimitive(value)).hour;
  }

  public static toDay(value: DatePrimitive): number {
    return DateTime.fromJSDate(this.fromPrimitive(value)).day;
  }

  public static toWeekDay(value: DatePrimitive): number {
    return DateTime.fromJSDate(this.fromPrimitive(value)).weekday;
  }

  public static toMonth(value: DatePrimitive): number {
    return DateTime.fromJSDate(this.fromPrimitive(value)).month;
  }

  public static toYear(value: DatePrimitive): number {
    return DateTime.fromJSDate(this.fromPrimitive(value)).year;
  }

  public static toDateWithZone(
    value: DatePrimitive,
    zone: string | null,
  ): Date {
    const date = this.fromPrimitive(value);

    const dateTime = DateTime.fromJSDate(date);

    if (zone) {
      dateTime.setZone(zone);
    }

    return dateTime.toJSDate();
  }

  public static add(
    value: number,
    duration: TimeUnit,
    initialDate?: DatePrimitive,
  ): Date {
    return this.addTime(duration, value, initialDate);
  }

  public static addMilliseconds(
    milliseconds: number,
    initialDate?: DatePrimitive,
  ): Date {
    return this.addTime(TimeUnit.Millisecond, milliseconds, initialDate);
  }

  public static addSeconds(seconds: number, initialDate?: DatePrimitive): Date {
    return this.addTime(TimeUnit.Second, seconds, initialDate);
  }

  public static addMinutes(minutes: number, initialDate?: DatePrimitive): Date {
    return this.addTime(TimeUnit.Minute, minutes, initialDate);
  }

  public static addHours(
    hours: number,
    initialDate?: number | string | Date,
  ): Date {
    return this.addTime(TimeUnit.Hour, hours, initialDate);
  }

  public static addDays(days: number, initialDate?: DatePrimitive): Date {
    return this.addTime(TimeUnit.Day, days, initialDate);
  }

  public static addWeeks(weeks: number, initialDate?: DatePrimitive): Date {
    return this.addTime(TimeUnit.Week, weeks, initialDate);
  }

  public static addMonths(months: number, initialDate?: DatePrimitive): Date {
    return this.addTime(TimeUnit.Month, months, initialDate);
  }

  public static addYears(years: number, initialDate?: DatePrimitive): Date {
    return this.addTime(TimeUnit.Year, years, initialDate);
  }

  public static substract(
    {
      duration,
      value,
    }: {
      value: number;
      duration: TimeUnit;
    },
    initialDate?: DatePrimitive,
  ): Date {
    return this.subtractTimeDuration(duration, value, initialDate);
  }

  public static roundToNearestMinutes(
    minutes: number,
    dateValue: DatePrimitive = this.now,
  ): Date {
    const dateTime = DateTime.fromJSDate(this.fromPrimitive(dateValue));
    const roundedMinutes = Math.floor(dateTime.minute / minutes) * minutes;

    const adjustedDateTime = dateTime.set({
      minute: roundedMinutes,
      second: 0,
      millisecond: 0,
    });

    return adjustedDateTime.toJSDate();
  }

  private static subtractTimeDuration(
    unit: TimeUnit,
    duration: number,
    dateValue: DatePrimitive = this.now,
  ): Date {
    const date = this.fromPrimitive(dateValue);

    return DateTime.fromJSDate(date)
      .minus({
        [unit]: duration,
      })
      .toJSDate();
  }

  private static addTime(
    unit: TimeUnit,
    duration: number,
    dateValue: DatePrimitive = this.now,
  ): Date {
    const date = this.fromPrimitive(dateValue);

    return DateTime.fromJSDate(date)
      .plus({
        [unit]: duration,
      })
      .toJSDate();
  }
}
