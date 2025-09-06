
import { Request, Response } from "express"
import { AdminService } from "./admin.service";
import { Db } from "mongodb";
import { CancelOrderType, IAdmin, IArticleImages, IClient, IOrderStatus, IPaginateClients, IPaginateOrders, IArticlesVariants } from "../../interfaces";
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

            const admin: IAdmin = res.locals.admin;
            const result = await this.orderService.updateOrderStatus({ orderId: Number(req.params._id), status, user: admin });

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

    async bulkUpdateOrderStatus(req: Request, res: Response) {
        try {
            const { orderIds, status }: { orderIds: number[], status: IOrderStatus } = req.body;

            const admin: IAdmin = res.locals.admin;
            for (const orderId of orderIds) {
                await this.orderService.updateOrderStatus({ orderId, status, user: admin });
            }

            return res.status(200).json({
                success: true,
                data: null,
                message: `Se han actualizado ${orderIds.length} órdenes a ${status}.`
            });

        } catch (error: any) {
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Ha ocurrido un error al actualizar las órdenes."
            });
        }
    }

    async updateOrderComment(req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const orderId = Number(req.params.orderId);
            const { comment }: { comment: string } = req.body;

            const result = await this.orderService.updateComment({ orderId, comment, user: admin });

            return res.status(200).json({
                success: true,
                data: result,
                message: "Comentario actualizado exitosamente."
            });

        } catch (error: any) {
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Error al actualizar el comentario."
            });
        }
    }

    async addPayment(req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const orderId = Number(req.params.orderId);
            const payment = req.body;

            const result = await this.orderService.addPayment({ orderId, payment, user: admin });

            return res.status(200).json({
                success: true,
                data: result,
                message: "Pago registrado exitosamente."
            });

        } catch (error: any) {
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Error al registrar el pago."
            });
        }
    }

    async articlesSummary (req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const result = await this.articleService.articlesSummary(admin.ownerId);

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
            const query = req.query as unknown as {from: Date, to: Date,user: IAdmin}
            query.user = res.locals.admin
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
            const admin: IAdmin = res.locals.admin;
            const result = await this.userService.getAllClientsSummary(admin);

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
            const result = await this.orderService.printOrder({_id: Number(req.params._id),ownerId: res.locals.admin.ownerId});
            res.setHeader('Content-Type', 'text/html');
            return res.send(result);
        } catch (error: any) {
            res.setHeader('Content-Type', 'text/html');
            return res.send(`<html><body><h1>Error</h1><p>${error.message || 'Ha ocurrido un error al imprimir la orden.'}</p></body></html>`);
        }
    }

    async printOrderLabel(req: Request, res: Response) {
        try {
            const result = await this.orderService.printOrderLabel({_id: Number(req.params._id), ownerId: res.locals.admin.ownerId});
            res.setHeader('Content-Type', 'text/html');
            return res.send(result);
        } catch (error: any) {
            res.setHeader('Content-Type', 'text/html');
            return res.send(`<html><body><h1>Error</h1><p>${error.message || 'Ha ocurrido un error al imprimir la etiqueta.'}</p></body></html>`);
        }
    }

    async printOrder72mm(req: Request, res: Response) {
        try {
            const result = await this.orderService.printOrder72mm({_id: Number(req.params._id), ownerId: res.locals.admin.ownerId});
            res.setHeader('Content-Type', 'text/html');
            return res.send(result);
        } catch (error: any) {
            res.setHeader('Content-Type', 'text/html');
            return res.send(`<html><body><h1>Error</h1><p>${error.message || 'Ha ocurrido un error al imprimir la factura 72mm.'}</p></body></html>`);
        }
    }

    async getAllOrders (req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const query = req.query as unknown as IPaginateOrders;
            const result = await this.orderService.getAllOrders({query, ownerId: admin.ownerId});

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
            const admin: IAdmin = res.locals.admin;
            req.body.ownerId = admin.ownerId;
            const result =  await this.orderService.createOrder({body: req.body, user: admin})

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
            
        } catch (error: any) {
            
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Ha ocurrido un error al crear el artículo."
            })
        }
    }


    async getArticles (req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const query = req.query as unknown as IPaginateClients;
            const result =  await this.articleService.getArticles({query, ownerId: admin.ownerId})

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

    async getArticlesForOrders (req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const query = req.query;
            const result = await this.articleService.getArticlesForOrders({query, ownerId: admin.ownerId})

            return res.status(200).json({
                success: true,
                data: result,
                message: "Artículos para órdenes obtenidos exitosamente"
            })
            
        } catch (_) {
            
            return res.status(512).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al obtener los artículos para órdenes."
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
            
        } catch (error: any) {
            
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Ha ocurrido un error al actualizar el artículo."
            })
        }
    }

    async addVariant(req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const articleId = Number(req.params.articleId);
            const variant = req.body;

            const result = await this.articleService.addVariant({
                articleId,
                variant,
                ownerId: admin.ownerId
            });

            return res.status(200).json({
                success: true,
                data: result,
                message: "Variante agregada exitosamente"
            });

        } catch (error: any) {
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Error al agregar variante"
            });
        }
    }

    async updateVariant(req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const articleId = Number(req.params.articleId);
            const variantId = req.params.variantId;
            const variant = req.body;

            const result = await this.articleService.updateVariant({
                articleId,
                variantId,
                variant,
                ownerId: admin.ownerId
            });

            return res.status(200).json({
                success: true,
                data: result,
                message: "Variante actualizada exitosamente"
            });

        } catch (error: any) {
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Error al actualizar variante"
            });
        }
    }

    async deleteVariant(req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const articleId = Number(req.params.articleId);
            const variantId = req.params.variantId;

            await this.articleService.deleteVariant({
                articleId,
                variantId,
                ownerId: admin.ownerId
            });

            return res.status(200).json({
                success: true,
                data: null,
                message: "Variante eliminada exitosamente"
            });

        } catch (error: any) {
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Error al eliminar variante"
            });
        }
    }

    async getVariants(req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            const articleId = Number(req.params.articleId);

            const variants = await this.articleService.getVariants({
                articleId,
                ownerId: admin.ownerId
            });

            return res.status(200).json({
                success: true,
                data: variants,
                message: "Variantes obtenidas exitosamente"
            });

        } catch (error: any) {
            return res.status(512).json({
                success: false,
                data: null,
                message: error.message || "Error al obtener variantes"
            });
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
            const admin: IAdmin = res.locals.admin;

            const result = await this.userService.getAllClients({ query, ownerId: admin.ownerId })

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

            const user = await this.adminService.collection.findOne(
                { _id: res.locals.admin._id },
                { projection: { password: 0 } } // Exclude password but include all other fields
            )

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

    async updateProfile(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, profilePicture, logo, businessName }: { firstName: string, lastName: string, email: string, profilePicture?: string, logo?: string, businessName?: string } = req.body;
            const adminId = res.locals.admin._id;

            const updatedAdmin = await this.adminService.updateProfile({ 
                adminId, 
                firstName,
                lastName, 
                email, 
                profilePicture,
                logo,
                businessName,
                user: res.locals.admin
            });

            res.status(200).json({
                success: true,
                data: updatedAdmin,
                message: "Perfil actualizado de forma exitosa."
            })

        } catch (error: any) {
            res.status(512).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al actualizar el perfil."
            })
        }
    }

    async createSystemUser(req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            
            // Verificar que el usuario tenga rol de Support
            if (!admin.role || !admin.role.includes("Support")) {
                return res.status(512).json({
                    success: false,
                    data: null, 
                    message: "No tienes permisos para crear usuarios del sistema."
                });
            }

            const userData = {
                ...req.body,
                userType: "Cliente",
                role: []
            };

            const result = await this.adminService.createSystemUser({ body: userData, user: admin });

            res.status(200).json({
                success: true,
                data: result,
                message: "Usuario del sistema creado exitosamente."
            });

        } catch (error: any) {
            res.status(512).json({
                success: false,
                data: null,
                message: error?.message || "Error al crear usuario del sistema."
            });
        }
    }

    async getAllSystemUsers(req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            
            if (!admin.role || !admin.role.includes("Support")) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "No tienes permisos para ver usuarios del sistema."
                });
            }

            const query = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 10,
                fullName: req.query.fullName as string
            };
            const result = await this.adminService.getAllSystemUsers(query);

            res.status(200).json({
                success: true,
                data: result,
                message: "Usuarios obtenidos exitosamente."
            });

        } catch (error: any) {
            res.status(512).json({
                success: false,
                data: null,
                message: error?.message || "Error al obtener usuarios."
            });
        }
    }

    async updateSystemUser(req: Request, res: Response) {
        try {
            const admin: IAdmin = res.locals.admin;
            
            if (!admin.role || !admin.role.includes("Support")) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "No tienes permisos para actualizar usuarios del sistema."
                });
            }

            const userId = Number(req.params._id);
            const result = await this.adminService.updateSystemUser({ userId, body: req.body, user: admin });

            res.status(200).json({
                success: true,
                data: result,
                message: "Usuario actualizado exitosamente."
            });

        } catch (error: any) {
            res.status(512).json({
                success: false,
                data: null,
                message: error?.message || "Error al actualizar usuario."
            });
        }
    }

  

}

export { Admin };