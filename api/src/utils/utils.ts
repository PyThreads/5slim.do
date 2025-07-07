import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { EnvironmentConfig, environmentConfig } from "../config";
import multer from 'multer';
import { IClientAddress } from "../interfaces";

dayjs.extend(utc);
dayjs.extend(timezone);
const storage = multer.memoryStorage();


class Utils {

    public readonly environmentConfig: EnvironmentConfig;
    public readonly uploadFiles: any

    constructor() {
        this.environmentConfig = environmentConfig
        this.uploadFiles = multer({ storage }).any(); // para un solo archivo
    }


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

    newDate(date?: Date | string): Date {
        return date ? dayjs(date).tz(this.environmentConfig.timeZone).toDate() : dayjs().tz(this.environmentConfig.timeZone).toDate();
    }
}

export { Utils }
