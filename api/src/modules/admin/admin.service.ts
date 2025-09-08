
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { COLLNAMES, EnumTypeTempCode, IAdmin, IClient, IPaginationResult } from "../../interfaces";
import { AdminIndex } from "./adminIndex";

class AdminService extends BaseService {


    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.ADMIN });
        new AdminIndex({ mongoDatabase, tableName: COLLNAMES.ADMIN });
    }

    async login({ username, password }: { username: string, password: string }) {

        try {

            const user = await this.collection.findOne({ email: username })

            if (!user) {
                throw new Error("No existe un administrador con el correo: " + username);
            }

            const passwordMatch = await this.validateTempCode({ identifier: username, code: password, type: EnumTypeTempCode.START_SESSION, used: false });

            if (!passwordMatch) {
                throw new Error("La clave no coincide por favor verifique e intente de nuevo o solicite una nueva.");
            }

            // Si es cliente, obtener el logo del owner
            if (user.userType === 'Cliente' && user.ownerId !== user._id) {
                const owner = await this.collection.findOne({ _id: user.ownerId });
                if (owner && owner.logo) {
                    user.ownerLogo = owner.logo;
                }
            }

            delete user.password
            user.token = this.generateToken(user);

            return user;

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error al autenticar tu usuario.");
        }
    }

    async sendEmailCode({ email }: { email: string }): Promise<void> {
        try {

            const filter = { email: { $regex: this.diacriticSensitive(email), $options: "i" } };
            const queryExistsUser = await this.collection.countDocuments(filter);

            if (!queryExistsUser) {
                return
            }

            const code = await this.generateTempCode({ identifier: email, type: EnumTypeTempCode.START_SESSION });

            const html = `

            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Código de Inicio de Sesión</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        border: 5px solid #001987; /* Borde sólido de 5px de ancho y color #FF6633 */
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        color: #333333;
                        margin: 10px 0;
                    }
                    .content {
                        padding: 20px;
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        text-align: center;
                    }
                    .content p {
                        font-size: 16px;
                        color: #666666;
                        margin: 20px 0;
                    }
                    .code {
                        font-size: 24px;
                        font-weight: bold;
                        color: #007bff;
                        margin-bottom: 30px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                        cursor: pointer; /* Cambia el cursor a mano al pasar sobre el botón */
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Inicio de Sesión</h1>
                    </div>
                    <div class="content">
                        <p>Hemos recibido una solicitud para iniciar sesión en su cuenta.</p>
                        <p>Para continuar con el inicio de sesión, por favor utilice el siguiente código de verificación:</p>
                        <p class="code" id="verificationCode">${code}</p>
                        <p>Este código es válido solo durante 5 minutos.</p>
                    </div>
                    <div class="footer">
                        <p>Este correo ha sido enviado automáticamente. Por favor, no responda a este correo.</p>
                    </div>
                </div>
            </body>
            </html>
            
        `;

            this.sendEmail({ to: [email], html, subject: "Código de inicio de sesión" });

            return;

        } catch (error: any) {
            throw new Error("Hemos tenido inconvenientes al cambiar su clave, por favor intente nuevamente.");
        }
    }


    async updateProfile({ adminId, firstName, lastName, email, profilePicture, logo, businessName, logoDimentions, user }: { adminId: number, firstName: string, lastName: string, email: string, profilePicture?: string, logo?: string, businessName?: string, logoDimentions?: { width: number, height: number }, user: IAdmin }) {
        try {
            const updateData: any = {
                firstName: firstName,
                lastName,
                fullName: `${firstName.trim()} ${lastName.trim()}`,
                email,
                profilePicture: profilePicture || ""
            };

            // Solo owners y clientes pueden actualizar el logo
            if ((user.userType === 'Cliente' || user._id === user.ownerId) && logo !== undefined) {
                updateData.logo = logo;
            }

            // Solo owners pueden actualizar el nombre comercial
            if ((user.userType === 'Cliente' || user._id === user.ownerId) && businessName !== undefined) {
                updateData.businessName = businessName;
            }

            // Solo owners pueden actualizar las dimensiones del logo
            if ((user.userType === 'Cliente' || user._id === user.ownerId) && logoDimentions !== undefined) {
                updateData.logoDimentions = logoDimentions;
            }

            const result = await this.collection.findOneAndUpdate(
                { _id: adminId, ownerId: user.ownerId },
                { $set: updateData },
                { returnDocument: "after" }
            );

            if (!result) {
                throw new Error("No se pudo actualizar el perfil.");
            }

            delete result.password;
            return result;

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error al actualizar el perfil.");
        }
    }

    async createSystemUser({ body, user }: { body: any, user: IAdmin }) {
        try {
            const { firstName, lastName, email, profilePicture, active } = body;
            
            // Verificar si el email ya existe
            const existingUser = await this.collection.findOne({ email });
            if (existingUser) {
                throw new Error("Ya existe un usuario con este email.");
            }

            const userData = {
                firstName,
                lastName,
                fullName: `${firstName.trim()} ${lastName.trim()}`,
                email,
                userType: "Cliente",
                role: [],
                profilePicture: profilePicture || "",
                active: active !== undefined ? active : true
            };

            // Insertar el usuario
            const result = await this.insertOne({body: userData, user });
            const newUserId = result._id;

            // Actualizar el ownerId con su propio _id
            await this.collection.updateOne(
                { _id: newUserId },
                { $set: { ownerId: newUserId } }
            );

            // Obtener el usuario creado
            const createdUser = await this.collection.findOne(
                { _id: newUserId }
            );

            return createdUser;

        } catch (error: any) {
            throw new Error(error?.message || "Error al crear usuario del sistema.");
        }
    }

    async getAllSystemUsers(query: { page: number, limit: number, fullName?: string }): Promise<IPaginationResult> {
        try {
            const match = { userType: "Cliente" };


            if(query.fullName){
                Object.assign(match, { fullName: { $regex: this.diacriticSensitive(query.fullName), $options: "i" } });
            }

            const pipeline = [
                { 
                    $match: match
                },
                { $project: { fullName: 1, firstName: 1, lastName: 1, createdDate: 1, userType: 1, email: 1, active: 1, profilePicture: 1, role: 1 } },
                { $sort: { createdDate: 1 } }
            ];

            return await this.paginate({ query: pipeline, page: query.page, limit: query.limit, collection: COLLNAMES.ADMIN });

        } catch (error: any) {
            throw new Error(error?.message || "Error al obtener usuarios del sistema.");
        }
    }

    async updateSystemUser({ userId, body, user }: { userId: number, body: any, user: IAdmin }): Promise<IAdmin> {
        try {
            const { firstName, lastName, email, profilePicture, active } = body;
            
            const updateData: any = {
                firstName,
                lastName,
                fullName: `${firstName.trim()} ${lastName.trim()}`,
                email,
                profilePicture: profilePicture || "",
                active: active !== undefined ? active : true,
                updatedDate: new Date(),
                updatedBy: {
                    _id: user._id,
                    fullName: user.fullName
                }
            };

           return await this.updateOne({ filter: { _id: userId, userType: "Cliente" }, body: updateData, user });

    

        } catch (error: any) {
            throw new Error(error?.message || "Error al actualizar usuario del sistema.");
        }
    }


    generateHtmlNotifyPaymentValidation({ clientName, orderId }: { clientName: string, orderId: number }) {
        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificación de Pago</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #FF6633;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .footer {
                    background-color: #FF6633;
                    color: #ffffff;
                    text-align: center;
                    padding: 10px;
                    font-size: 14px;
                }
                .footer a {
                    color: #ffffff;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Notificación de Pago</h1>
                </div>
                <div class="content">
                    <p>Hola ${clientName},</p>
                    <p>Se ha validado correctamente el pago de la orden <strong>#${orderId}</strong>.</p>
                    <p>Estaremos en contacto con usted para coordinar la entrega de su orden.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} LBC-AUTOPARTS. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
            `;
    }

}


export { AdminService } 