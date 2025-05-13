import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { EnvironmentConfig, environmentConfig } from "../config";

dayjs.extend(utc);
dayjs.extend(timezone);



class Utils {

    public readonly environmentConfig: EnvironmentConfig;

    constructor(){
        this.environmentConfig = environmentConfig
    }


    newDate(date?: Date | string): Date {
        return date ? dayjs(date).tz(this.environmentConfig.timeZone).toDate() : dayjs().tz(this.environmentConfig.timeZone).toDate();
    }

} 

export {Utils}
