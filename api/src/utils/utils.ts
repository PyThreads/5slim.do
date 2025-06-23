import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { EnvironmentConfig, environmentConfig } from "../config";
import multer from 'multer';

dayjs.extend(utc);
dayjs.extend(timezone);
const storage = multer.memoryStorage();


class Utils {

    public readonly environmentConfig: EnvironmentConfig;
    public readonly uploadFiles: any

    constructor(){
        this.environmentConfig = environmentConfig
        this.uploadFiles = multer({ storage }).any(); // para un solo archivo
    }


    newDate(date?: Date | string): Date {
        return date ? dayjs(date).tz(this.environmentConfig.timeZone).toDate() : dayjs().tz(this.environmentConfig.timeZone).toDate();
    }
} 

export {Utils}
