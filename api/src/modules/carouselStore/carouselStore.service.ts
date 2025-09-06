import { COLLNAMES, IAdmin, ICarouselSlide, IPaginationResult } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { CarouselStoreIndex } from "./carouselStoreDbIndex";

export class CarouselStoreService extends BaseService {

    public readonly collection: Document | any
    
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.CAROUSEL_STORE });
        new CarouselStoreIndex({ mongoDatabase, tableName: COLLNAMES.CAROUSEL_STORE });
    }

    async createCarouselSlide({ body, user }: { body: any, user: IAdmin }): Promise<ICarouselSlide> {
        try {
            const processedBody = {
                ...body,
                price: Number(body.price),
                originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined
            };
            const result = await this.insertOne({ body: processedBody, user });
            return result as unknown as ICarouselSlide;
        } catch (error: any) {
            throw error;
        }
    }

    async updateCarouselSlide({ _id, body, user }: { _id: string, body: any, user: IAdmin }): Promise<ICarouselSlide> {
        try {
            const processedBody = {
                ...body,
                ...(body.price && { price: Number(body.price) }),
                ...(body.originalPrice && { originalPrice: Number(body.originalPrice) })
            };
            const filter = { _id: parseInt(_id), ownerId: user.ownerId };
            const result = await this.updateOne({ filter, body: processedBody, user });
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    async deleteCarouselSlide({ _id, user }: { _id: string, user: IAdmin }): Promise<boolean> {
        try {
            const filter = { _id: parseInt(_id), ownerId: user.ownerId };
            const result = await this.collection.deleteOne(filter);
            return result.deletedCount > 0;
        } catch (error: any) {
            throw error;
        }
    }

    async getAllCarouselSlides({ page = 1, limit = 10,  }: { page?: number, limit?: number}): Promise<IPaginationResult> {
        try {
            const match = { ownerId: this.environmentConfig.storeOwner };
            const pipeline = [{ $match: match }];

            const result = await this.paginate({
                query: pipeline,
                page,
                limit,
                collection: COLLNAMES.CAROUSEL_STORE,
                sort: { createdDate: -1 }
            });

            return result;
        } catch (error: any) {
            throw error;
        }
    }

    async getPublicSlides(): Promise<IPaginationResult> {
        try {
            const pipeline = [{ $match: {} }];

            const result = await this.paginate({
                query: pipeline,
                page: 1,
                limit: 50,
                collection: COLLNAMES.CAROUSEL_STORE,
                sort: { createdDate: -1 }
            });

            return result;
        } catch (error: any) {
            throw error;
        }
    }

}