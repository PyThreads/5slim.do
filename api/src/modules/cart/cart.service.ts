import { ICartArticle, ICartTotals, IUser } from "../../interfaces";
import BaseService from "../../base/baseService";
import { Db } from "mongodb";

class CartService extends BaseService {

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: "CART" });
    }

    async clearFromCartOrderedItems({ itemsOrderedIds }: { itemsOrderedIds: number[] }): Promise<void> {
        await this.collection.deleteMany({ _id: { $in: itemsOrderedIds } })
    }

    async addItem({ cartItem, userId }: { cartItem: ICartArticle, userId: number }): Promise<ICartArticle[]> {

        try {

            const filter = { userId, Merc_Codigo: cartItem.Merc_Codigo }

            const exists = await this.collection.findOne(filter, { projection: { Cant: 1 } })

            if (exists) {
                await this.collection.updateOne(filter, { $set: { Cant: exists.Cant + cartItem.Cant } });
            } else {
                cartItem.userId = filter.userId;
                await this.insertOne({ body: cartItem })
            }

            return await this.getCartList({ userId: userId });


        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error buscando la dirección del usuario.");
        }
    }

    async removeItem({ userId, mercCodigo }: { userId: number, mercCodigo: number }): Promise<ICartArticle[]> {

        try {
            await this.collection.deleteOne({ userId: userId, Merc_Codigo: mercCodigo })
            return await this.getCartList({ userId });

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error eliminando el articulo del carrito de compras.");
        }
    }

    async removeItemQuantity({ userId, mercCodigo }: { userId: number, mercCodigo: number }): Promise<ICartArticle[]> {

        try {
            const filter = { userId, Merc_Codigo: mercCodigo };

            const exists = await this.collection.findOne(filter, { projection: { Cant: 1 } });

            if (!exists) {
                return await this.getCartList({ userId });
            }

            if (exists.Cant === 1) {

                this.removeItem({ userId, mercCodigo });

            } else {

                await this.collection.updateOne(filter, { $set: { Cant: exists.Cant - 1 } });
            }

            return await this.getCartList({ userId });

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error actualizando la cantidad del articulo.");
        }
    }

    async getCartList({ userId }: { userId: number }): Promise<ICartArticle[]> {
        try {

            const result = await this.collection.find({ userId: userId }).toArray();
            return result as ICartArticle[]

        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error buscando los artículos.");
        }
    }

    getTotals({ user, cartArticles }: { user: IUser | null, cartArticles: ICartArticle[] }): ICartTotals {

        let totals = { total: 0, tax: 0, subTotal: 0 }

        cartArticles.map((oneItem: ICartArticle) => {

            totals.subTotal = totals.subTotal + (user ? oneItem.Precio2 : oneItem.Precio) * oneItem.Cant!
            totals.tax = totals.tax + (user ? ((oneItem.PrecioItbis2) - (oneItem.Precio2)) : ((oneItem.PrecioItbis || 0) - (oneItem.Precio))) * oneItem.Cant!
            totals.total = totals.total + (user ? oneItem.PrecioItbis2 : oneItem.PrecioItbis) * oneItem.Cant!

        })

        return totals
    }


}

export { CartService } 