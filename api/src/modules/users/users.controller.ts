
import { Request, Response } from "express"
import { UsersService } from "./users.service";
import { ISubmitPassword, IUser } from "../../interfaces";
import { Db } from "mongodb";

class Users {

    public readonly usersService: UsersService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.usersService = new UsersService({ mongoDatabase });
    }

    async personalInformation(req: Request, res: Response) {
        try {

            const user = res.locals.user;
            const response = await this.usersService.personalInformation({ userId: user._id, body: req.body });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se han actualizado correctamente sus datos."
            })

        } catch (error: any) {

            res.status(401).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al actualizar sus datos."
            })

        }
    }

    async changePassword(req: Request, res: Response) {
        try {

            const user = res.locals.user

            await this.usersService.changePassword({ user, body: req.body });

            res.status(200).json({
                success: true,
                data: null,
                message: "Se ha cambiado correctamente su clave."
            })

        } catch (error: any) {

            res.status(401).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al cambiar su clave."
            })

        }
    }

    async me(req: Request, res: Response) {
        try {

            const user = await this.usersService.collection.findOne({ _id: res.locals.user._id })

            delete user.password
            user.token = this.usersService.generateToken(user);

            res.status(200).json({
                success: true,
                data: user,
                message: "Se ha obtenido de forma exitosa la información del usuario."
            })

        } catch (error: any) {

            res.status(401).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al obtener los datos del usuario."
            })

        }
    }

    async getAddress(req: Request, res: Response) {
        try {

            const response = await this.usersService.getAddress({ userId: res.locals.user._id });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha obtenido de forma exitosa la dirección."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al autenticar sus credenciales."
            })

        }
    }

    async addAddress(req: Request, res: Response) {
        try {

            const body = req.body;
            const result = await this.usersService.addAddress({ body, userId: res.locals.user._id,user: res.locals.user });

            res.status(200).json({
                success: true,
                data: result,
                message: "Se ha guardado la dirección de forma exitosa."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al autenticar sus credenciales."
            })

        }
    }

    async login(req: Request, res: Response) {
        try {

            const { username, password }: { username: string, password: string } = req.body;

            const response = await this.usersService.login({ username, password });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha autenticado de forma exitosa."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al autenticar sus credenciales."
            })

        }
    }

    async register(req: Request, res: Response) {

        try {

            const userToRegister: IUser = req.body;

            const response = await this.usersService.register(userToRegister);

            res.status(200).json({
                success: true,
                data: response,
                message: "Felicidades, te has registrado correctamente."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al registrarte en nuestra pagina web. por favor llámanos!"
            })

        }

    }


    async submitPassword(req: Request, res: Response) {

        try {

            const body: ISubmitPassword = req.body;

            await this.usersService.submitPassword(body);

            res.status(200).json({
                success: true,
                data: null,
                message: "Se ha actualizado correctamente su clave."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error cambiando tu clave."
            })

        }

    }

    async sendEmailCode(req: Request, res: Response) {

        try {

            const body: IUser = req.body;

            await this.usersService.sendEmailCode(body);

            res.status(200).json({
                success: true,
                data: null,
                message: "Se han enviado las instrucciones al correo."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error cambiando tu clave."
            })

        }

    }
}

export { Users };
