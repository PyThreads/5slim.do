import { COLLNAMES, IAdmin, IArticle, IArticleCart, IArticlesSummary, IClient, IOrderStatus, IPaginateArticles, IPaginationResult, IArticlesVariants } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { ArticlesIndex } from "./articlesIndex";

class ArticleService extends BaseService {

    public readonly collection: Document | any
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.ARTICLES });
        new ArticlesIndex({ mongoDatabase, tableName: COLLNAMES.ARTICLES });
    }


    async articlesSummary(ownerId?: number): Promise<IArticlesSummary> {

        try {
            const matchStage = ownerId ? { ownerId } : {};

            const pipeline = [
                {
                    $match: matchStage
                },
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
                        ],
                        lowStockAlert: [
                            {
                                $addFields: {
                                    totalStock: {
                                        $sum: {
                                            $map: {
                                                input: "$variants",
                                                as: "variant",
                                                in: {
                                                    $cond: {
                                                        if: { $and: [{ $gt: ["$$variant.stock", 0] }, { $eq: ["$$variant.available", "Disponible"] }] },
                                                        then: "$$variant.stock",
                                                        else: 0
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $gt: ["$totalStock", 0] },
                                            { $lte: ["$totalStock", { $ifNull: ["$stockAlert", 0] }] },
                                            { $gt: [{ $ifNull: ["$stockAlert", 0] }, 0] }
                                        ]
                                    }
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
                soldToday: 0,
                lowStockAlert: 0
            }

            const orderMatch: any = {
                createdDate: {
                 $gte: this.utils.getDayBound("startDay", this.utils.newDate()),
                 $lte: this.utils.getDayBound("endDay", this.utils.newDate())
                }
            };
            if (ownerId) orderMatch.ownerId = ownerId;

            const soldToday = await this.mongoDatabase.collection(COLLNAMES.ORDER).aggregate([
                {
                    $match: {
                        ...orderMatch,
                        createdDate: {
                            $gte: this.utils.getDayBound("startDay", this.utils.newDate()),
                            $lte: this.utils.getDayBound("endDay", this.utils.newDate())
                        }
                    }
                },
                { $unwind: "$articles" },
                {
                    $group: {
                        _id: {
                            articleId: "$articles._id",
                            variantId: "$articles.variant._id"
                        },
                        totalSold: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalQuantity: { $sum: "$totalSold" }
                    }
                }
            ]).toArray();

            if (soldToday.length > 0 && soldToday[0].totalQuantity) {
                resultUpdated.soldToday = soldToday[0].totalQuantity;
            }

            const result = await this.collection.aggregate(pipeline).toArray();

            if (result.length > 0) {
                resultUpdated.total = result[0]?.total.length > 0 ? result[0].total[0]?.total || 0 : result[0].total;
                resultUpdated.outOfStock = result[0]?.outOfStock.length > 0 ? result[0].outOfStock[0]?.count || 0 : result[0].outOfStock;
                resultUpdated.lowStockAlert = result[0]?.lowStockAlert.length > 0 ? result[0].lowStockAlert[0]?.count || 0 : result[0].lowStockAlert;
            }

            return resultUpdated

        } catch (error) {
            throw error
        }

    }


    async unsetToOrder({ articles,ownerId }: { articles: IArticleCart[],ownerId: number }): Promise<void> {
        try {

            let message = "";

            let arrPromises = [];

            for (const article of articles) {

                const isValid = await this.collection.count(
                    {
                        _id: article._id,
                        ownerId: ownerId,
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
                            ownerId: ownerId,
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

    async setToOrder({ articles, user }: { articles: IArticleCart[], user: IAdmin }): Promise<void> {
        try {
            let arrPromises = [];

            for (const article of articles) {

                const exists = await this.collection.count(
                    {
                        "variants._id": article.variant._id,
                        ownerId: user.ownerId
                    }
                );

                if (exists > 0) {

                    arrPromises.push(await this.collection.updateOne(
                        {
                            _id: article._id,
                            ownerId: user.ownerId,
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
                        {
                            _id: article._id,
                            ownerId: user.ownerId
                        },
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


    async register({ body, user }: { body: IArticle, user: IAdmin }): Promise<IArticle> {
        try {
            // Check external code uniqueness
            if (body.externalCode) {
                const existingArticle = await this.collection.findOne({
                    ownerId: user.ownerId,
                    externalCode: body.externalCode
                });
                if (existingArticle) {
                    throw new Error("El código externo ya existe para otro artículo.");
                }
            } else {
                body.externalCode = null; // Clear external code if not provided
            }

            body.slug = await this.getArticleSlug(body.description);
            const result = await this.insertOne({ body, user });
            
            // Generate and update article search field
            const articleSearch = this.generateArticleSearch({
                description: result.description,
                _id: result._id,
                externalCode: result.externalCode
            });
            
            await this.collection.updateOne(
                { _id: result._id, ownerId: user.ownerId },
                { $set: { articleSearch } }
            );
            
            result.articleSearch = articleSearch;
            return result;

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

    async updateArticle({ _id, user, body }: { _id: number, body: IArticle, user: IAdmin }) {
        try {
            // Check external code uniqueness
            if (body.externalCode) {
                const existingArticle = await this.collection.findOne({
                    ownerId: user.ownerId,
                    externalCode: body.externalCode,
                    _id: { $ne: _id }
                });
                if (existingArticle) {
                    throw new Error("El código externo ya existe para otro artículo.");
                }
            } else {
                body.externalCode = null; // Clear external code if not provided
            }

            // Generate article search field
            const articleSearch = this.generateArticleSearch({
                description: body.description,
                _id: _id,
                externalCode: body.externalCode
            });
            
            body.articleSearch = articleSearch;
            
            const filter = { _id, ownerId: user.ownerId };
            await this.updateOne({ filter, body, user });
            
            return body;
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * 
     * @param query: IPaginateArticles    
     * @returns 
     */
    async addVariant({ articleId, variant, ownerId }: { articleId: number, variant: any, ownerId: number }): Promise<any> {
        try {
            const result = await this.collection.updateOne(
                { _id: articleId, ownerId },
                { $push: { variants: variant } }
            );
            
            if (result.matchedCount === 0) {
                throw new Error("Artículo no encontrado");
            }
            
            return { success: true };
        } catch (error: any) {
            throw error;
        }
    }

    async updateVariant({ articleId, variantId, variant, ownerId }: { articleId: number, variantId: string, variant: any, ownerId: number }): Promise<any> {
        try {
            const result = await this.collection.updateOne(
                { 
                    _id: articleId, 
                    ownerId,
                    "variants._id": variantId 
                },
                { 
                    $set: {
                        "variants.$[variant].costPrice": variant.costPrice,
                        "variants.$[variant].sellingPrice": variant.sellingPrice,
                        "variants.$[variant].status": variant.status,
                        "variants.$[variant].stock": variant.stock,
                        "variants.$[variant].images": variant.images,
                        "variants.$[variant].source": variant.source,
                        "variants.$[variant].available": variant.available,
                        "variants.$[variant].comment": variant.comment,
                        "variants.$[variant].tracking": variant.tracking,
                        "variants.$[variant].size": variant.size
                    }
                },
                {
                    arrayFilters: [{ "variant._id": variantId }]
                }
            );
            
            if (result.matchedCount === 0) {
                throw new Error("Artículo o variante no encontrado");
            }
            
            return { success: true };
        } catch (error: any) {
            throw error;
        }
    }

    async deleteVariant({ articleId, variantId, ownerId }: { articleId: number, variantId: string, ownerId: number }): Promise<void> {
        try {
            const result = await this.collection.updateOne(
                { _id: articleId, ownerId },
                { $pull: { variants: { _id: variantId } } }
            );
            
            if (result.matchedCount === 0) {
                throw new Error("Artículo no encontrado");
            }
        } catch (error: any) {
            throw error;
        }
    }

    async getVariants({ articleId, ownerId }: { articleId: number, ownerId: number }): Promise<IArticlesVariants[]> {
        try {
            const result = await this.collection.findOne(
                { _id: articleId, ownerId },
                { projection: { variants: 1 } }
            );
            
            if (!result) {
                throw new Error("Artículo no encontrado");
            }
            
            return result.variants || [];
        } catch (error: any) {
            throw error;
        }
    }

    async getArticles({ query, ownerId }: { query: any, ownerId?: number }): Promise<IPaginationResult> {
        try {

            const { page, limit, slug, _id, description, published, hasStock, lowStock, hasOrderedVariants, sortByOrders, categories, brand, size } = query;
            const match: Record<string, any> = {};

            if (ownerId) {
                match["ownerId"] = ownerId;
            }

            const aggregate = [
                {
                    $match: match
                }
            ];

            if (_id) {
                match["_id"] = _id
            }

            if (description) {
                match["articleSearch"] = { $regex: this.diacriticSensitive(description), $options: "i" };
            }

            if (slug) {
                match["slug"] = slug;
            }

            if (published !== undefined) {
                match["published"] = published === 'true';
            }

            if (categories && categories.length > 0) {
                const categoryIds = Array.isArray(categories) ? categories : [categories];
                match["categories._id"] = { $in: categoryIds.map((id: string | number) => typeof id === 'string' ? parseInt(id) : id) };
            }

            if (brand) {
                match["brand._id"] = typeof brand === 'string' ? parseInt(brand) : brand;
            }

            if (size) {
                match["variants.size"] = { $regex: this.diacriticSensitive(size), $options: "i" };
            }

            if (hasStock !== undefined) {
                if (hasStock === 'true' || hasStock === true) {
                    match["variants"] = { $elemMatch: { stock: { $gt: 0 }, available: "Disponible" } };
                } else if (hasStock === 'false' || hasStock === false) {
                    match["$or"] = [
                        { variants: { $exists: false } },
                        { variants: { $size: 0 } },
                        {
                            variants: {
                                $not: { $elemMatch: { stock: { $gt: 0 }, available: "Disponible" } }
                            }
                        }
                    ];
                }
            }

            if (lowStock !== undefined && (lowStock === 'true' || lowStock === true)) {
                aggregate.push({
                    $addFields: {
                        totalStock: {
                            $sum: {
                                $map: {
                                    input: "$variants",
                                    as: "variant",
                                    in: {
                                        $cond: {
                                            if: { $and: [{ $gt: ["$$variant.stock", 0] }, { $eq: ["$$variant.available", "Disponible"] }] },
                                            then: "$$variant.stock",
                                            else: 0
                                        }
                                    }
                                }
                            }
                        }
                    }
                } as any);
                aggregate.push({
                    $match: {
                        $expr: {
                            $and: [
                                { $gt: ["$totalStock", 0] },
                                { $lte: ["$totalStock", { $ifNull: ["$stockAlert", 0] }] },
                                { $gt: [{ $ifNull: ["$stockAlert", 0] }, 0] }
                            ]
                        }
                    }
                } as any);
            }

            if (hasOrderedVariants !== undefined && (hasOrderedVariants === 'true' || hasOrderedVariants === true)) {
                match["variants"] = { $elemMatch: { available: "Encargado" } };
            }

            // Add lookup to count total orders for each article
            aggregate.push({
                $lookup: {
                    from: "0RDER",
                    let: { articleId: "$_id" },
                    pipeline: [
                        { $unwind: "$articles" },
                        { $match: { $expr: { $eq: ["$articles._id", "$$articleId"] } } },
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ],
                    as: "orderCount"
                }
            } as any);

            aggregate.push({
                $addFields: {
                    totalOrders: {
                        $ifNull: [{ $arrayElemAt: ["$orderCount.count", 0] }, 0]
                    }
                }
            } as any);

            aggregate.push({
                $project: {
                    orderCount: 0
                }
            } as any);

            // Determine sort order
            let sort: any = { _id: -1 }; // default sort
            if (sortByOrders === 'desc') {
                sort = { totalOrders: -1, _id: -1 }; // most sold first
            } else if (sortByOrders === 'asc') {
                sort = { totalOrders: 1, _id: -1 }; // least sold first
            }

            return await this.paginate({
                query: aggregate, page: page ? page : 1, limit: limit ? limit : 10, collection: COLLNAMES.ARTICLES, sort
            });

        } catch (error: any) {
            throw error;
        }
    }

    async getArticlesForOrders({ query, ownerId }: { query: any, ownerId?: number }): Promise<IPaginationResult> {
        try {
            const { page, limit, articleSearch, categories, brand, size } = query;
            const match: Record<string, any> = {};

            match["ownerId"] = ownerId;

            if (articleSearch) {
                match["articleSearch"] = { $regex: this.diacriticSensitive(articleSearch), $options: "i" };
            }

            if (categories && categories.length > 0) {
                match["categories._id"] = { $in: categories.map((id: string) => parseInt(id)) };
            }

            if (brand) {
                match["brand._id"] = typeof brand === 'string' ? parseInt(brand) : brand;
            }

            const aggregate: any[] = [
                { $match: match },
                { $unwind: "$variants" }
            ];

            // Add size filter after unwind if specified
            if (size) {
                aggregate.push({
                    $match: {
                        "variants.size": { $regex: this.diacriticSensitive(size), $options: "i" }
                    }
                });
            }

            aggregate.push(
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        slug: 1,
                        categories: 1,
                        hasDiscount: 1,
                        discount: 1,
                        published: 1,
                        shortDescription: 1,
                        tipTap: 1,
                        advertisement: 1,
                        images: 1,
                        stockAlert: 1,
                        ownerId: 1,
                        externalCode: 1,
                        articleSearch: 1,
                        variant: "$variants"
                    }
                },
                { $sort: { _id: -1, "variant._id": 1 } }
            );

            return await this.paginate({
                query: aggregate,
                page: page ? page : 1,
                limit: limit ? limit : 10,
                collection: COLLNAMES.ARTICLES
            });

        } catch (error: any) {
            throw error;
        }
    }

    private generateArticleSearch(article: any): string {
        const description = article.description || '';
        const internalCode = article._id || '';
        const externalCode = article.externalCode || '';
        return `${description} ${internalCode} ${externalCode}`.trim();
    }

    async updateArticleSearch({ _id, ownerId }: { _id: number, ownerId: number }): Promise<void> {
        try {
            const article = await this.collection.findOne({ _id, ownerId });
            if (article) {
                const articleSearch = this.generateArticleSearch(article);
                await this.collection.updateOne(
                    { _id, ownerId },
                    { $set: { articleSearch } }
                );
            }
        } catch (error: any) {
            // Silent fail for search field update
        }
    }

}

export { ArticleService } 