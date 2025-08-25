import { Db } from "mongodb";
import { COLLNAMES } from "../../interfaces"

export class UserIndex{

    mongoDatabase : Db | any
        
    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: COLLNAMES }) {
        this.mongoDatabase = mongoDatabase;
        
        // Create indexes with error handling
        this.createIndexSafely(tableName, { ownerId: 1, fullName: 1 }, "users_owner_fullname");
        this.createIndexSafely(tableName, { ownerId: 1, email: 1 }, "users_owner_email");
        this.createIndexSafely(tableName, { ownerId: 1, _id: 1 }, "users_owner_id");
        this.createIndexSafely(tableName, { ownerId: 1, fullClient: 1 }, "users_owner_fullclient");
        this.createIndexSafely(tableName, { ownerId: 1, createdDate: 1 }, "users_owner_created_date");
        this.createIndexSafely(tableName, { fullName: 1 }, "users_fullname");
        this.createIndexSafely(tableName, { phone: 1 }, "users_phone");
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