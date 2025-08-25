import { Db } from "mongodb";
import { COLLNAMES } from "../../interfaces"

export class OrdersIndex {

    mongoDatabase: Db | any

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: COLLNAMES }) {
        this.mongoDatabase = mongoDatabase;
        
        // Create indexes with error handling
        this.createIndexSafely(tableName, { ownerId: 1, "client.fullClient": 1 }, "orders_owner_client_fullname");
        this.createIndexSafely(tableName, { ownerId: 1, "client._id": 1 }, "orders_owner_client_id");
        this.createIndexSafely(tableName, { ownerId: 1, status: 1 }, "orders_owner_status");
        this.createIndexSafely(tableName, { ownerId: 1, _id: 1 }, "orders_owner_id");
        this.createIndexSafely(tableName, { ownerId: 1, createdDate: 1 }, "orders_owner_created_date");
        this.createIndexSafely(tableName, { ownerId: 1, status: 1, createdDate: 1 }, "orders_owner_status_date");
        this.createIndexSafely(tableName, { createdDate: 1 }, "orders_created_date");
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