import { COLLNAMES, CancelOrderType, IAdmin, IArticleCart, ICartTotals, IClient, IOrder, IOrderStatus, IOrdersSummary, IPaginateOrders, IPaginationResult } from "../../interfaces";
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


    async ordersSummary(params: { from: Date, to: Date }): Promise<IOrdersSummary> {
        try {

            const filter = {
                createdDate: {
                    $gte: this.utils.dayjs(params.from).startOf("day").toDate(),
                    $lte: this.utils.dayjs(params.to).endOf("day").toDate()
                }
            }

            const pipeline = [
                {
                    $facet: {

                        total: [
                            {
                                $match: filter
                            },
                            {
                                $group: {
                                    _id: "$status",
                                    count: { $sum: 1 },
                                    total: { $sum: "$total" }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    status: "$_id",
                                    count: 1,
                                    total: 1
                                }
                            }
                        ],
                        totalOrders: [
                            {
                                $match: filter
                            },
                            {
                                $group: {
                                    _id: "_id",
                                    total: { $sum: 1 }
                                }
                            },
                            {
                                $project: {
                                    total: 1
                                }
                            }
                        ],
                        earnings: [
                            {
                                $match: {

                                }
                            },
                            {
                                $match: {
                                    status: { $ne: IOrderStatus.CANCELLED },
                                    ...filter
                                }
                            },
                            {
                                $unwind: "$articles"
                            },
                            {
                                $addFields: {
                                    gain: {
                                        $multiply: [
                                            {
                                                $subtract: [
                                                    "$articles.variant.sellingPrice",
                                                    "$articles.variant.costPrice"
                                                ]
                                            },
                                            "$articles.variant.stock"
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalEarnings: { $sum: "$gain" }
                                }
                            }
                        ]
                    }
                }
            ]

            let baseResult: IOrdersSummary = {
                total: 0,
                pending: 0,
                delivered: 0,
                cancelled: 0,
                paid: 0,
                preparingForDelivery: 0,
                earnings: 0
            }

            const result: any = await this.collection.aggregate(pipeline).toArray();

            if (result.length > 0) {
                const resulted = result[0];
                baseResult.total = resulted.totalOrders.length > 0 ? resulted.totalOrders[0].total : 0;
                baseResult.pending = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.PENDING)?.count || 0 : 0;
                baseResult.cancelled = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.CANCELLED)?.count || 0 : 0;
                baseResult.delivered = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.DELIVERED)?.count || 0 : 0;
                baseResult.preparingForDelivery = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.PREPARING_FOR_DELIVERY)?.count || 0 : 0;
                baseResult.paid = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.PAID)?.count || 0 : 0;
                baseResult.earnings = resulted.earnings.length > 0 ? resulted.earnings[0]?.totalEarnings || 0 : 0
            }

            return baseResult;

        } catch (error: any) {
            throw error
        }
    }


    async cancelOrder({ orderId, type, user }: { orderId: number, user: IAdmin | IClient, type: CancelOrderType }): Promise<IOrder> {
        try {

            const updated: IOrder = await this.updateOne({ filter: { _id: orderId }, body: { status: IOrderStatus.CANCELLED, cancelType: type }, user });

            if (type === CancelOrderType.RETURN_ITEMS) {
                await this.articleService.setToOrder({ articles: updated.articles });
            }

            return updated;

        } catch (error: any) {
            throw error
        }
    }

    async printOrder({ _id }: { _id: number }): Promise<any> {
        try {
            const order = await this.collection.findOne({ _id });
            const html = invoiceCreated({ order });
            return await generarFacturaPDF({ html });
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


    async getAllOrders({ query }: { query: IPaginateOrders }): Promise<IPaginationResult> {
        try {

            const match: any = {};

            if (query.fullClient) {
                match["client.fullClient"] = { $regex: this.diacriticSensitive(query.fullClient), $options: "i" };
            }

            if (query.status) {
                match["status"] = query.status;
            }

            if (query._id) {
                match["_id"] = query._id;
            }

            const pipeline = [
                {
                    $match: match
                }
            ]

            const result = await this.paginate({
                query: pipeline,
                page: query.page ? query.page : 1,
                limit: query.limit ? query.limit : 10,
                collection: COLLNAMES.ORDER,
                sort: {
                    createdDate: -1
                }
            })


            return result

        } catch (error: any) {
            throw new Error("Ha ocurrido un error al buscar las ordenes.");
        }
    }
}