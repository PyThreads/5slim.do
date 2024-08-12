import { IChangePasswordBody, ISubmitPassword, IUser, IUserAddress } from "../../interfaces";
import bcrypt from "bcrypt"
import BaseService from "../../base/baseService";
import { Db } from "mongodb";

class UsersService extends BaseService {

    private addressServiceBase: BaseService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: "USERS" });
        this.addressServiceBase = new BaseService({ mongoDatabase, tableName: "ADDRESS" })
    }


    async changePassword({ user, body }: { user: IUser, body: IChangePasswordBody }): Promise<void> {

        try {
            await this.login({ username: user.email, password: body.password })
            const newPassword = await this.hashPasword(body.newPassword);
            await this.collection.updateOne({ _id: user._id }, { $set: { password: newPassword } });

        } catch (error: any) {
            this.handleError(error)
        }
    }

    async personalInformation({ userId, body }: { userId: number, body: Partial<IUser> }): Promise<IUser | undefined> {

        try {
            body.fullName = body.name + " " + body.lastName
            const { value }: { value: IUser | undefined } = await this.collection.findOneAndUpdate({ _id: userId }, { $set: body }, { returnDocument: 'after' })
            return value;
        } catch (error: any) {
            this.handleError(error)
        }
    }

    async getAddress({ userId }: { userId: number }): Promise<IUserAddress | null> {

        try {
            const address = await this.addressServiceBase.collection.findOne({ userId: userId })
            return address as IUserAddress | null
        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error buscando la dirección del usuario.");
        }
    }

    async addAddress({ userId, body }: { userId: number, body: IUserAddress }): Promise<IUserAddress> {

        try {

            body.userId = userId;

            let result;

            if (body._id) {
                result = await this.addressServiceBase.collection.updateOne({ _id: body._id }, { $set: body });
                result = body;
            } else {
                result = await this.addressServiceBase.insertOne({ body });
            }

            return body as any as IUserAddress

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error al guardar tu dirección tu usuario.");
        }
    }

    async login({ username, password }: { username: string, password: string }) {

        try {

            const user = await this.collection.findOne({ email: username })

            if (!user) {
                throw new Error("No existe un usuario con el correo: " + username);
            }

            const passwordMatch = await this.verifyPassword({ password, hash: user.password! });

            if (!passwordMatch) {
                throw new Error("La clave no coincide por favor verifique e intente de nuevo.");
            }

            delete user.password
            user.fullName = user.name + " " + user.lastName
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

            userToRegister.password = await this.hashPasword(userToRegister.password!);

            await this.insertOne({ body: userToRegister });
            return userToRegister

        } catch (error) {
            throw error
        }
    }


    async submitPassword(body: ISubmitPassword): Promise<void> {
        try {


            const isValid = await this.validateTempCode({ type: "recoverPassword", identifier: body.email, code: body.code });

            if (!isValid) {
                throw new Error("El código no coincide con nuestros registros.");
            }

            const newPassword = await this.hashPasword(body.password);

            await this.collection.updateOne({ email: body.email }, { $set: { password: newPassword } });
            return;

        } catch (error) {
            throw error
        }
    }

    async sendEmailCode(user: IUser): Promise<void> {
        try {

            const queryExistsUser = await this.collection.findOne({ email: user.email }, { projection: { email: 1 } });

            if (!queryExistsUser) {
                return
            }

            const code = await this.generateTempCode({ identifier: queryExistsUser.email, type: "recoverPassword" });

            const html = `

            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Código de Cambio de Contraseña</title>
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
                        border: 5px solid #FF6633; /* Borde sólido de 15px de ancho y color #FF6633 */
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
                        <h1>Cambio de Contraseña</h1>
                    </div>
                    <div class="content">
                        <p>Hemos recibido una solicitud para cambiar la contraseña de su cuenta.</p>
                        <p>Su código de verificación es:</p>
                        <p class="code" id="verificationCode">${code}</p>
                        <p>Utilice este código para cambiar su clave.</p>
                    </div>
                    <div class="footer">
                        <p>Este correo ha sido enviado automáticamente. Por favor, no responda a este correo.</p>
                    </div>
                </div>
            </body>
            </html>
            
        `;

            this.sendEmail({ to: [queryExistsUser.email], html, subject: "Cambio de clave" });

            return;

        } catch (error: any) {
            throw new Error(error.message || "Hemos tenido inconvenientes al cambiar su clave, por favor intente nuevamente.");
        }
    }

    async hashPasword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash
    }


    async verifyPassword({ password, hash }: { password: string, hash: string }) {

        try {

            return await bcrypt.compare(password, hash);

        } catch (error) {
            throw new Error("Ha ocurrido un error al verificar la clave.")
        }
    }



}

export { UsersService } 