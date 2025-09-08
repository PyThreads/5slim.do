import { COLLNAMES, CancelOrderType, IAdmin, IArticleCart, ICartTotals, IClient, IOrderDiscountType, IOrder, IOrderStatus, IOrdersSummary, IPaginateOrders, IPaginationResult, IOrderType, IPaymentStatus, IOrderPayment } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { OrdersIndex } from "./ordersIndex";
import { ArticleService } from "../articles/articles.service";
import { generarFacturaPDF, generarLabelPDF, } from "../../print";
import { invoiceCreated } from "../../print/invoice/invoice.created";
import { invoiceLabel } from "../../print/invoice/invoice.label";
import { invoice72mm } from "../../print/invoice/invoice.72mm";

export class OrderService extends BaseService {

    public readonly collection: Document | any
    private readonly articleService: ArticleService
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.ORDER });
        new OrdersIndex({ mongoDatabase, tableName: COLLNAMES.ORDER });
        this.articleService = new ArticleService({ mongoDatabase });
    }

    async updateOrderStatus(params: { orderId: number, status: IOrderStatus, user: IAdmin }): Promise<IOrder> {
        try {
            const { orderId, status, user } = params;

            if (status === IOrderStatus.CANCELLED) throw new Error("No se puede cambiar al cancelada.")

            const filter = { _id: orderId, ownerId: user.ownerId };
            const body = { status };
            const result = await this.updateOne({ filter, body, user });
            return result
        } catch (error) {
            throw error
        }
    }


    async ordersSummary(params: { from: Date, to: Date,user: IAdmin }): Promise<IOrdersSummary> {
        try {
            const filter: any = {
                createdDate: {
                    $gte: this.utils.getDayBound("startDay", params.from),
                    $lte: this.utils.getDayBound("endDay", params.to)
                },
                ownerId: params.user.ownerId
            };
   
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
                                $count: "total"
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
                                    status: { $ne: IOrderStatus.CANCELLED },
                                    ...filter
                                }
                            },
                            {
                                $unwind: "$articles"
                            },
                            {
                                $addFields: {
                                    itemSubTotal: {
                                        $multiply: [
                                            "$articles.variant.sellingPrice",
                                            "$articles.variant.stock"
                                        ]
                                    },
                                    itemDiscount: {
                                        $cond: {
                                            if: { $ifNull: ["$articles.orderDiscount", false] },
                                            then: {
                                                $cond: {
                                                    if: { $eq: ["$articles.orderDiscount.type", "PERCENT"] },
                                                    then: {
                                                        $multiply: [
                                                            {
                                                                $multiply: [
                                                                    "$articles.variant.sellingPrice",
                                                                    "$articles.variant.stock"
                                                                ]
                                                            },
                                                            { $divide: ["$articles.orderDiscount.value", 100] }
                                                        ]
                                                    },
                                                    else: "$articles.orderDiscount.value"
                                                }
                                            },
                                            else: 0
                                        }
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    finalSellingPrice: {
                                        $subtract: ["$itemSubTotal", "$itemDiscount"]
                                    },
                                    costTotal: {
                                        $multiply: [
                                            "$articles.variant.costPrice",
                                            "$articles.variant.stock"
                                        ]
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    gain: {
                                        $subtract: ["$finalSellingPrice", "$costTotal"]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalEarnings: { $sum: "$gain" }
                                }
                            }
                        ],
                        totalSold: [
                            {
                                $match: {
                                    ...filter,
                                    status: { $ne: IOrderStatus.CANCELLED }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalSold: { $sum: "$total.total" }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    totalSold: 1
                                }
                            }
                        ],
                        paymentStatus: [
                            {
                                $match: filter
                            },
                            {
                                $group: {
                                    _id: "$paymentStatus",
                                    count: { $sum: 1 }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    paymentStatus: "$_id",
                                    count: 1
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
                sent: 0,
                paid: 0,
                partiallyPaid: 0,
                preparingForDelivery: 0,
                earnings: 0,
                totalSold: 0
            }

            const result: any = await this.collection.aggregate(pipeline).toArray();

            if (result.length > 0) {
                const resulted = result[0];                
                baseResult.total = resulted.totalOrders.length > 0 ? resulted.totalOrders[0].total : 0;
                baseResult.pending = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.PENDING)?.count || 0 : 0;
                baseResult.cancelled = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.CANCELLED)?.count || 0 : 0;
                baseResult.delivered = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.DELIVERED)?.count || 0 : 0;
                baseResult.sent = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.SENT)?.count || 0 : 0;
                baseResult.preparingForDelivery = resulted.total.length > 0 ? resulted.total.find((item: any) => item.status === IOrderStatus.PREPARING_FOR_DELIVERY)?.count || 0 : 0;
                baseResult.paid = resulted.paymentStatus.length > 0 ? resulted.paymentStatus.find((item: any) => item.paymentStatus === IPaymentStatus.PAID)?.count || 0 : 0;
                baseResult.partiallyPaid = resulted.paymentStatus.length > 0 ? resulted.paymentStatus.find((item: any) => item.paymentStatus === IPaymentStatus.PARTIALLY_PAID)?.count || 0 : 0;
                baseResult.earnings = resulted.earnings.length > 0 ? resulted.earnings[0]?.totalEarnings || 0 : 0;
                baseResult.totalSold = resulted.totalSold.length > 0 ? resulted.totalSold[0]?.totalSold || 0 : 0;
            }

            return baseResult;

        } catch (error: any) {
            throw error
        }
    }


    async cancelOrder({ orderId, type, user }: { orderId: number, user: IAdmin, type: CancelOrderType }): Promise<IOrder> {
        try {

            const order = await this.collection.findOne({ _id: orderId, ownerId: user.ownerId });
            if (!order) {
                throw new Error("Orden no encontrada");
            }

            await this.updateOne({ filter: { _id: orderId, ownerId: user.ownerId }, body: { status: IOrderStatus.CANCELLED, cancelType: type }, user });

            if (type === CancelOrderType.RETURN_ITEMS) {
                await this.articleService.setToOrder({ articles: order.articles, user });
            }

            return order;

        } catch (error: any) {
            throw error
        }
    }

    async printOrder({ _id,ownerId }: { _id: number,ownerId: number }): Promise<any> {
        try {
            const order = await this.collection.findOne({ _id,ownerId });
            // Obtener el logo del owner
            const owner = await this.mongoDatabase.collection(COLLNAMES.ADMIN).findOne({ _id: ownerId });
            const logo = owner?.logo || 'https://5slim.do/_next/image?url=%2Fflash-lines.png&w=48&q=75';
            const businessName = owner?.businessName;
            const logoDimensions = owner?.logoDimentions || { width: 55, height: 55 };
            const html = await invoiceCreated({ order, logo, businessName, logoDimensions });
            return html;
        } catch (error: any) {
            throw error;
        }
    }

    async printOrderLabel({ _id, ownerId }: { _id: number, ownerId: number }): Promise<any> {
        try {
            const order = await this.collection.findOne({ _id, ownerId });
            // Obtener el logo del owner
            const owner = await this.mongoDatabase.collection(COLLNAMES.ADMIN).findOne({ _id: ownerId });
            const logo = owner?.logo || 'https://5slim.do/_next/image?url=%2Fflash-lines.png&w=48&q=75';
            const logoDimensions = owner?.logoDimentions || { width: 55, height: 55 };
            const html = await invoiceLabel({ order, logo, logoDimensions });
            return html;
        } catch (error: any) {
            throw error;
        }
    }

    async printOrder72mm({ _id, ownerId }: { _id: number, ownerId: number }): Promise<any> {
        try {
            const order = await this.collection.findOne({ _id, ownerId });
            const owner = await this.mongoDatabase.collection(COLLNAMES.ADMIN).findOne({ _id: ownerId });
            const logo = owner?.logo || 'https://5slim.do/_next/image?url=%2Fflash-lines.png&w=48&q=75';
            const businessName = owner?.businessName;
            const logoDimensions = owner?.logoDimentions || { width: 55, height: 55 };
            const html = await invoice72mm({ order, logo, businessName, logoDimensions });
            return html;
        } catch (error: any) {
            throw error;
        }
    }

    async createOrder({ body, user }: { body: IOrder, user: IClient | IAdmin }): Promise<IOrder> {
        try {

            await this.articleService.unsetToOrder({ articles: body.articles, ownerId: user.ownerId });

            body.total = this.getTotalOrder(body.articles);

            // Set default values for new payment system
            if (!body.orderType) {
                body.orderType = body.paymentType ? IOrderType.CASH : IOrderType.CREDIT;
            }
            
            // Todas las órdenes inician sin pagos, deben agregarse manualmente
            body.paymentStatus = IPaymentStatus.NOT_PAID;
            body.payments = [];

            const result = await this.insertOne({ body, user });
            return result as unknown as IOrder;

        } catch (error: any) {
            throw error;
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


    async getAllOrders({ query, ownerId }: { query: IPaginateOrders, ownerId: number }): Promise<IPaginationResult> {
        try {

            const match: any = {
                ownerId
            };

            if (query.fullClient) {
                match["client.fullClient"] = { $regex: this.diacriticSensitive(query.fullClient), $options: "i" };
            }

            if (query.status) {
                match["status"] = query.status;
            }

            if (query.paymentStatus) {
                match["paymentStatus"] = query.paymentStatus;
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

    async updateComment({ orderId, comment, user }: { orderId: number, comment: string, user: IAdmin }): Promise<IOrder> {
        try {
            const filter = { _id: orderId, ownerId: user.ownerId };
            const body = { comment };
            const result = await this.updateOne({ filter, body, user });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    async addPayment({ orderId, payment, user }: { orderId: number, payment: Omit<IOrderPayment, 'createdBy'>, user: IAdmin }): Promise<IOrder> {
        try {
            const order = await this.collection.findOne({ _id: orderId, ownerId: user.ownerId });
            if (!order) {
                throw new Error("Orden no encontrada");
            }

            const newPayment: IOrderPayment = {
                ...payment,
                paymentDate: this.utils.newDate(),
                createdBy: { _id: user._id, fullName: user.fullName }
            };

            const updatedPayments = [...(order.payments || []), newPayment];
            const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
            const orderTotal = order.total.total;

            let paymentStatus: IPaymentStatus;
            if (totalPaid >= orderTotal) {
                paymentStatus = IPaymentStatus.PAID;
            } else if (totalPaid > 0) {
                paymentStatus = IPaymentStatus.PARTIALLY_PAID;
            } else {
                paymentStatus = IPaymentStatus.NOT_PAID;
            }

            const filter = { _id: orderId, ownerId: user.ownerId };
            const body = { 
                payments: updatedPayments,
                paymentStatus
            };
            
            const result = await this.updateOne({ filter, body, user });
            return result;
        } catch (error: any) {
            throw error;
        }
    }


}