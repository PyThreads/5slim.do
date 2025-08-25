import { Db } from "mongodb";
import { COLLNAMES } from "../../interfaces"

export class AdminIndex {

    mongoDatabase: Db | any

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: COLLNAMES }) {
        this.mongoDatabase = mongoDatabase;
        
        // Create indexes with error handling
        this.createIndexSafely(tableName, { ownerId: 1, userType: 1 }, "admin_owner_usertype");
        this.createIndexSafely(tableName, { ownerId: 1, fullName: 1 }, "admin_owner_fullname");
        this.createIndexSafely(tableName, { ownerId: 1, userType: 1, fullName: 1 }, "admin_owner_usertype_fullname");
        this.createIndexSafely(tableName, { ownerId: 1, _id: 1 }, "admin_owner_id");
        this.createIndexSafely(tableName, { userType: 1 }, "admin_usertype");
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