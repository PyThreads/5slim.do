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


    async getAllClientsSummary(user: IAdmin): Promise<number> {
        try {
            const filter = {ownerId: user.ownerId}
            const totalClients = await this.collection.countDocuments(filter);
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

            const exists = await this.collection.countDocuments({ email: { $regex: this.diacriticSensitive(body.email), $options: "i" } });

            if (exists) {
                throw new Error("Existe una cuenta con el correo: " + body.email);
            }
            
            body.fullClient = `${body.fullName} ${body.email} ${body.addresses.length > 0 ? body.addresses.map((a: any) => a.phone + " ") : ''}`.trim();
            
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
    async getAllClients({ query, ownerId }: { query: IPaginateClients, ownerId?: number }): Promise<IPaginationResult> {
        try {

            const { page, limit, fullName, active, email, _id } = query;
            const match: Record<string, any> = {};

            if (ownerId) {
                match["ownerId"] = ownerId;
            }

            const aggregate = [
                {
                    $match: match
                },
                {
                    $lookup: {
                        from: "0RDER",
                        let: { clientId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$client._id", "$$clientId"] }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalOrdenes: { $sum: 1 },
                                    totalGastado: { $sum: "$total.total" }
                                }
                            }
                        ],
                        as: "ordenes"
                    }
                },
                {
                    $unwind: {
                        path: "$ordenes",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        fullName: 1,
                        email: 1,
                        addresses: 1,
                        fullClient: 1,
                        createdDate: 1,
                        createdBy: 1,
                        totalOrdenes: {$ifNull :["$ordenes.totalOrdenes", 0]},
                        totalGastado: {$ifNull :["$ordenes.totalGastado", 0]}
                    }
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