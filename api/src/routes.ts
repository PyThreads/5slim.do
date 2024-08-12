import express from "express"
import { Db } from "mongodb"

import ArticlesRouter from "./modules/articles/articles.routes"
import UserRouter  from "./modules/users/users.routes"
import CartRouter from "./modules/cart/cart.routes"
import OrderRouter from "./modules/order/order.routes"

const router = express.Router()

class RouterApp{

    public readonly routes: typeof router;

    constructor({mongoDatabase}: {mongoDatabase: Db}){

        router.use("/articles",new ArticlesRouter().routes);
        router.use("/users",new UserRouter({mongoDatabase}).routes);
        router.use("/cart",new CartRouter({mongoDatabase}).routes);
        router.use("/order",new OrderRouter({mongoDatabase}).routes);
        this.routes = router
    }

}

export default RouterApp