import { Db } from "mongodb";
import { COLLNAMES } from "../../interfaces"

export class BrandsIndex {

    mongoDatabase: Db | any

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: COLLNAMES }) {
        this.mongoDatabase = mongoDatabase;
        
        this.createIndexSafely(tableName, { ownerId: 1, description: 1 }, "brands_owner_description");
        this.createIndexSafely(tableName, { ownerId: 1, _id: 1 }, "brands_owner_id");
        this.createIndexSafely(tableName, { ownerId: 1, slug: 1 }, "brands_owner_slug", { unique: true });
        this.createIndexSafely(tableName, { description: 1 }, "brands_description");
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