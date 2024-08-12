import axiosInstance from "../../context/axiosInstance";
import { IOrder } from "../../interfaces";
import { BaseService } from "./base.service";

class OrderService extends BaseService {
    constructor() {
        super()
    }

    async newOrder() {
        const { data } = await axiosInstance.post("/order/private");
        return {
            data: data.data as IOrder[],
            message: data.message as string,
        };
    }

    async myOrders() {
        const { data } = await axiosInstance.get("/order/private/myOrders");
        return {
            data: data.data as IOrder[],
            message: data.message as string,
        };
    }

    async allOrders() {
        const { data } = await axiosInstance.get("/order/public/allOrders");
        return {
            data: data.data as IOrder[],
            message: data.message as string,
        };
    }

    async getOrder({ orderId }: { orderId: number }) {
        const { data } = await axiosInstance.get(`/order/private/orderDetail/${orderId}`);
        return {
            data: data.data as IOrder,
            message: data.message as string,
        };
    }


}


const orderService: OrderService = new OrderService();

export { orderService }
