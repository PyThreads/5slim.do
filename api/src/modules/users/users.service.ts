import { EnumTypeTempCode, IChangePasswordBody, ISubmitPassword, IUser, IUserAddress } from "../../interfaces";
import bcrypt from "bcrypt"
import BaseService from "../../base/baseService";
import { Db } from "mongodb";

class UsersService extends BaseService {

    private addressServiceBase: BaseService
    public readonly collection: Document | any
    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: "USERS" });
        this.addressServiceBase = new BaseService({ mongoDatabase, tableName: "ADDRESS" })
    }

    async login({ username, password }: { username: string, password: string }) {

        try {

            const user = await this.collection.findOne({ email: username })

            if (!user) {
                throw new Error("No existe un usuario con el correo: " + username);
            }

            const passwordMatch = await this.validateTempCode(
                {
                    type: EnumTypeTempCode.START_SESSION,
                    code: password,
                    identifier: username,
                    used: false
                }
            );

            if (!passwordMatch) {
                throw new Error("El código no coincide por favor verifique e intente de nuevo.");
            }

            user.token = this.generateToken(user);

            return user


        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error al autenticar tu usuario.");
        }
    }

    /**
     * Registra un nuevo usuario.
     * @param {IUser} userToRegister - El usuario que se va a registrar.
     * @returns {Promise<IUser>} - Una promesa que resuelve con el usuario registrado.
     */
    async register(userToRegister: IUser): Promise<IUser> {
        try {

            const exists = await this.collection.findOne({ email: userToRegister.email }, { projection: { _id: 1 } });

            if (exists) {
                throw new Error("Existe una cuenta con el correo: " + userToRegister.email);
            }

            userToRegister.fullName = this.getFullName(userToRegister);

            await this.insertOne({ body: userToRegister,user: userToRegister });
            return userToRegister

        } catch (error) {
            throw error
        }
    }

    getFullName(user: IUser) {
        return `${user.name.trim()} ${(user?.lastName ? user.lastName.trim() : '').trim()}`.trim();
    }

    async sendEmailCode(user: IUser): Promise<void> {
        try {

            const queryExistsUser = await this.collection.findOne({ email: user.email }, { projection: { email: 1 } });

            if (!queryExistsUser) {
                return
            }

            const code = await this.generateTempCode({ identifier: queryExistsUser.email, type: EnumTypeTempCode.START_SESSION });

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
                        border: 5px solid #FF6633; /* Borde sólido de 5px de ancho y color #FF6633 */
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

            this.sendEmail({ to: queryExistsUser.email, html, subject: "Código de inicio de sesión" });

            return;

        } catch (error: any) {
            throw new Error("Hemos tenido inconvenientes al cambiar su clave, por favor intente nuevamente.");
        }
    }

}

export { UsersService } 