import { COLLNAMES, IAdmin, IBrand, IPaginateBrands, IPaginationResult } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { BrandsIndex } from "./brandsIndex";

class BrandService extends BaseService {

    public readonly collection: Document | any
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.BRANDS });
        new BrandsIndex({ mongoDatabase, tableName: COLLNAMES.BRANDS });
    }

    async getPublicBrands(): Promise<IBrand[]> {
        try {
            const pipeline = [
                {
                     $match: { ownerId: this.environmentConfig.storeOwner }
                },
                { $sample: { size: 8 } },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        slug: 1,
                        icon: 1
                    }
                }
            ];

            const result = await this.collection.aggregate(pipeline).toArray();
            return result as IBrand[];
           
        } catch (error: any) {
            return [];
        }
    }

    async register({ body, user }: { body: IBrand, user: IAdmin }): Promise<IBrand> {
        try {

            const result = await this.insertOne({ body, user });
            return result;
        } catch (error: any) {
            throw error;
        }
    }
    
    async updateBrand({ _id, user, body }: { _id: number, body: IBrand, user: IAdmin }) {
        try {
            const filter = { _id, ownerId: user.ownerId };
            await this.updateOne({ filter, body, user });
            return body;
        } catch (error: any) {
            throw error;
        }
    }

    async getBrands({ query, ownerId }: { query: any, ownerId?: number }): Promise<IPaginationResult> {
        try {
            const { page, limit, description, _id } = query;
            const match: Record<string, any> = {};

            if (ownerId) {
                match["ownerId"] = ownerId;
            }

            if (_id) {
                match["_id"] = _id;
            }

            if (description) {
                match["description"] = { $regex: this.diacriticSensitive(description), $options: "i" };
            }

            return await this.paginate({
                query: [{ $match: match }], 
                page: page ? page : 1, 
                limit: limit ? limit : 10, 
                collection: COLLNAMES.BRANDS, 
                sort: { _id: -1 }
            });

        } catch (error: any) {
            throw error;
        }
    }
}

export { BrandService }