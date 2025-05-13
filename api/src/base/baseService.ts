import { Db, Collection } from "mongodb";
import { EnvironmentConfig, environmentConfig } from "../config";
import { ConnectionPool } from "mssql";
import { IUser, ItypeTempCode } from "../interfaces";
import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from "express";
const msal = require('@azure/msal-node');
const { Client } = require('@microsoft/microsoft-graph-client');
import {utils,Utils} from "../utils"


class BaseService {
    public databaseExternal: Promise<ConnectionPool> | undefined;
    public readonly tableName: string
    public readonly collection: Collection | any;
    public readonly mongoDatabase: Db | any;
    public readonly environmentConfig: EnvironmentConfig;
    public readonly tempCodeTable: string;
    public readonly JWT_SECRET_KEY;
    public readonly utils: Utils

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: string }) {
        this.JWT_SECRET_KEY = "JOSEPH-JOESTAR22@L."
        this.tableName = tableName
        this.environmentConfig = environmentConfig
        this.mongoDatabase = mongoDatabase;
        this.collection = mongoDatabase.collection(this.tableName)
        this.tempCodeTable = "TEMP_CODES";
        this.utils = utils
    }

    formatMoney(amount: number): string {
        const formatter = new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP'
        });

        return formatter.format(amount);
    }

    async verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new Error("El usuario no se ha autenticado de forma correcta.");
            }

            const user = jwt.verify(token, this.JWT_SECRET_KEY) as IUser;
            const userOnDb = await this.mongoDatabase.collection("USERS").findOne({ _id: user._id });
            res.locals.user = userOnDb; // Asigna el usuario decodificado a req.user
            next();
        } catch (error: any) {
            res.status(401).json({
                success: false,
                data: null,
                message: error?.message || "El usuario no se ha autenticado de forma correcta."
            });
        }
    }

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


    async insertOne({ body, user }: { body: any, user: IUser }): Promise<any> {

        try {
            let object = { ...body };
            object._id = await this.getSequence();
            object.createdDate = this.utils.newDate();
            object.createdBy = {
                _id: object._id,
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
                authProvider: (done:any) => {
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
                    toRecipients: [
                        {
                            emailAddress: {
                                address: to
                            }
                        }
                    ]
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

            const match = await collection.find(params).sort({_id: -1}).toArray();
            
            return match.length  > 0 ? true : false

        } catch (error) {
            throw error
        }
    }

}

export default BaseService;
