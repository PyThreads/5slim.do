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

    /**
     * Registra un nuevo usuario.
     * @param {IClient} userToRegister - El usuario que se va a registrar.
     * @returns {Promise<IClient>} - Una promesa que resuelve con el usuario registrado.
     */
    async register({ body, user }: { body: IClient, user: IClient | IAdmin }): Promise<IClient> {
        try {

            const exists = await this.collection.countDocuments({ email: body.email });

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

    /**
     * 
     * @param query: IPaginateClients    
     * @returns 
     */
    async getAllClients({ query }: { query: IPaginateClients }): Promise<IPaginationResult> {
        try {

            const { page, limit, fullName, active, email } = query;
            const match: Record<string, any> = {};

            const aggregate = [
                {
                    $match: match
                }
            ];

            if (fullName) {
                match["fullClient"] = { $regex: this.diacriticSensitive(fullName), $options: "i" };
            }

            if (active !== undefined) {
                match["active"] = active;
            }
            if (email) {
                match["email"] = { $regex: email, $options: "i" };
            }

            return await this.paginate({ query: aggregate, page, limit, collection: COLLNAMES.CLIENTS });

        } catch (error: any) {
            throw error;
        }
    }

}

export { UsersService } 