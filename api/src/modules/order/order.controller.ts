
import { Request, Response } from "express"
import { OrderService } from "./order.service";
import { Db } from "mongodb";

class Order {

    public readonly orderService: OrderService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.orderService = new OrderService({ mongoDatabase });
    }


    async orderDetail(req: Request, res: Response) {
        try {

            const { orderId } = req.params

            const response = await this.orderService.orderDetail({ orderId: Number(orderId) });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha obtenido de forma exitosa su orden."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al obtener su orden."
            })

        }
    }
    async newOrder(req: Request, res: Response) {
        try {

            const response = await this.orderService.newOrder({ user: res.locals.user });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha creado de forma exitosa su orden."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al procesar su orden."
            })

        }
    }

    async myOrders(req: Request, res: Response) {
        try {

            const response = await this.orderService.myOrders({ user: res.locals.user });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha obtenido de forma exitosa su listado de ordenes."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al obtener sus ordenes."
            })

        }
    }

    async allOrders(req: Request, res: Response) {
        try {

            const response = await this.orderService.allOrders();

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha obtenido de forma exitosa el listado de ordenes."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al obtener las ordenes."
            })

        }
    }


    // async removeItem(req: Request, res: Response) {
    //     try {

    //         const response = await this.cartService.removeItem({ userId: res.locals.user._id, mercCodigo: Number(req.params.mercCodigo) });

    //         res.status(200).json({
    //             success: true,
    //             data: response,
    //             message: "Se ha eliminado de forma exitosa el artículo."
    //         })

    //     } catch (error: any) {

    //         res.status(510).json({
    //             success: false,
    //             data: null,
    //             message: error?.message || "Ha ocurrido un error al autenticar sus credenciales."
    //         })

    //     }
    // }


    // async removeItemQuantity(req: Request, res: Response) {
    //     try {

    //         const { mercCodigo } = req.params;

    //         const response = await this.cartService.removeItemQuantity({ userId:res.locals.user._id, mercCodigo: Number(mercCodigo) });

    //         res.status(200).json({
    //             success: true,
    //             data: response,
    //             message: "Se ha actualizado la cantidad de forma exitosa."
    //         })

    //     } catch (error: any) {

    //         res.status(510).json({
    //             success: false,
    //             data: null,
    //             message: error?.message || "Ha ocurrido un error al autenticar sus credenciales."
    //         })

    //     }
    // }

    // async getCartList(req: Request, res: Response) {
    //     try {

    //         const response = await this.cartService.getCartList({ userId: res.locals.user._id });

    //         res.status(200).json({
    //             success: true,
    //             data: response,
    //             message: "Se ha obtenido de forma exitosa la lista de artículos."
    //         })

    //     } catch (error: any) {

    //         res.status(510).json({
    //             success: false,
    //             data: null,
    //             message: error?.message || "Ha ocurrido un error al autenticar sus credenciales."
    //         })

    //     }
    // }


}

export { Order };
