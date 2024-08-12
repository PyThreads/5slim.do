import { ConnectionPool } from 'mssql';
import { environmentConfig } from '.';
import { MongoClient, Db } from 'mongodb';

class Database {

    constructor() {
    }

    public async initDB(): Promise<Db> {
        try {
            const url = `mongodb://${environmentConfig.DB_USER}:${environmentConfig.DB_PASSWORD}@${environmentConfig.DB_HOST}:${environmentConfig.DB_PORT}`;
            const client = new MongoClient(url, {
                serverApi: {
                    version: "1",
                    strict: true,
                    deprecationErrors: true,
                }
            });

            const connection = await client.connect();

            console.log("Connected to db: " + environmentConfig.DB_NAME);

            return connection.db(environmentConfig.DB_NAME);


        } catch (error) {
            console.log("Could not connect to db: " + environmentConfig.DB_NAME);
            throw error; // Ensure to re-throw the error or handle it appropriately
        }
    }

    public async getDb(): Promise<Db> {
        return this.initDB();
    }

    async getExternalDb() {

        const config = {
            user: environmentConfig.DB_EXTERNAL_USER,
            password: environmentConfig.DB_EXTERNAL_PASSWORD,
            server: environmentConfig.DB_EXTERNAL_HOST,
            database: environmentConfig.DB_EXTERNAL_NAME,
            options: {
                encrypt: false,
                trustServerCertificate: false,
                reconnect: true,
                hostNameInCertificate: false  // Establecer esta opción
            }
        };

        const pool: ConnectionPool = new ConnectionPool(config);
        return pool;

    }
}

export default new Database();