import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);


export class BaseService {
    constructor() {
        
    }

    transformQuery = (object: any) => {

        let str = '';

        Object.keys(object).forEach((key) => {
            if (object[key] !== undefined && object[key] !== null && (Number.isInteger(object[key]) || object[key].length > 0)) {
                str = str + `${str.length === 0 ? '?' : '&'}${key}=${object[key]}`
            }
        });

        return str
    }

    newDate(date?: Date | string): Date {
        const tz = process.env.NEXT_PUBLIC_TIME_ZONE || "UTC";
        return date
          ? dayjs(date).tz(tz).toDate()
          : dayjs().tz(tz).toDate();
      }
    
      /**
       * Retorna la fecha en formato "DD MMM YYYY - hh:mm a" (e.g. "12 Aug 2022 - 12:25 am")
       */
      formatAmPm(date: Date): string {
        const tz = process.env.NEXT_PUBLIC_TIME_ZONE || "UTC";
    
        // Usamos dayjs directamente para formatear en la zona horaria adecuada
        return dayjs(date)
          .tz(tz)
          .format("DD MMM YYYY - hh:mm a");
      }
}
