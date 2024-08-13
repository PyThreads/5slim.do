import { Db, Collection, MongoServerError } from "mongodb";
import { EnvironmentConfig, database, environmentConfig } from "../config";
import { ConnectionPool } from "mssql";
import path from "path";
import fs from "fs";
import nodemailer from 'nodemailer';
import { IUser, ItypeTempCode } from "../interfaces";
import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from "express";


class BaseService {
    public readonly tableName: string
    public readonly collection: Collection | any;
    public readonly mongoDatabase: Db;
    private readonly environmentConfig: EnvironmentConfig
    public readonly tempCodeTable: string;
    public readonly JWT_SECRET_KEY

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: string }) {
        this.JWT_SECRET_KEY = "JOSEPH-JOESTAR22@L."
        this.tableName = tableName
        this.environmentConfig = environmentConfig
        this.mongoDatabase = mongoDatabase;
        this.collection = mongoDatabase.collection(this.tableName)
        this.tempCodeTable = "TEMP_CODES";
    }

    handleError(error: any) {

        if(error instanceof MongoServerError){
            throw new Error("Ha ocurrido un error al procesar su solicitud.")
        } else if (error instanceof TypeError || error instanceof ReferenceError) {
            // Manejar errores de propiedades no existentes o errores de tipo
            throw new Error("Hace falta una propiedad para completar su solicitud.");

        } else if(error instanceof Error) {
            // Manejar errores personalizados
            throw new Error(error.message);
        }
    }


    verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new Error("El usuario no se ha autenticado de forma correcta.");
            }

            const user = jwt.verify(token, this.JWT_SECRET_KEY) as IUser;
            res.locals.user = user; // Asigna el usuario decodificado a req.user
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


    async insertOne({ body }: { body: any }): Promise<void> {

        try {
            let object = { ...body };
            object._id = await this.getSequence();
            object.createdDate = new Date();
            await this.collection.insertOne(object)
            return object
        } catch (error) {
            this.logError(error);
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
            this.logError(error);
            throw error; // Propaga el error para que sea manejado fuera de la función
        }
    }

    logError(error: any): void {
        const logsFolder = './logs';
        const errorLogFile = path.join(logsFolder, 'error.log');
        const currentDate = new Date().toISOString();

        // Crear el directorio de logs si no existe
        if (!fs.existsSync(logsFolder)) {
            fs.mkdirSync(logsFolder);
        }

        // Formatear el mensaje de error
        const errorMessage = `${'-'.repeat(50)}\n${currentDate}\n${error.stack}\n`;

        // Escribir el mensaje de error en el archivo de logs
        if (fs.existsSync(errorLogFile)) {
            const existingContent = fs.readFileSync(errorLogFile, 'utf8');
            fs.writeFileSync(errorLogFile, errorMessage + existingContent);
        } else {
            fs.writeFileSync(errorLogFile, errorMessage);
        }
    }

    sendEmail({ to, html, subject }: { to: string[], html: string, subject: string }) {
        try {

            const transporter = nodemailer.createTransport({
                port: Number(this.environmentConfig.SMTP_PORT),
                host: this.environmentConfig.SMTP_SERVER, // Puedes usar otros servicios SMTP aquí
                secure: true,
                auth: {
                    user: this.environmentConfig.SMTP_USER, // Cambia por tu dirección de correo electrónico
                    pass: this.environmentConfig.SMTP_PASSWORD, // Cambia por tu contraseña o token de aplicación
                },
            });

            const mailOptions: nodemailer.SendMailOptions = {
                from: this.environmentConfig.SMTP_SEND_AS, // Dirección de correo del remitente
                to: to.join(","), // Dirección de correo del destinatario
                subject: subject,
                html: html
            };

            setTimeout(async () => {
                await transporter.sendMail(mailOptions);
            }, 10)

            return

        } catch (error) {
            this.logError(error);
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
                createdDate: new Date(),
            };

            // Insertar el documento en la colección
            await collection.insertOne(codeDocument);
            return code;

        } catch (error) {
            this.logError(error)
            throw error
        }
    }


    async validateTempCode(params: ItypeTempCode): Promise<boolean> {

        try {

            const collection = this.mongoDatabase.collection(this.tempCodeTable);

            const match = await collection.findOne({ identifier: params.identifier, code: params.code!, type: params.type }, { projection: { code: 1 } })

            return match ? true : false

        } catch (error) {
            this.logError(error)
            throw error
        }
    }

}

export default BaseService;
