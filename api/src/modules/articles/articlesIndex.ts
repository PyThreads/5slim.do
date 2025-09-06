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
        this.createIndexSafely(tableName, { ownerId: 1, slug: 1 }, "articles_owner_slug", { unique: true });
        this.createIndexSafely(tableName, { "variants._id": 1, "_id": 1 }, "articles_variant_id_filter");
        this.createIndexSafely(tableName, { externalCode: 1, ownerId: 1 }, "article_external_code_unique", {
            unique: true,
            partialFilterExpression: {
                externalCode: { $exists: true, $type: "string" }
            }
        });
        this.createIndexSafely(tableName, { articleSearch: 1, ownerId: 1 }, "articles_search_ownerId");
        this.createIndexSafely(tableName, { featured: 1, updatedDate: 1 }, "articles_featured_updatedDate")
    }

    private async createIndexSafely(tableName: string, indexSpec: any, indexName: string, options: any = {}) {
        try {
            await this.mongoDatabase.collection(tableName).createIndex(indexSpec, { name: indexName, ...options });
        } catch (error: any) {
            if (error.code !== 85) { // Only ignore IndexOptionsConflict errors
                console.error(`Error creating index ${indexName}:`, error.message);
            }
        }
    }
}