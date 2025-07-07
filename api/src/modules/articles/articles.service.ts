import { COLLNAMES, IAdmin, IArticle, IArticleCart, IClient, IPaginateArticles, IPaginationResult } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { ArticlesIndex } from "./articlesIndex";

class ArticleService extends BaseService {

    public readonly collection: Document | any
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.ARTICLES });
        new ArticlesIndex({ mongoDatabase, tableName: COLLNAMES.ARTICLES });
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

    async register({ body, user }: { body: IArticle, user: IClient | IAdmin }): Promise<IArticle> {
        try {

            body.slug = await this.getArticleSlug(body.description);

            await this.insertOne({ body, user });
            return body

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
    async getArticles({ query }: { query: IPaginateArticles }): Promise<IPaginationResult> {
        try {

            const { page, limit, slug, _id, description } = query;
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

            return await this.paginate({ query: aggregate, page: page ? page : 1, limit: limit ? limit : 10, collection: COLLNAMES.ARTICLES });

        } catch (error: any) {
            throw error;
        }
    }

}

export { ArticleService } 