import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axiosInstance from "../../../context/adminAxiosInstance";
import { IClientAddress } from "../../../api/src/interfaces";

dayjs.extend(utc);
dayjs.extend(timezone);


export class BaseService {

    axiosAdmin: typeof axiosInstance
    dayjs: typeof dayjs
    constructor() {
        this.axiosAdmin = axiosInstance
        this.dayjs = dayjs
    }

   
    decimalNumber = (number: number): string => {
        return number.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    transformQuery = (object: any) => {
        let str = '';

        Object.keys(object).forEach((key) => {
            const value = object[key];

            // Verifica que no sea null o undefined
            if (value !== undefined && value !== null) {
                // Si es un objeto Date, lo convierte a ISO string
                if (value instanceof Date) {
                    str += `${str.length === 0 ? '?' : '&'}${key}=${value}`;
                }
                // Si es un booleano
                else if (typeof value === 'boolean') {
                    str += `${str.length === 0 ? '?' : '&'}${key}=${value}`;
                }
                // Si es un número o string no vacío
                else if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) {
                    str += `${str.length === 0 ? '?' : '&'}${key}=${encodeURIComponent(value)}`;
                }
                // Si es un array no vacío
                else if (Array.isArray(value) && value.length > 0) {
                    value.forEach(v => {
                        str += `${str.length === 0 ? '?' : '&'}${key}=${encodeURIComponent(v)}`;
                    });
                }
            }
        });

        return str;
    };

    newDate(date?: Date | string): Date {
        const tz = process.env.NEXT_PUBLIC_TIME_ZONE || "UTC";
        return date
            ? dayjs(date).tz(tz).toDate()
            : dayjs().tz(tz).toDate();
    }

    dateToDateTimeLocal(date: Date | string | undefined | null): string {
        const tz = process.env.NEXT_PUBLIC_TIME_ZONE || "UTC";
        return dayjs(date).tz(tz).format("YYYY-MM-DDTHH:mm")
    }

    dateToLocal(date: Date | string | undefined | null): string {
        const tz = process.env.NEXT_PUBLIC_TIME_ZONE || "UTC";
        return dayjs(date).tz(tz).format("YYYY-MM-DD")
    }

    localTimeToDate(date: Date | string | undefined | null): Date {
        const tz = process.env.NEXT_PUBLIC_TIME_ZONE || "UTC";
        return dayjs(date).tz(tz).toDate()
    }

    /**
     * Retorna la fecha en formato "DD MMM YYYY - hh:mm a" (e.g. "12 Aug 2022 - 12:25 am")
     */
    formatAmPmLetters(date: Date): string {
        const tz = process.env.NEXT_PUBLIC_TIME_ZONE || "UTC";

        // Usamos dayjs directamente para formatear en la zona horaria adecuada
        return dayjs(date)
            .tz(tz)
            .format("DD MMM YYYY - hh:mm a");
    }
    formatLetters(date: Date): string {
        const tz = process.env.NEXT_PUBLIC_TIME_ZONE || "UTC";

        // Usamos dayjs directamente para formatear en la zona horaria adecuada
        return dayjs(date)
            .tz(tz)
            .format("DD MMM YYYY");
    }

    dominicanNumberFormat(number: number): string {
        const formatter = new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP'
        });
        return formatter.format(number);
    }

    fullAddress(address?: IClientAddress): string {
        if (!address) {
            return "N/A";
        }

        let add = "";

        if (address.address) {
            add = address.address;
        }

        if (address.childCounty) {
            add = `${add}, ${address.childCounty}`;
        }

        if (address.county) {
            add = `${add}, ${address.county}`;
        }

        if (address.city) {
            add = `${add}, ${address.city}`;
        }

        if (address.country) {
            add = `${add}, ${address.country}`;
        }

        return add ? add + "." : "N/A";
    }
}

export const baseService = new BaseService();
