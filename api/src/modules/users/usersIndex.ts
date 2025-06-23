import { Db } from "mongodb";
import { COLLNAMES } from "../../interfaces"

export class UserIndex{

    mongoDatabase : Db | any
        
    constructor({ mongoDatabase,tableName }: { mongoDatabase: Db, tableName: COLLNAMES }){
        this.mongoDatabase = mongoDatabase;
        this.mongoDatabase.collection(tableName).createIndex({ fullClient: 1 }, { unique: true });
        this.mongoDatabase.collection(tableName).createIndex({ email: 1 }, { unique: true });
    }

}