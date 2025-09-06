
import { EVENTBUS, IArticlePublic, ICart } from "@/api/src/interfaces";
import { BaseService } from "@/app/utils/baseService";
import { eventBus } from "@/app/utils/broadcaster";

class CartService extends BaseService {


    async addToCart({ product }: { product: IArticlePublic }): Promise<ICart[]> {
        try {

            const cardItem: Partial<ICart> = {}

            const products = await this.getCart();

            const index = products.findIndex(item => item.article._id === product._id && product.variantId === item.article.variantId);

            if (index === -1) {

                cardItem.article = product;
                cardItem.createdDate = this.newDate();
                cardItem.article.stock = 1;

                products.push(cardItem as unknown as ICart)

            } else {
                const index = products.findIndex(item => item.article._id === product._id && product.variantId === item.article.variantId);
                const stock = products[index].article.stock + 1;

                if (stock > product.stock) {
                    eventBus.emit('publicAlert', {
                        message: `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`,
                        type: 'error'
                    });
                    return products;
                }

                products[index].article.stock = products[index].article.stock + 1;
            }

            window.localStorage.setItem("CART_WEB", JSON.stringify(products))
            eventBus.emit(EVENTBUS.UPDATE_CART, products)
            return products

        } catch (_) {
            throw _
        }
    }

    async removeFromCart({ productId }: { productId: string }): Promise<ICart[]> {
        try {
            const products = await this.getCart();
            const filteredProducts = products.filter(item => item.article._id !== productId);
            window.localStorage.setItem("CART_WEB", JSON.stringify(filteredProducts));
            return filteredProducts;
        } catch (_) {
            return [];
        }
    }

    async updateQuantity({ productId, quantity }: { productId: string, quantity: number }): Promise<ICart[]> {
        try {
            const products = await this.getCart();
            const index = products.findIndex(item => item.article._id === productId);

            if (index !== -1) {
                if (quantity <= 0) {
                    products.splice(index, 1);
                } else {
                    products[index].article.stock = quantity;
                }
            }

            window.localStorage.setItem("CART_WEB", JSON.stringify(products));
            return products;
        } catch (_) {
            return [];
        }
    }

    async clearCart(): Promise<void> {
        try {
            window.localStorage.removeItem("CART_WEB");
        } catch (_) {
            // Handle error silently
        }
    }

    async getCart(): Promise<ICart[]> {
        try {

            let cartList: ICart[] = []

            const localList = window.localStorage.getItem("CART_WEB")

            if (localList) {
                cartList = JSON.parse(localList) as unknown as ICart[]
            }

            return cartList;

        } catch (error) {
            return []
        }
    }

    getTotalPrice(cart: ICart[]): number {
        return cart.reduce((total, item) => total + (item.article.price * item.article.stock), 0);
    }

    getTotalItems(cart: ICart[]): number {
        return cart.reduce((total, item) => total + item.article.stock, 0);
    }
}

export const cartService = new CartService()
