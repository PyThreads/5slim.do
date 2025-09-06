import { BaseService } from "../../../utils/baseService";
import adminAxios from "../../../../context/adminAxiosInstance";
import { IClient, IPaginationResult } from "../../../../api/src/interfaces";
import { eventBus } from "../../../utils/broadcaster";

class UserService extends BaseService {
    constructor() {
        super()
    }

    async getAllClientsSummary(): Promise<number> {
        try {
            const { data: { data } }: any = await adminAxios.get("/admin/private/clients/summary")
            return data as unknown as number
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al el resumen de los clientes."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return 0
        }
    }

    async getAllClients(query: any): Promise<IPaginationResult> {
        try {
            const params = this.transformQuery(query)
            const { data: { data } }: any = await adminAxios.get("/admin/private/clients" + params)
            return data as unknown as IPaginationResult
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al obtener los clientes."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return {
                totalPages: 0,
                list: [],
                currentPage: 1,
                totalItems: 0
            }
        }
    }

    async getClientDetails(query: any): Promise<IClient | null> {
        try {
            const params = this.transformQuery(query)
            const { data: { data } }: { data: { data: IPaginationResult } } = await adminAxios.get("/admin/private/clients" + params)
            return data.list[0] as unknown as IClient

        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al obtener el cliente."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return null
        }
    }
}

export const userService = new UserService()


