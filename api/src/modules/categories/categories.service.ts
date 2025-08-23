import { COLLNAMES, IAdmin, ICategory, IPaginateCategories, IPaginationResult } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";

class CategoriesService extends BaseService {

    public readonly collection: Document | any
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.CATEGORIES });
    }

    async createCategory({ body, user }: { body: ICategory, user: IAdmin }): Promise<ICategory> {
        try {
            body.slug = this.generateSlug(body.description);
            await this.insertOne({ body, user });
            return body;
        } catch (error: any) {
            throw error;
        }
    }

    async updateCategory({ _id, user, body }: { _id: number, body: ICategory, user: IAdmin }): Promise<ICategory> {
        try {
            body.slug = this.generateSlug(body.description);
            const filter = { _id, ownerId: user.ownerId };
            await this.updateOne({ filter, body, user });
            return body;
        } catch (error: any) {
            throw error;
        }
    }

    async getAllCategories({ query, ownerId }: { query: IPaginateCategories, ownerId: number }): Promise<IPaginationResult> {
        try {
            const { page, limit, description, _id } = query;
            const match: Record<string, any> = { ownerId }; 

            if (_id) {
                match["_id"] = _id;
            }

            if (description) {
                match["description"] = { $regex: this.diacriticSensitive(description), $options: "i" };
            }

            const aggregate = [
                { $match: match },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        slug: 1,
                        createdDate: 1,
                        updatedDate: 1
                    }
                }
            ];

            return await this.paginate({
                query: aggregate,
                page: page || 1,
                limit: limit || 10,
                collection: COLLNAMES.CATEGORIES,
                sort: { _id: -1 }
            });

        } catch (error: any) {
            throw error;
        }
    }

    private generateSlug(description: string): string {
        return description
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

export { CategoriesService }