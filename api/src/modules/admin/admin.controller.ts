
import { Request, Response } from "express"
import { AdminService } from "./admin.service";
import { Db } from "mongodb";
import { IAdmin, IClient, IPaginateClients } from "../../interfaces";
import { UsersService } from "../users/users.service";

class Admin {

    public readonly adminService: AdminService
    private readonly userService : UsersService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.adminService = new AdminService({ mongoDatabase });
        this.userService = new UsersService({ mongoDatabase });
    }

    async clientRegister(req: Request, res: Response) {
        try {

            const newClient = req.body as unknown as IClient
            const admin = res.locals.admin as unknown as IAdmin
            const client = await this.userService.register({ body: newClient, user: admin });

            res.status(200).json({
                success: true,
                data: client,
                message: "Se ha registrado de forma exitosa la información del cliente."
            })

        } catch (error: any) {

            res.status(512).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al obtener los datos del administrador."
            })
        }
    }

    async updateClient(req: Request, res: Response) {
        try {

            const body = req.body as unknown as IClient
            const _id = req.params._id as unknown as number


            const result = await this.userService.updateClient({_id,body,user: res.locals.admin});

            res.status(200).json({
                success: true,
                data: result,
                message: "Cliente actualizado de forma exitosa."
            })

        } catch (error: any) {

            res.status(512).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al actualizar los datos del cliente."
            })
        }
    }

    async getAllClients(req: Request, res: Response) {
        try {

            const query = req.query as unknown as IPaginateClients

            const result = await this.userService.getAllClients({query})

            res.status(200).json({
                success: true,
                data: result,
                message: "Clientes obtenidos de forma exitosa."
            })

        } catch (error: any) {

            res.status(512).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al obtener los clientes."
            })
        }
    }

    async me(req: Request, res: Response) {
        try {

            const user = await this.adminService.collection.findOne({ _id: res.locals.admin._id })

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

    async sendEmailCode(req: Request, res: Response) {
        try {

            const { username }: { username: string } = req.body;

            const response = await this.adminService.sendEmailCode({ email: username! });

            res.status(200).json({
                success: true,
                data: response,
                message: "Enviado de forma exitosa."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al enviar el código."
            })

        }
    }

}

export { Admin };