import { Db } from "mongodb";
import { COLLNAMES } from "../../interfaces"

export class ArticlesIndex {

    mongoDatabase: Db | any

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: COLLNAMES }) {
        this.mongoDatabase = mongoDatabase;
        this.mongoDatabase.collection(tableName).createIndex({ slug: 1 }, { unique: true, name: "slug" });
        this.mongoDatabase.collection(tableName).createIndex({ description: 1 }, { unique: false, name: "description" });
        this.mongoDatabase.collection(tableName).createIndex({ categories: 1 }, {  name: "categories" });
    }
}