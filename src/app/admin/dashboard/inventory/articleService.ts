import { BaseService } from "../../../utils/baseService";
import adminAxios from "../../../../../context/adminAxiosInstance";
import { IArticle, IArticlesSummary, IPaginationResult, IArticlesVariants } from "../../../../../api/src/interfaces";
import { eventBus } from "../../../utils/broadcaster";

class ArticleService extends BaseService {
    constructor() {
        super()
    }

    async summaryArticles(): Promise<IArticlesSummary> {
            try {
                const { data: { data } }: any = await adminAxios.get("/admin/private/articles/summary")
                return data as unknown as IArticlesSummary
            } catch (error: any) {
                const message = error?.response?.data?.message || "Ha ocurrido un error al obtener el resumen de artículos."
                eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
                return {
                    total: 0,
                    outOfStock: 0,
                    soldToday: 0,
                    lowStockAlert: 0
                }
            }
    }

    async getAllArticles(query: any): Promise<IPaginationResult> {
        try {
            const params = this.transformQuery(query)
            const { data: { data } }: any = await adminAxios.get("/admin/private/articles" + params)
            return data as unknown as IPaginationResult
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al obtener los artículos."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return {
                totalPages: 0,
                list: [],
                currentPage: 1,
                totalItems: 0
            }
        }
    }

    async getArticleDetails(query: any): Promise<IArticle | null> {
        try {
            const params = this.transformQuery(query)
            const { data: { data } }: { data: { data: IPaginationResult } } = await adminAxios.get("/admin/private/articles" + params)
            return data.list[0] as unknown as IArticle

        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al obtener el artículo."
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" })
            return null
        }
    }

    getStockNumber(article: IArticle): number {
        let stockNumber = 0
        article.variants.forEach(variants => {
            if (variants.available === "Disponible" && variants.stock > 0) {
                stockNumber += variants.stock
            }
        })
        return stockNumber
    }

    getOrderedStockNumber(article: IArticle): number {
        let orderedStock = 0
        article.variants.forEach(variants => {
            if (variants.available === "Encargado" && variants.stock > 0) {
                orderedStock += variants.stock
            }
        })
        return orderedStock
    }

    isLowStock(article: IArticle): boolean {
        // Calculate total available stock (same logic as backend)
        const totalStock = article.variants.reduce((sum, variant) => {
            if (variant.stock > 0 && variant.available === "Disponible") {
                return sum + variant.stock
            }
            return sum
        }, 0)
        
        const stockAlert = article.stockAlert || 0
        
        // Same logic as backend: totalStock > 0 && totalStock <= stockAlert && stockAlert > 0
        return totalStock > 0 && totalStock <= stockAlert && stockAlert > 0
    }

    async addVariant(articleId: number, variant: any): Promise<any> {
        try {
            const { data } = await adminAxios.post(`/admin/private/articles/${articleId}/variants`, variant)
            eventBus.emit("notify", { message: "Variante agregada exitosamente", open: true, type: "success", title: "Éxito!" })
            return data.data
        } catch (error: any) {
            const message = error?.response?.data?.message || "Error al agregar variante"
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

    async updateVariant(articleId: number, variantId: string, variant: any): Promise<any> {
        try {
            const { data } = await adminAxios.put(`/admin/private/articles/${articleId}/variants/${variantId}`, variant)
            eventBus.emit("notify", { message: "Variante actualizada exitosamente", open: true, type: "success", title: "Éxito!" })
            return data.data
        } catch (error: any) {
            const message = error?.response?.data?.message || "Error al actualizar variante"
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

    async deleteVariant(articleId: number, variantId: string): Promise<void> {
        try {
            await adminAxios.delete(`/admin/private/articles/${articleId}/variants/${variantId}`)
            eventBus.emit("notify", { message: "Variante eliminada exitosamente", open: true, type: "success", title: "Éxito!" })
        } catch (error: any) {
            const message = error?.response?.data?.message || "Error al eliminar variante"
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }

    async getVariants(articleId: number): Promise<IArticlesVariants[]> {
        try {
            const { data } = await adminAxios.get(`/admin/private/articles/${articleId}/variants`)
            return data.data
        } catch (error: any) {
            const message = error?.response?.data?.message || "Error al obtener variantes"
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
            throw error
        }
    }
}

export const articleService = new ArticleService()


