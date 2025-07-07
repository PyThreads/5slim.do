import { COLLNAMES, IAdmin, IArticleCart, ICartTotals, IClient, IOrder, IPaginateOrders, IPaginationResult } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { OrdersIndex } from "./ordersIndex";
import { ArticleService } from "../articles/articles.service";
import { generarFacturaPDF } from "../../print";
import { invoiceCreated } from "../../print/invoice/invoice.created";

export class OrderService extends BaseService {

    public readonly collection: Document | any
    private readonly articleService: ArticleService
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.ORDER });
        new OrdersIndex({ mongoDatabase, tableName: COLLNAMES.ORDER });
        this.articleService = new ArticleService({ mongoDatabase });
    }


    async printOrder({ _id }: { _id: number }): Promise<any> {
        try {
            const order = await this.collection.findOne({ _id });
            const html = invoiceCreated({ order });
            return await generarFacturaPDF({html});
        } catch (error: any) {
            throw error;
        }
    }

    async createOrder({ body, user }: { body: IOrder, user: IClient | IAdmin }): Promise<IOrder> {
        try {

            await this.articleService.unsetToOrder({ articles: body.articles });
            
            body.total = this.getTotalOrder(body.articles);

            await this.insertOne({ body, user });
            return body;
            
        } catch (error: any) {
            throw error;
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


    async getAllOrders({query}: {query: IPaginateOrders}): Promise<IPaginationResult> {
        try {

            const match: any = {};

            if(query.fullClient) {
                match["client.fullClient"] = { $regex: this.diacriticSensitive(query.fullClient), $options: "i" };
            }

            if(query.status) {
                match["status"] = query.status;
            }

            if(query._id) {
                match["_id"] = query._id;
            }

            const pipeline =[
                {
                    $match: match
                }
            ]

            const result = await this.paginate({
                query: pipeline,
                page: query.page ? query.page : 1,
                limit: query.limit ? query.limit : 10,
                collection: COLLNAMES.ORDER
            })


            return result
            
        } catch (error: any) {
            throw new Error("Ha ocurrido un error al buscar las ordenes.");
        }
    }

}
