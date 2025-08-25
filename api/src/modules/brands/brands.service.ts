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

    async register({ body, user }: { body: IBrand, user: IAdmin }): Promise<IBrand> {
        try {
            body.slug = await this.getBrandSlug(body.description);
            const result = await this.insertOne({ body, user });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    async getBrandSlug(description: string): Promise<string> {
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