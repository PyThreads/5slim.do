import { COLLNAMES, IAdmin, IArticle, IArticleCart, IArticlesSummary, IClient, IOrderStatus, IPaginateArticles, IPaginationResult } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { ArticlesIndex } from "./articlesIndex";

class ArticleService extends BaseService {

    public readonly collection: Document | any
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.ARTICLES });
        new ArticlesIndex({ mongoDatabase, tableName: COLLNAMES.ARTICLES });
    }


    async articlesSummary(): Promise<IArticlesSummary> {

        try {

            const pipeline = [
                {
                    $facet: {
                        total: [
                            {
                                $count: "total"
                            }
                        ],
                        outOfStock: [
                            {
                                $match: {
                                    $or: [
                                        { variants: { $exists: false } },
                                        { variants: { $size: 0 } },
                                        {
                                            variants: {
                                                $not: { $elemMatch: { stock: { $gt: 0 } } }
                                            }
                                        }
                                    ]
                                }
                            },
                            { $count: "count" }
                        ]
                    }
                }
            ]

            const resultUpdated: IArticlesSummary = {
                total: 0,
                outOfStock: 0,
                soldToday: 0
            }

            const soldToday = await this.mongoDatabase.collection(COLLNAMES.ORDER).aggregate([
                {
                    $match: {
                        createdDate: {
                            $gte: this.utils.dayjs().startOf("day").toDate(),
                            $lt: this.utils.dayjs().endOf("day").toDate()
                        },
                        status: {$ne: IOrderStatus.CANCELLED}
                    }
                },
                { $unwind: "$articles" },
                {
                    $group: {
                        _id: "$articles._id"
                    }
                }
            ]).toArray();

            if (soldToday.length > 0) {
                resultUpdated.soldToday = soldToday.length;
            }

            const result = await this.collection.aggregate(pipeline).toArray();

            if (result.length > 0) {
                resultUpdated.total = result[0]?.total.length > 0 ? result[0].total[0]?.total || 0 : result[0].total;
                resultUpdated.outOfStock = result[0]?.outOfStock.length > 0 ? result[0].outOfStock[0]?.count || 0 : result[0].outOfStock;
            }

            return resultUpdated

        } catch (error) {
            throw error
        }

    }


    async unsetToOrder({ articles }: { articles: IArticleCart[] }): Promise<void> {
        try {

            let message = "";

            let arrPromises = [];

            for (const article of articles) {

                const isValid = await this.collection.count(
                    {
                        _id: article._id,
                        variants: {
                            $elemMatch: {
                                _id: article.variant._id,
                                stock: { $gte: article.variant.stock }
                            }
                        }
                    }
                );

                if (isValid === 0) {
                    message = `El artículo ${article.description} no tiene stock suficiente para la cantidad solicitada.`
                    throw new Error(message);
                }

                if (isValid > 0) {
                    arrPromises.push(await this.collection.updateOne(
                        {
                            _id: article._id,
                            variants: {
                                $elemMatch: {
                                    _id: article.variant._id,
                                    stock: { $gte: article.variant.stock }
                                }
                            }
                        },
                        {
                            $inc: {
                                "variants.$[variant].stock": -article.variant.stock
                            }
                        },
                        {
                            arrayFilters: [
                                { "variant._id": article.variant._id }
                            ]
                        }
                    ))
                }

            }

            await Promise.all(arrPromises);

        } catch (error: any) {
            throw error;
        }
    }

    async setToOrder({ articles }: { articles: IArticleCart[] }): Promise<void> {
        try {
            let arrPromises = [];

            for (const article of articles) {

                const exists = await this.collection.count(
                    {
                        "variants._id": article.variant._id
                    }
                );

                if (exists > 0) {

                    arrPromises.push(await this.collection.updateOne(
                        {
                            _id: article._id,
                            variants: {
                                $elemMatch: {
                                    _id: article.variant._id
                                }
                            }
                        },
                        {
                            $inc: {
                                "variants.$[variant].stock": +article.variant.stock
                            }
                        },
                        {
                            arrayFilters: [
                                { "variant._id": article.variant._id }
                            ]
                        }
                    ))
                } else {

                    arrPromises.push(await this.collection.updateOne(
                        { _id: article._id },
                        {
                            $push: {
                                variants: {
                                    _id: article.variant._id,
                                    stock: article.variant.stock,
                                    sellingPrice: article.variant.sellingPrice,
                                    costPrice: article.variant.costPrice,
                                    images: article.variant.images,
                                    status: article.variant.status
                                }
                            }
                        }
                    ))
                }

            }

            await Promise.all(arrPromises);

        } catch (error: any) {
            throw error;
        }
    }


    async register({ body, user }: { body: IArticle, user: IClient | IAdmin }): Promise<IArticle> {
        try {

            body.slug = await this.getArticleSlug(body.description);

            const result = await this.insertOne({ body, user });
            return result

        } catch (error: any) {
            throw error;
        }
    }

    async getArticleSlug(description: string): Promise<string> {
        try {
            let count = 1;
            let slugNumber = 0;
            let slug = "";

            const baseSlug = description.toLowerCase().trim().replace(/ +/g, '-');

            while (count > 0) {
                slug = slugNumber === 0 ? baseSlug : `${baseSlug}-${slugNumber}`;
                count = await this.collection.countDocuments({ slug });

                if (count > 0) {
                    slugNumber += 1;
                }
            }

            return slug;

        } catch (error) {
            throw new Error("No se pudo generar el slug");
        }
    }

    async updateArticle({ _id, user, body }: { _id: number, body: IClient, user: IClient | IAdmin }) {
        try {

            const filter = { _id }
            await this.updateOne({ filter, body, user });
            return body
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * 
     * @param query: IPaginateArticles    
     * @returns 
     */
    async getArticles({ query }: { query: any }): Promise<IPaginationResult> {
        try {

            const { page, limit, slug, _id, description, published, hasStock } = query;
            const match: Record<string, any> = {};

            const aggregate = [
                {
                    $match: match
                }
            ];

            if (_id) {
                match["_id"] = _id
            }

            if (description) {
                match["description"] = { $regex: this.diacriticSensitive(description), $options: "i" };
            }

            if (slug) {
                match["slug"] = slug;
            }

            if (published !== undefined) {
                match["published"] = published === 'true';
            }

            if (hasStock !== undefined) {
                if (hasStock === 'true' || hasStock === true) {
                    match["variants"] = { $elemMatch: { stock: { $gt: 0 }, available: { $ne: false } } };
                } else if (hasStock === 'false' || hasStock === false) {
                    match["$or"] = [
                        { variants: { $exists: false } },
                        { variants: { $size: 0 } },
                        {
                            variants: {
                                $not: { $elemMatch: { stock: { $gt: 0 }, available: { $ne: false } } }
                            }
                        }
                    ];
                }
            }

            return await this.paginate({
                query: aggregate, page: page ? page : 1, limit: limit ? limit : 10, collection: COLLNAMES.ARTICLES, sort: {
                    _id: -1
                }
            });

        } catch (error: any) {
            throw error;
        }
    }

}

export { ArticleService } 