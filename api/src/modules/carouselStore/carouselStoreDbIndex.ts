import { Db } from "mongodb";

export class CarouselStoreIndex {

    mongoDatabase: Db | any

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: string }) {
        this.mongoDatabase = mongoDatabase;
        
        this.createIndexSafely(tableName, { ownerId: 1 }, "carousel_store_owner");
        this.createIndexSafely(tableName, { ownerId: 1, _id: 1 }, "carousel_store_owner_id");
        this.createIndexSafely(tableName, { createdDate: 1 }, "carousel_store_created_date");
    }

    private async createIndexSafely(tableName: string, indexSpec: any, indexName: string, options: any = {}) {
        try {
            await this.mongoDatabase.collection(tableName).createIndex(indexSpec, { name: indexName, ...options });
        } catch (error: any) {
            if (error.code !== 85) {
                console.error(`Error creating index ${indexName}:`, error.message);
            } 
        }
    }
}