import { ICartArticle, ICartTotals, IOrder, IUser, IUserOrder } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { CartService } from "../cart/cart.service";
import { UsersService } from "../users/users.service";

class OrderService extends BaseService {

    cartService: CartService
    userService: UsersService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: "ORDERS" });
        this.cartService = new CartService({ mongoDatabase });
        this.userService = new UsersService({ mongoDatabase })

    }

    async orderDetail({ orderId }: { orderId: number }): Promise<IOrder | undefined> {

        try {

            return await this.collection.findOne({ _id: orderId }) as unknown as IOrder | undefined

        } catch (error: any) {
            this.logError(error)
        }
    }


    async newOrder({ user }: { user: IUser }): Promise<IOrder> {

        try {

            let newOrder: Partial<IOrder> = {};

            let userInOrder: Partial<IUserOrder> = {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,

            }

            const cartArticles = await this.cartService.getCartList({ userId: user._id });

            if (cartArticles.length < 1) {
                throw new Error("No tienes artículos agregados a tu carrito de compras.");
            }
            const totals: ICartTotals = this.cartService.getTotals({ user, cartArticles });
            const userAddress = await this.userService.getAddress({ userId: user._id });

            if (!userAddress) {
                throw new Error("Debes de agregar una dirección para poder procesar la orden");
            }
            userInOrder.address = userAddress
            newOrder.articles = cartArticles;
            newOrder.totals = totals;
            newOrder.user = userInOrder as IUserOrder;
            newOrder.status = "Creada",
            newOrder.paymentStatus = "Pendiente"

            const result = await this.insertOne({ body: newOrder });
            await this.cartService.clearFromCartOrderedItems({ itemsOrderedIds: cartArticles.map((item: ICartArticle) => item._id!) });
            return result as unknown as IOrder

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error buscando la dirección del usuario.");
        }
    }



    async myOrders({ user }: { user: IUser }): Promise<IOrder[]> {

        try {

            const result = await this.collection.find({ "user._id": user._id! }).toArray() as unknown as IOrder[];
            return result;

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error buscando las ordenes.");
        }
    }


    async allOrders(): Promise<IOrder[]> {

        try {

            const result = await this.collection.find().toArra() as unknown as IOrder[];
            return result;

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error buscando las ordenes.");
        }
    }



    // async removeItem({ userId,mercCodigo }: { userId: number,mercCodigo:number }): Promise<ICartArticle[]> {

    //     try {
    //         await this.collection.deleteOne({ userId: userId,Merc_Codigo:mercCodigo })
    //         return await this.getCartList({ userId});

    //     } catch (error: any) {
    //         throw new Error(error?.message || "Ha ocurrido un error eliminando el articulo del carrito de compras.");
    //     }
    // }

    // async removeItemQuantity({ userId,mercCodigo }: { userId: number,mercCodigo:number }): Promise<ICartArticle[]> {

    //     try {
    //         const filter = { userId, Merc_Codigo: mercCodigo };

    //         const exists = await this.collection.findOne(filter, { projection: { Cant: 1 } });

    //         if(!exists){
    //             return await this.getCartList({ userId});
    //         }

    //         if(exists.Cant === 1){

    //             this.removeItem({userId,mercCodigo});

    //         } else {

    //             await this.collection.updateOne(filter, { $set: { Cant: exists.Cant - 1 } });
    //         }

    //         return await this.getCartList({ userId});

    //     } catch (error: any) {
    //         throw new Error(error?.message || "Ha ocurrido un error actualizando la cantidad del articulo.");
    //     }
    // }

    // async getCartList({ userId }: { userId: number }): Promise<ICartArticle[]> {
    //     try {

    //         const result = await this.collection.find({ userId: userId }).toArray();
    //         return result as ICartArticle[]

    //     } catch (error: any) {
    //         throw new Error(error?.message || "Ha ocurrido un error buscando los artículos.");
    //     }
    // }


}

export { OrderService } 