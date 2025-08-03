import { BaseService } from "../../../utils/baseService";
import { CancelOrderType, IArticleCart, ICartTotals, IOrder, IOrderStatus, IOrdersSummary, IPaginationResult, IPaymentType } from "../../../../../api/src/interfaces";
import { eventBus } from "../../../utils/broadcaster";
import adminAxios from "../../../../../context/adminAxiosInstance";




class OrdersService extends BaseService {

    constructor() {
        super()
    }


    /**
     * 
     * @param filter {{from: Date, to: Date}}
     * @returns 
     */
    async ordersSummary(query: { from: Date, to: Date }): Promise<IOrdersSummary> {
        try {

            const params = this.transformQuery(query)
            const { data: { data } }: any = await adminAxios.get("/admin/private/orders/summary" + params)
            return data as unknown as IOrdersSummary

        } catch (error: any) {

            const message = "Ha ocurrido un error al obtener el resumen de las ordenes."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return {
                total: 0,
                pending: 0,
                delivered: 0,
                cancelled: 0,
                paid: 0,
                preparingForDelivery: 0,
                earnings: 0,
                totalSold: 0
            }
        }
    }

    async printOrder(_id: number): Promise<void> {
        try {
            const { data: { data } }: any = await adminAxios.get("/admin/private/orders/print/" + _id)
            const byteCharacters = atob(data);
            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } catch (error: any) {
            const message = "Ha ocurrido un error al imprimir la orden."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
        }
    }

    async getAllOrders(query: any): Promise<IPaginationResult> {
        try {
            const params = this.transformQuery(query)
            const { data: { data } }: any = await adminAxios.get("/admin/private/orders" + params)
            return data as unknown as IPaginationResult
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al obtener la orden."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return {
                totalPages: 0,
                list: [],
                currentPage: 1,
                totalItems: 0
            }
        }
    }

    async getOrderDetails(query: any): Promise<IOrder | null> {
        try {

            const params = this.transformQuery(query)
            const { data: { data } }: { data: { data: IPaginationResult } } = await adminAxios.get("/admin/private/orders" + params)
            return data.list[0] as unknown as IOrder

        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al obtener los detalles de la orden."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return null
        }
    }

    getTotalOrder(articles: IArticleCart[]): ICartTotals {
        let total = 0;
        let discount = 0;
        let subTotal = 0;

        for (const article of articles) {
            total += article.variant.sellingPrice * article.variant.stock;
            subTotal += article.variant.sellingPrice * article.variant.stock;
        }

        return { total, discount, subTotal }
    }

    async createOrder(order: IOrder): Promise<IOrder> {
        try {

            this.validateNewOrder(order);
            const { data } = await this.axiosAdmin.post("/admin/private/orders/create", order);
            eventBus.emit("notify", { message: "Orden creada de forma exitosa.", open: true, type: "success", title: "Guardado!" })
            return data.data as unknown as IOrder
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Ha ocurrido un error al crear la orden."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

    validateNewOrder(order: IOrder) {
        if (!order.client || !order.client._id) {
            throw new Error("La orden debe tener un cliente.")
        }

        if (!order.paymentType) {
            throw new Error("La orden debe tener un tipo de pago.")
        }

        if (!order.articles || order?.articles?.length === 0) {
            throw new Error("La orden debe tener al menos un artículo.")
        }

        if (!order?.client?.address) {
            throw new Error("Por favor agregar una dirección al cliente.")
        }
    }

    async cancelOrder({ orderId, type }: { orderId: number, type: CancelOrderType }): Promise<IOrder> {
        try {
            const { data } = await this.axiosAdmin.put(`/admin/private/orders/cancel/${orderId}`, { type });
            return data.data as IOrder
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Ha ocurrido un error al cancelar la orden."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }

    }

    async updateOrderStatus({ orderId, status }: { orderId: number, status: IOrderStatus }): Promise<IOrder> {
        try {
            const { data } = await this.axiosAdmin.put(`/admin/private/orders/status/${orderId}`, { status });4
            eventBus.emit("notify", { message: "Estado de la orden actualizado de forma exitosa.", open: true, type: "success", title: "Guardado!" })
            return data.data as IOrder
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Ha ocurrido un error al actualizar el estado de la orden."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

}

export const ordersService = new OrdersService()


