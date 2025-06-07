import { BaseService } from "../../../utils/baseService";
import adminAxios from "../../../../../context/adminAxiosInstance";
import { IPaginationResult } from "../../../../../api/src/interfaces";
import { eventBus } from "../../../utils/broadcaster";

class UserService extends BaseService {
    constructor() {
        super()
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
}

export const userService = new UserService()


