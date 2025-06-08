import { Db, Collection, Sort, ReturnDocument } from "mongodb";
import { EnvironmentConfig, environmentConfig } from "../config";
import { COLLNAMES, IAdmin, IClient, IFunctionProps, IPaginationResult, ItypeTempCode, IUser } from "../interfaces";
import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request, Router } from "express";
const msal = require('@azure/msal-node');
const { Client } = require('@microsoft/microsoft-graph-client');
import { utils, Utils } from "../utils"


class BaseService {
    public readonly tableName: string
    public readonly collection: Collection | any;
    public readonly mongoDatabase: Db | any;
    public readonly environmentConfig: EnvironmentConfig;
    public readonly tempCodeTable: string;
    public readonly JWT_SECRET_KEY;
    public readonly utils: Utils

    constructor({ mongoDatabase, tableName, app, prefix, functionProps }: { mongoDatabase: Db, tableName: string, app?: Router, prefix?: string, functionProps?: IFunctionProps }) {
        this.JWT_SECRET_KEY = "JOSEPH-JOESTAR22@L."
        this.tableName = tableName
        this.environmentConfig = environmentConfig
        this.mongoDatabase = mongoDatabase;
        this.collection = mongoDatabase.collection(this.tableName)
        this.tempCodeTable = "TEMP_CODES";
        this.utils = utils



        app && app.post(`${prefix}`, functionProps!.createValidation(), async (req: Request, res: Response) => {
            try {
                const result = await this.insertOne({ body: req.body, user: res.locals.admin });
                res.status(200).json({
                    success: true,
                    data: result,
                    message: "Guardado de forma exitosa"
                })
            } catch (error: any) {
                res.status(400).json({
                    success: false,
                    data: null,
                    message: error?.message || "Ha ocurrido un error al guardar."
                })
            }
        })
    }

    async updateOne({filter,body,user,returnNew = true }: { filter: any, body: any, user: IAdmin | IClient,returnNew?: boolean}) {
        try {

            body.updatedBy = {
                _id: user._id,
                fullName: user.fullName
            }

            body.updatedDate = this.utils.newDate();

            return await this.collection.updateOne(filter, { $set: body }, { ReturnDocument: returnNew ? ReturnDocument.AFTER : ReturnDocument.BEFORE });

        } catch (error) {
            throw error;
        }
    }

    diacriticSensitive(text: string): string {
        const map: Record<string, string> = {
            a: "[aá]",
            e: "[eé]",
            i: "[ií]",
            o: "[oó]",
            u: "[uúü]"
        };
        return text
            .toLowerCase()
            .replace(/[aeiou]/g, (vowel) => map[vowel] || vowel);
    }

    async paginate(
        params: {
            query?: any[];
            page: number;
            limit: number;
            collection: COLLNAMES;
            sort?: Sort;
        }
    ): Promise<IPaginationResult> {
        try {
            const { query = [], page, limit, collection, sort } = params;

            const pipeline: any = [...query];

            if (sort) {
                pipeline.push({ $sort: sort });
            }

            const skip = (page - 1) * limit;

            const aggCount = [...pipeline,
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    count: "$totalCount"
                }
            }
            ];

