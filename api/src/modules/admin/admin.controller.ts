
import { Request, Response } from "express"
import { AdminService } from "./admin.service";
import { Db } from "mongodb";
import { CancelOrderType, IAdmin, IArticleImages, IClient, IOrderStatus, IPaginateClients, IPaginateOrders } from "../../interfaces";
import { UsersService } from "../users/users.service";
import { ArticleService } from "../articles/articles.service";
import { OrderService } from "../orders/orders.service";

class Admin {

    public readonly adminService: AdminService
    private readonly userService: UsersService
    private readonly articleService: ArticleService;
    private readonly orderService: OrderService;

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.adminService = new AdminService({ mongoDatabase });
        this.userService = new UsersService({ mongoDatabase });
        this.articleService = new ArticleService ({ mongoDatabase });
        this.orderService = new OrderService({ mongoDatabase });
    }


    async updateOrderStatus(req: Request, res: Response) {
        try {
            const { status }: { status: IOrderStatus } = req.body

            const result = await this.orderService.updateOrderStatus({ orderId: Number(req.params._id), status });

            return res.status(200).json({
                success: true,
                data: result,
                message: "Se ha actualizado de forma exitosa el estado de la orden."
            })

        } catch (error: any) {
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Ha ocurrido un error al actualizar el estado de la orden."
            })
        }
    }

    async articlesSummary (req: Request, res: Response) {
        try {

            const result = await this.articleService.articlesSummary();

            return res.status(200).json({
                success: true,
                data: result,
                message: "Resumen obtenido de forma exitosa."
            })

        } catch (_) {
            return res.status(512).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al obtener el resumen de los articulos."
            })
        }
    }
    async ordersSummary(req: Request, res: Response) {
        try {

            const query = req.query as unknown as {from: Date, to: Date}

            const result = await this.orderService.ordersSummary(query);

            return res.status(200).json({
                success: true,
                data: result,
                message: "Resumen obtenido de forma exitosa."
            })

        } catch (_) {
            return res.status(512).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al obtener el resumen de las ordenes."
            })
        }
    }
    async getAllClientsSummary (req: Request, res: Response) {
        try {

            const result = await this.userService.getAllClientsSummary();

            return res.status(200).json({
                success: true,
                data: result,
                message: "Resumen obtenido de forma exitosa."
            })

        } catch (_) {
            return res.status(512).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al obtener el resument de los clientes."
            })
        }
    }

    async cancelOrder(req: Request, res: Response) {
        try {
            const { type }: { type: CancelOrderType } = req.body
            const user: IAdmin = res.locals.admin;

            const result = await this.orderService.cancelOrder({ orderId: Number(req.params._id),type,user });
            
            return res.status(200).json({
                success: true,
                data: result,
                message: "Se ha cancelado de forma exitosa la orden."
            })

        } catch (_) {
            return res.status(512).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al cancelar la orden."
            })
        }
    }

    async printOrder(req: Request, res: Response) {
        try {

            const result = await this.orderService.printOrder({_id: Number(req.params._id)});
            return res.status(200).json({
                success: true,
                data: result,
                message: "Se ha imprimido de forma exitosa la orden."
            })

        } catch (_) {
            return res.status(512).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al imprimir la orden."
            })
        }
    }

    async getAllOrders (req: Request, res: Response) {
        try {

            const result = await this.orderService.getAllOrders({query: req.query as unknown as IPaginateOrders});

            return res.status(200).json({
                success: true,
                data: result,
                message: "Ordenes obtenidas de forma exitosa."
            })

        } catch (_) {
            return res.status(512).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al obtener las ordenes."
            })
        }
    }

    async createOrder (req: Request, res: Response) {
        try {

            const result =  await this.orderService.createOrder({body: req.body, user: res.locals.admin})

            return res.status(200).json({
                success: true,
                data: result,
                message: "Orden creada de forma exitosa."
            })
            
        } catch (error:any) {
            
            return res.status(512).json({
                success: false,
                data: null,
                message:  error.message
            })
        }
    }
    async createArticle (req: Request, res: Response) {
        try {

            
            const result =  await this.articleService.register({body: req.body, user: res.locals.admin})

            return res.status(200).json({
                success: true,
                data: result,
                message: "Artículo creado de forma exitosa."
            })
            
        } catch (_) {
            
            return res.status(512).json({
                success: false,
                data: null,
                message:  "Ha ocurrido un error al crear el artículo."
            })
        }
    }


    async getArticles (req: Request, res: Response) {
        try {

            
            const result =  await this.articleService.getArticles({query: req.query as unknown as IPaginateClients})

            return res.status(200).json({
                success: true,
                data: result,
                message: "Listado obtenido de forma exitosa"
            })
            
        } catch (_) {
            
            return res.status(200).json({
                success: false,
                data: null,
                message:  "Ha ocurrido un error al obtener los artículos."
            })
        }
    }

    async updateArticle (req: Request, res: Response) {
        try {

            const result =  await this.articleService.updateArticle({_id: Number(req.params._id), body: req.body, user: res.locals.admin})

            return res.status(200).json({
                success: true,
                data: result,
                message: "Artículo actualizado de forma exitosa"
            })
            
        } catch (_) {
            
            return res.status(200).json({
                success: false,
                data: null,
                message:  "Ha ocurrido un error al actualizar el artículo."
            })
        }
    }

    async deleteImage (req: Request, res: Response) {
        try {

            const result =  await this.adminService.deleteImage({id: req.params.id})

            return res.status(200).json({
                success: true,
                data: result,
                message: "Eliminado de forma exitosa"
            })
            
        } catch (_) {
            
            return res.status(200).json({
                success: false,
                data: null,
                message:  "Ha ocurrido un error al eliminar la imagen."
            })
        }
    }

    async uploadImage(req: Request, res: Response) {
        try {

            let arr : IArticleImages[] = []
            
            for(const file of req.files as any){
                const result = await this.adminService.uploadImage({file});
                arr.push({
                    id: result.id,
                    url: result.variants[0],
                    primary: false
                })
            }
            res.status(200).json({
                success: true,
                data: arr,
                message: "Guardado de forma exitosa",
            });

        } catch (error: any) {
            res.status(512).json({
                success: false,
                message: "Ocurrió un error al subir la imagen",
                error: error.message || error,
            });
        }
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


            const result = await this.userService.updateClient({ _id, body, user: res.locals.admin });

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

            const result = await this.userService.getAllClients({ query })

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