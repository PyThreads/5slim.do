
import { Request, Response } from "express"
import { CartService } from "./cart.service";
import { Db } from "mongodb";

class Cart {

    public readonly cartService: CartService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.cartService = new CartService({ mongoDatabase });
    }


    async addItem(req: Request, res: Response) {
        try {

            const response = await this.cartService.addItem({ userId: res.locals.user._id, cartItem: req.body });

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

    async removeItem(req: Request, res: Response) {
        try {

            const response = await this.cartService.removeItem({ userId: res.locals.user._id, mercCodigo: Number(req.params.mercCodigo) });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha eliminado de forma exitosa el artículo."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al autenticar sus credenciales."
            })

        }
    }


    async removeItemQuantity(req: Request, res: Response) {
        try {

            const { mercCodigo } = req.params;

            const response = await this.cartService.removeItemQuantity({ userId:res.locals.user._id, mercCodigo: Number(mercCodigo) });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha actualizado la cantidad de forma exitosa."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al autenticar sus credenciales."
            })

        }
    }

    async getCartList(req: Request, res: Response) {
        try {

            const response = await this.cartService.getCartList({ userId: res.locals.user._id });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha obtenido de forma exitosa la lista de artículos."
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

export { Cart };
