
import bcrypt from "bcrypt"
import BaseService from "../../base/baseService";
import { Db } from "mongodb";

class AdminService extends BaseService {


    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: "ADMIN" });
    }


    async login({ username, password }: { username: string, password: string }) {

        try {

            const user = await this.collection.findOne({ email: username })

            if (!user) {
                throw new Error("No existe un administrador con el correo: " + username);
            }

            const passwordMatch = await this.verifyPassword({ password, hash: user.password! });

            if (!passwordMatch) {
                throw new Error("La clave no coincide por favor verifique e intente de nuevo.");
            }

            delete user.password
            user.token = this.generateToken(user);

            return user;

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error al autenticar tu usuario.");
        }
    }

    /**
     * Registra un nuevo usuario.
     * @param {IUser} userToRegister - El usuario que se va a registrar.
     * @returns {Promise<IUser>} - Una promesa que resuelve con el usuario registrado.
     */

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