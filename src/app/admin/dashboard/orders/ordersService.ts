import { BaseService } from "../../../utils/baseService";
import { CancelOrderType, IArticleCart, ICartTotals, IOrderDiscountType, IOrder, IOrderStatus, IOrdersSummary, IPaginationResult } from "../../../../../api/src/interfaces";
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
                sent: 0,
                paid: 0,
                partiallyPaid: 0,
                preparingForDelivery: 0,
                earnings: 0,
                totalSold: 0
            }
        }
    }

    private downloadPDF(data: any, filename: string, errorMessage: string): void {
        const base64Data = typeof data === 'object' && data.base64 ? data.base64 : data;
        if (!base64Data || typeof base64Data !== 'string') throw new Error('Datos de PDF inválidos');
        
        const blob = new Blob([new Uint8Array(atob(base64Data).split('').map(c => c.charCodeAt(0)))], { type: 'application/pdf' });
        const link = Object.assign(document.createElement('a'), {
            href: URL.createObjectURL(blob),
            download: filename
        });
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    async printOrder(_id: number): Promise<void> {
        try {
            const { data: { data } } = await adminAxios.get(`/admin/private/orders/print/${_id}`);
            this.downloadPDF(data, `Factura-${_id}.pdf`, "Ha ocurrido un error al imprimir la orden.");
        } catch (error: any) {
            eventBus.emit("notify", { message: "Ha ocurrido un error al imprimir la orden.", open: true, type: "error", title: "Upss!" });
        }
    }

    async printOrderLabel(_id: number): Promise<void> {
        try {
            const { data: { data } } = await adminAxios.get(`/admin/private/orders/print-label/${_id}`);
            this.downloadPDF(data, `Label-${_id}.pdf`, "Ha ocurrido un error al imprimir la etiqueta.");
        } catch (error: any) {
            eventBus.emit("notify", { message: "Ha ocurrido un error al imprimir la etiqueta.", open: true, type: "error", title: "Upss!" });
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
            const itemSubTotal = article.variant.sellingPrice * article.variant.stock;
            subTotal += itemSubTotal;
            
            if (article.orderDiscount) {
                const itemDiscount = article.orderDiscount.type === IOrderDiscountType.PERCENT 
                    ? (itemSubTotal * article.orderDiscount.value / 100)
                    : article.orderDiscount.value;
                discount += itemDiscount;
                total += itemSubTotal - itemDiscount;
            } else {
                total += itemSubTotal;
            }
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



        if (!order.articles || order?.articles?.length === 0) {
            throw new Error("La orden debe tener al menos un artículo.")
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
            const { data } = await this.axiosAdmin.put(`/admin/private/orders/status/${orderId}`, { status });
            eventBus.emit("notify", { message: "Estado de la orden actualizado de forma exitosa.", open: true, type: "success", title: "Guardado!" })
            return data.data as IOrder
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Ha ocurrido un error al actualizar el estado de la orden."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

    async bulkUpdateOrderStatus({ orderIds, status }: { orderIds: number[], status: IOrderStatus }): Promise<void> {
        try {
            await this.axiosAdmin.put(`/admin/private/orders/bulk-status`, { orderIds, status });
            eventBus.emit("notify", { message: `${orderIds.length} órdenes actualizadas a ${status}.`, open: true, type: "success", title: "Actualizado!" })
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Ha ocurrido un error al actualizar las órdenes."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

    async updateComment({ orderId, comment }: { orderId: number, comment: string }): Promise<IOrder> {
        try {
            const { data } = await this.axiosAdmin.put(`/admin/private/orders/${orderId}/comment`, { comment });
            eventBus.emit("notify", { message: "Comentario actualizado exitosamente", open: true, type: "success", title: "Éxito!" })
            return data.data as IOrder
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Error al actualizar comentario"
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

    async addPayment({ orderId, payment }: { orderId: number, payment: any }): Promise<IOrder> {
        try {
            const { data } = await this.axiosAdmin.post(`/admin/private/orders/${orderId}/payments`, payment);
            eventBus.emit("notify", { message: "Pago registrado exitosamente", open: true, type: "success", title: "Éxito!" })
            return data.data as IOrder
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Error al registrar pago"
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

}

export const ordersService = new OrdersService()


