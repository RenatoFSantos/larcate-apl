import * as dayjs from 'dayjs';
import * as isLeapYear from 'dayjs/plugin/isLeapYear';
import 'dayjs/locale/pt-BR';
dayjs.extend(isLeapYear);
dayjs.locale('pt-BR');
import * as duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function getStringValuesFromEnum(myEnum: any) {
  return Object.keys(myEnum).filter(
    (k) => typeof (myEnum as any)[k] === 'number'
  ) as any;
}

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export default function compare(
  a: number | string,
  b: number | string,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function calcDurationDays(startDate: Date, endDate: Date): number {
  const dtStart = dayjs(new Date(startDate));
  const dtEnd = dayjs(new Date(endDate));
  const diff = dtStart.diff(dtEnd);
  if (isNaN(diff)) {
    return 0;
  } else {
    return diff;
  }
}

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function getTimeAsString(date: Date) {
  return `${(date.getHours() < 10 ? '0' : '') + date.getHours()}:${
    (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  }`;
}

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function getDateTimeAsString(date: Date, time: Date) {
  const newDate = dayjs(new Date(date), 'DD/MM/YYYY');
  const newTime = dayjs(time, 'HH:mm:ss');
  newDate.hour(newTime.hour());
  newDate.minute(newTime.minute());
  newDate.second(newTime.second());
  return newDate;
}

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function convertCurrency(vlDelivery: number, type: string) {
  let result = 0;
  if (vlDelivery > 0) {
    const vl = vlDelivery.toString();
    if (type.toLocaleUpperCase() === 'US') {
      console.log('parseFloat=', parseFloat(vl).toFixed(2));
      result = parseFloat(parseFloat(vl).toFixed(2));
    } else if (type.toLocaleUpperCase() === 'BR') {
      console.log('parseFloat=', parseFloat(vl).toFixed(2));
      result = parseFloat(parseFloat(vl).toFixed(2).replace('.', ','));
    }
  }
  return result;
}

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function convertMilesecondsInHours(ms: number) {
  const minutes = Math.trunc((ms / 60000) % 60);
  const hours = Math.trunc(ms / 3600000);
  const duration = `${hours < 10 ? '0' + hours : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  }`;
  return duration;
}
