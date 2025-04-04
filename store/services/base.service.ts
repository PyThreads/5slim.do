import axiosInstance from "../../context/axiosInstance";
import { IOrder } from "../../interfaces";

class BaseService {
    constructor() {

    }

    formatDate(string: string | number | Date) {

        const date = new Date(string);

        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

    }

}

export { BaseService }
