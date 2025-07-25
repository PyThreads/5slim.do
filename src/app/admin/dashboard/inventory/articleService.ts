import { BaseService } from "../../../utils/baseService";
import adminAxios from "../../../../../context/adminAxiosInstance";
import { IArticle, IArticlesSummary, IPaginationResult } from "../../../../../api/src/interfaces";
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
                    soldToday: 0
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
            stockNumber += variants.stock
        })
        return stockNumber
    }
}

export const articleService = new ArticleService()


