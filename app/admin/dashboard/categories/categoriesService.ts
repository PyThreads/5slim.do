import { BaseService } from "../../../utils/baseService";
import { ICategory, IPaginationResult } from "../../../../../api/src/interfaces";
import { eventBus } from "../../../utils/broadcaster";

class CategoriesService extends BaseService {

    constructor() {
        super()
    }

    async getAllCategories(query: any): Promise<IPaginationResult> {
        try {
            const params = this.transformQuery(query)
            const { data: { data } }: any = await this.axiosAdmin.get("/admin/private/categories" + params)
            return data as unknown as IPaginationResult
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al obtener las categorías."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return {
                totalPages: 0,
                list: [],
                currentPage: 1,
                totalItems: 0
            }
        }
    }

    async createCategory(category: ICategory): Promise<ICategory> {
        try {
            const { data } = await this.axiosAdmin.post("/admin/private/categories/create", category);
            eventBus.emit("notify", { message: "Categoría creada exitosamente.", open: true, type: "success", title: "Guardado!" })
            return data.data as ICategory
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al crear la categoría."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

    async updateCategory(_id: number, category: ICategory): Promise<ICategory> {
        try {
            const { data } = await this.axiosAdmin.put(`/admin/private/categories/${_id}`, category);
            eventBus.emit("notify", { message: "Categoría actualizada exitosamente.", open: true, type: "success", title: "Guardado!" })
            return data.data as ICategory
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al actualizar la categoría."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }
}

export const categoriesService = new CategoriesService()