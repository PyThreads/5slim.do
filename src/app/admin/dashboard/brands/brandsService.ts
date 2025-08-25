import { BaseService } from "../../../utils/baseService";
import { IBrand, IPaginationResult } from "../../../../../api/src/interfaces";
import { eventBus } from "../../../utils/broadcaster";

class BrandsService extends BaseService {

    constructor() {
        super()
    }

    async getAllBrands(query: any): Promise<IPaginationResult> {
        try {
            const params = this.transformQuery(query)
            const { data: { data } }: any = await this.axiosAdmin.get("/admin/private/brands" + params)
            return data as unknown as IPaginationResult
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al obtener las marcas."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return {
                totalPages: 0,
                list: [],
                currentPage: 1,
                totalItems: 0
            }
        }
    }

    async createBrand(brand: IBrand): Promise<IBrand> {
        try {
            const { data } = await this.axiosAdmin.post("/admin/private/brands/create", brand);
            eventBus.emit("notify", { message: "Marca creada exitosamente.", open: true, type: "success", title: "Guardado!" })
            return data.data as IBrand
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al crear la marca."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

    async updateBrand(_id: number, brand: IBrand): Promise<IBrand> {
        try {
            const { data } = await this.axiosAdmin.put(`/admin/private/brands/${_id}`, brand);
            eventBus.emit("notify", { message: "Marca actualizada exitosamente.", open: true, type: "success", title: "Guardado!" })
            return data.data as IBrand
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al actualizar la marca."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }
}

export const brandsService = new BrandsService()