            const resultCount = await this.mongoDatabase.collection(collection).aggregate(aggCount, { allowDiskUse: true }).toArray();

            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });

            const result = await this.mongoDatabase.collection(collection).aggregate(pipeline).toArray();

            const count = resultCount[0]?.count || 0;
            const totalPages = count > 0 ? Math.ceil(count / limit) : 1;

            return {
                totalPages,
                list: result,
                currentPage: page > totalPages ? totalPages : page,
                totalItems: count
            };
        } catch (e) {
            throw e;
        }
    }

    formatMoney(amount: number): string {
        const formatter = new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP'
        });

        return formatter.format(amount);
    }

    // async verifyToken(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const token = req.headers.authorization?.split(' ')[1];

    //         if (!token) {
    //             throw new Error("El usuario no se ha autenticado de forma correcta.");
    //         }

    //         const user = jwt.verify(token, this.JWT_SECRET_KEY) as IUser;
    //         const userOnDb = await this.mongoDatabase.collection("USERS").findOne({ _id: user._id });
    //         res.locals.user = userOnDb; // Asigna el usuario decodificado a req.user
    //         next();
    //     } catch (error: any) {
    //         res.status(401).json({
    //             success: false,
    //             data: null,
    //             message: error?.message || "El usuario no se ha autenticado de forma correcta."
    //         });
    //     }
    // }

    async verifyTokenAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new Error("El usuario no se ha autenticado de forma correcta.");
            }

            const user = jwt.verify(token, this.JWT_SECRET_KEY) as IUser;
            const userOnDb = await this.mongoDatabase.collection("ADMIN").findOne({ _id: user._id });
            res.locals.admin = userOnDb; // Asigna el usuario decodificado a req.user
            next();
        } catch (error: any) {
            res.status(401).json({
                success: false,
                data: null,
                message: error?.message || "El usuario no se ha autenticado de forma correcta."
            });
        }
    }

    generateToken(body: any) {
        try {

            const token = jwt.sign(body, this.JWT_SECRET_KEY);
            return token

        } catch (error) {
            throw new Error("Ha ocurrido un error al generar el token.")
        }
    }


    async insertOne({ body, user }: { body: any, user: IClient | IAdmin }): Promise<any> {

        try {
            let object = { ...body };
            object._id = await this.getSequence();
            object.createdDate = this.utils.newDate();
            object.createdBy = {
                _id: user._id,
                fullName: user.fullName
            }
            await this.collection.insertOne(object)
            return object
        } catch (error) {
            throw error
        }
    }


    async getSequence(): Promise<Number> {
        const collection = this.tableName;

        try {

            const sequenceCollection = this.mongoDatabase.collection('SEQUENCE');

            // Buscar el documento de secuencia para la colección dada
            let sequenceDoc = await sequenceCollection.findOne({ collection });

            if (sequenceDoc) {
                const current_value = sequenceDoc.sequence_value;
                const new_value = current_value + 1;

                // Actualizar el documento con el nuevo valor de secuencia
                await sequenceCollection.updateOne(
                    { collection },
                    { $set: { sequence_value: new_value } }
                );

                return new_value;
            } else {
                // Insertar un nuevo documento si no se encuentra
                const newSequence = { collection, sequence_value: 1 };
                await sequenceCollection.insertOne(newSequence);

                return newSequence.sequence_value;
            }
        } catch (error) {
            throw error; // Propaga el error para que sea manejado fuera de la función
        }
    }


    async sendEmail({ to, html, subject }: { to: string[], html: string, subject: string }) {
        try {

            const msalConfig = {
                auth: {
                    clientId: this.environmentConfig.microsoftClientId, // ID de la aplicación registrada
                    authority: this.environmentConfig.microsoftAuthority, // Tenant ID
                    clientSecret: this.environmentConfig.microsfotClientSecret, // Reemplaza por el secret de la aplicación
                }
            };

            const clientCredentialRequest = {
                scopes: ["https://graph.microsoft.com/.default"]
            };

            const cca = new msal.ConfidentialClientApplication(msalConfig);
            const response = await cca.acquireTokenByClientCredential(clientCredentialRequest);

            const client = Client.init({
                authProvider: (done: any) => {
                    done(null, response.accessToken);
                }
            });


            const mail = {
                message: {
                    subject: subject,
                    body: {
                        contentType: "HTML",
                        content: html
                    },
                    toRecipients: to.map(email => ({ emailAddress: { address: email } }))
                },
                saveToSentItems: false
            };

            setTimeout(async () => {
                try {
                    await client.api(`/users/${this.environmentConfig.microsoftSendEmail}/sendMail`).post(mail);
                } catch (error) {
                    return
                }
            }, 10)

            return

        } catch (error) {
            throw error
        }
    }

    async generateTempCode({ identifier, type }: ItypeTempCode): Promise<string> {

        try {

            let code = '';
            const characters = '0123456789';

            for (let i = 0; i < 5; i++) {
                code += characters.charAt(Math.floor(Math.random() * 5));
            }

            const collection = this.mongoDatabase.collection(this.tempCodeTable);

            // Crear el documento a insertar
            const codeDocument = {
                identifier,
                code,
                type,
                used: false,
                createdDate: this.utils.newDate(),
            };

            // Insertar el documento en la colección
            await collection.insertOne(codeDocument);
            return code;

        } catch (error) {
            throw error
        }
    }


    async validateTempCode(params: Partial<ItypeTempCode>): Promise<boolean> {

        try {

            const collection = this.mongoDatabase.collection(this.tempCodeTable);

            const match = await collection.find(params).sort({ _id: -1 }).toArray();

            if (match.length > 0) {
                await collection.updateOne({ _id: match[0]._id }, { $set: { used: true } });
            }

            return match.length > 0 ? true : false

        } catch (error) {
            throw error
        }
    }

}

export default BaseService;
