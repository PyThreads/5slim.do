import { Db } from "mongodb";
import { COLLNAMES } from "../../interfaces"

export class CategoriesIndex {

    mongoDatabase: Db | any

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: COLLNAMES }) {
        this.mongoDatabase = mongoDatabase;
        
        // Create indexes with error handling
        this.createIndexSafely(tableName, { ownerId: 1, description: 1 }, "categories_owner_description");
        this.createIndexSafely(tableName, { ownerId: 1, _id: 1 }, "categories_owner_id");
        this.createIndexSafely(tableName, { ownerId: 1, slug: 1 }, "categories_owner_slug");
        this.createIndexSafely(tableName, { description: 1 }, "categories_description");
    }

    private async createIndexSafely(tableName: string, indexSpec: any, indexName: string) {
        try {
            await this.mongoDatabase.collection(tableName).createIndex(indexSpec, { name: indexName });
        } catch (error: any) {
            if (error.code !== 85) { // Only ignore IndexOptionsConflict errors
                console.error(`Error creating index ${indexName}:`, error.message);
            }
        }
    }
}