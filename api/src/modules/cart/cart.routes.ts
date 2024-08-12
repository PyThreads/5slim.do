import express from "express"
import { Cart } from "./cart.controller"
import { addItem, removeItem} from "./cart.validationSchema"
import { Db } from "mongodb"
import BaseService from "../../base/baseService"

const router = express.Router();


class CartRouter {

    public readonly routes: typeof router
    private readonly cartController: Cart
    private readonly baseService: BaseService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.cartController = new Cart({ mongoDatabase });
        this.baseService = new BaseService({mongoDatabase,tableName:"USERS"})

        router.use("/private",this.baseService.verifyToken.bind(this.baseService));
        router.use("/private",router);

        router.get("/private/getCartList",this.cartController.getCartList.bind(this.cartController))
        router.post("/private/addItem",addItem(),this.cartController.addItem.bind(this.cartController))
        router.delete("/private/removeItem",removeItem(),this.cartController.removeItem.bind(this.cartController))
        router.delete("/private/removeItemQuantity/:mercCodigo",removeItem(),this.cartController.removeItemQuantity.bind(this.cartController))

        this.routes = router;
    }
}


export default CartRouter