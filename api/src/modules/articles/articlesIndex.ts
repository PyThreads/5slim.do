import { Db } from "mongodb";
import { COLLNAMES } from "../../interfaces"

export class ArticlesIndex {

    mongoDatabase: Db | any

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: COLLNAMES }) {
        this.mongoDatabase = mongoDatabase;
        
        // Create indexes with error handling
        this.createIndexSafely(tableName, { ownerId: 1, description: 1 }, "articles_owner_description");
        this.createIndexSafely(tableName, { ownerId: 1, published: 1 }, "articles_owner_published");
        this.createIndexSafely(tableName, { ownerId: 1, categories: 1 }, "articles_owner_categories");
        this.createIndexSafely(tableName, { ownerId: 1, _id: 1 }, "articles_owner_id");
        this.createIndexSafely(tableName, { ownerId: 1, slug: 1 }, "articles_owner_slug");
        this.createIndexSafely(tableName, { published: 1 }, "articles_published");
        this.createIndexSafely(tableName, { "variants._id": 1, "_id": 1 }, "articles_variant_id_filter");
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