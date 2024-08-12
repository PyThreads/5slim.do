import axiosInstance from "../../context/axiosInstance";
import { IArticle, ICartArticle, ICartTotals, IUser } from "../../interfaces";

class CartService {
    constructor() {

    }

    formatMoney(amount: number): string {
        const formatter = new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP'
        });

        return formatter.format(amount);
    }

    getFullArticleName(article:ICartArticle): string{
        return `${article.Merc_Nombre} para ${article.Marca} ${article.Modelo} ${article.Merc_Ano}`.toUpperCase();
    }
    
    getAmountFormattedArticle(user:IUser | null,article:ICartArticle){
    return this.formatMoney((user ? article.PrecioItbis2! : article.PrecioItbis!) * article.Cant)
    }

    getTotals({user,cartArticles}:{user:IUser | null,cartArticles:ICartArticle[]}): ICartTotals{
        
        let totals = { total: 0, tax: 0, subTotal: 0 }

        cartArticles.map((oneItem: ICartArticle) => {

            totals.subTotal = totals.subTotal + (user ? oneItem.Precio2 : oneItem.Precio) * oneItem.Cant!
            totals.tax = totals.tax + (user ? ((oneItem.PrecioItbis2) - (oneItem.Precio2)) : ((oneItem.PrecioItbis || 0) - (oneItem.Precio))) * oneItem.Cant!
            totals.total = totals.total + (user ? oneItem.PrecioItbis2 : oneItem.PrecioItbis) * oneItem.Cant!

        })

        return totals
    }
    

    addItemLocal(item: IArticle, subtract = false): ICartArticle[] {

        let cartArticle: ICartArticle = {
            Merc_Codigo: item.Merc_Codigo!,
            Merc_Referencia: item.Merc_Referencia!,
            Merc_Codigo_Barra: item.Merc_Codigo_Barra!,
            Merc_Nombre: item.Merc_Nombre!,
            Marca: item.Marca!,
            Modelo: item.Modelo!,
            Merc_Ano: item.Merc_Ano!,
            Precio: item.Precio!,
            PrecioItbis: item.PrecioItbis!,
            Precio2: item.Precio2!,
            PrecioItbis2: item.PrecioItbis2!,
            Cant: 1
        }

        let listLocalChart = window.localStorage.getItem("cart");
        let arrList: ICartArticle[] = [];

        if (listLocalChart) {
            arrList = JSON.parse(listLocalChart);

            const index = arrList.findIndex(art => art.Merc_Codigo === cartArticle.Merc_Codigo);

            if (index !== -1) {

                subtract ? arrList[index].Cant-- : arrList[index].Cant++;

                if (arrList[index].Cant === 0) {
                    arrList.splice(index, 1)
                }

            } else {
                arrList.push(cartArticle);
            }

        } else {
            arrList.push(cartArticle);
        }

        window.localStorage.setItem("cart", JSON.stringify(arrList))

        return arrList
    }

    getLocalCart(): ICartArticle[]{

        let listLocalChart = window.localStorage.getItem("cart");
        let arrList: ICartArticle[] = listLocalChart ? JSON.parse(listLocalChart)  : []
        return arrList;
    }

    clearLocalCart(){
        window.localStorage.removeItem("cart")
    }


    async addItem(item: IArticle): Promise<{ data: ICartArticle[], message: string }> {

        let cartArticle: ICartArticle = {
            Merc_Codigo: item.Merc_Codigo!,
            Merc_Referencia: item.Merc_Referencia!,
            Merc_Codigo_Barra: item.Merc_Codigo_Barra!,
            Merc_Nombre: item.Merc_Nombre!,
            Marca: item.Marca!,
            Modelo: item.Modelo!,
            Merc_Ano: item.Merc_Ano!,
            Precio: item.Precio!,
            PrecioItbis: item.PrecioItbis!,
            Precio2: item.Precio2!,
            PrecioItbis2: item.PrecioItbis2!,
            Cant: 1
        }

        const { data } = await axiosInstance.post("/cart/private/addItem", cartArticle);
        return {
            data: data.data as ICartArticle[],
            message: data.message as string,
        };
    }

    async removeItem({ mercCodigo }: { mercCodigo: number }): Promise<{ data: ICartArticle[], message: string }> {

        const { data } = await axiosInstance.delete(`/cart/private/removeItem/${mercCodigo}`);
        return {
            data: data.data as ICartArticle[],
            message: data.message as string,
        };

    }

    async removeQuantity({ mercCodigo }: { mercCodigo: number }): Promise<{ data: ICartArticle[], message: string }> {

        const { data } = await axiosInstance.delete(`/cart/private/removeItemQuantity/${mercCodigo}`);
        return {
            data: data.data as ICartArticle[],
            message: data.message as string,
        };

    }


    async getCartList(): Promise<{ data: ICartArticle[], message: string }> {

        const { data } = await axiosInstance.get(`/cart/private/getCartList`);
        return {
            data: data.data as ICartArticle[],
            message: data.message as string,
        };

    }
}


const cartService: CartService = new CartService();

export { cartService }
