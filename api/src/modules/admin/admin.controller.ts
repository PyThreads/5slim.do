
import { Request, Response } from "express"
import { AdminService } from "./admin.service";
import { Db } from "mongodb";

class Admin {

    public readonly adminService: AdminService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.adminService = new AdminService({ mongoDatabase });
    }

    async me(req: Request, res: Response) {
        try {

            const user = await this.adminService.collection.findOne({ _id: res.locals.user._id })

            delete user.password
            user.token = this.adminService.generateToken(user);

            res.status(200).json({
                success: true,
                data: user,
                message: "Se ha obtenido de forma exitosa la información del administrador."
            })

        } catch (error: any) {

            res.status(401).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al obtener los datos del administrador."
            })

        }
    }

    async login(req: Request, res: Response) {
        try {

            const { username, password }: { username: string, password: string } = req.body;

            const response = await this.adminService.login({ username, password });

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

}

export { Admin };