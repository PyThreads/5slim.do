import { Db } from "mongodb";
import { COLLNAMES } from "../../interfaces"

export class OrdersIndex {

    mongoDatabase: Db | any

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: COLLNAMES }) {
        this.mongoDatabase = mongoDatabase;
        this.mongoDatabase.collection(tableName).createIndex({ "client.fullClient": 1 }, { unique: false, name: "order_full_client" });
        this.mongoDatabase.collection(tableName).createIndex({ "client._id": 1 }, { unique: false, name: "order_client_id" });
        this.mongoDatabase.collection(tableName).createIndex({ status: 1 }, { unique: false, name: "status" });
    }
}