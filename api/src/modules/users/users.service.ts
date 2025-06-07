import { COLLNAMES, IAdmin, IClient, IPaginateClients, IPaginationResult } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";

class UsersService extends BaseService {

    public readonly collection: Document | any
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.CLIENTS });
    }

    /**
     * Registra un nuevo usuario.
     * @param {IClient} userToRegister - El usuario que se va a registrar.
     * @returns {Promise<IClient>} - Una promesa que resuelve con el usuario registrado.
     */
    async register({ body, user }: { body: IClient, user: IClient | IAdmin }): Promise<IClient> {
        try {

            const exists = await this.collection.countDocuments({ email: body.email });

            if (exists) {
                throw new Error("Existe una cuenta con el correo: " + body.email);
            }

            await this.insertOne({ body, user });
            return body

        } catch (error: any) {
            throw error;
        }
    }

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
                const newField: any = {
                    $addFields: {
                        "fullSearch": {
                            "$concat": [
                                "$fullName",
                                " ",
                                "$email",
                                " ",
                                {
                                    // Construimos una cadena con todos los phones:
                                    $reduce: {
                                        input: {
                                            $map: {
                                                input: "$addresses",
                                                as: "addr",
                                                in: { $ifNull: ["$$addr.phone", ""] }
                                            }
                                        },
                                        initialValue: "",
                                        in: {
                                            $cond: [
                                                { $eq: ["$$value", ""] },
                                                "$$this",                  // si es la primera iteración, devuelve solo $$this
                                                { $concat: ["$$value", " ", "$$this"] } // si hay valor previo, agrega espacio + siguiente phone
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                };
                aggregate.unshift(newField);
                match["fullSearch"] = { $regex: this.diacriticSensitive(fullName), $options: "i" };
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