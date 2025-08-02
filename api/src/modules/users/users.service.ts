import { COLLNAMES, IAdmin, IClient, IPaginateClients, IPaginationResult } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { UserIndex } from "./usersIndex";

class UsersService extends BaseService {

    public readonly collection: Document | any
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.CLIENTS });
        new UserIndex({ mongoDatabase, tableName: COLLNAMES.CLIENTS });
    }


    async getAllClientsSummary(): Promise<number> {
        try {
            const totalClients = await this.collection.countDocuments({});
            return totalClients;
        } catch (error: any) {
            throw error;
        }
    }
    /**
     * Registra un nuevo usuario.
     * @param {IClient} userToRegister - El usuario que se va a registrar.
     * @returns {Promise<IClient>} - Una promesa que resuelve con el usuario registrado.
     */
    async register({ body, user }: { body: IClient, user: IClient | IAdmin }): Promise<IClient> {
        try {

            const exists = await this.collection.countDocuments({ email: { $regex: this.diacriticSensitive(body.email), $options: "i"} });

            body.fullClient = `${body.fullName} ${body.email} ${body.addresses.length > 0 ? body.addresses.map((a: any) => a.phone + " ") : ''}`.trim();

            if (exists) {
                throw new Error("Existe una cuenta con el correo: " + body.email);
            }

            await this.insertOne({ body, user });
            return body

        } catch (error: any) {
            throw error;
        }
    }

    async updateClient({ _id, user, body }: { _id: number, body: IClient, user: IClient | IAdmin }) {
        try {

            const filter = { _id }
            await this.updateOne({ filter, body, user });
            return body
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * 
     * @param query: IPaginateClients    
     * @returns 
     */
    async getAllClients({ query }: { query: IPaginateClients }): Promise<IPaginationResult> {
        try {

            const { page, limit, fullName, active, email, _id } = query;
            const match: Record<string, any> = {};

            const aggregate = [
                {
                    $match: match
                }
            ];

            if (_id) {
                match["_id"] = _id
            }

            if (fullName) {
                match["fullClient"] = { $regex: this.diacriticSensitive(fullName), $options: "i" };
            }

            if (active !== undefined) {
                match["active"] = active;
            }
            if (email) {
                match["email"] = { $regex: email, $options: "i" };
            }

            return await this.paginate({
                query: aggregate, page: page ? page : 1, limit: limit ? limit : 10, collection: COLLNAMES.CLIENTS, sort: {
                    _id: -1
                }
            });

        } catch (error: any) {
            throw error;
        }
    }

}

export { UsersService } 