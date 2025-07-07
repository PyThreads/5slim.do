import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axiosInstance from "../../../context/adminAxiosInstance";
import { IClientAddress } from "../../../api/src/interfaces";

dayjs.extend(utc);
dayjs.extend(timezone);


export class BaseService {

    axiosAdmin : typeof axiosInstance
    
    constructor() {
        this.axiosAdmin = axiosInstance
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

    dateToDateimeLocal(date: Date | string | undefined | null): string {
        const tz = process.env.NEXT_PUBLIC_TIME_ZONE || "UTC";
        return dayjs(date).tz(tz).format("YYYY-MM-DDTHH:mm")
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

    fullAddress(address: IClientAddress): string {
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

        return add + ".";
    }
}

export const baseService = new BaseService();
