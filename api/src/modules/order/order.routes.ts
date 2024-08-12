import express from "express"
import { Order } from "./order.controller"
import { orderDetails } from "./order.validationSchema"
import { Db } from "mongodb"
import BaseService from "../../base/baseService"

const router = express.Router();
const publicRouter = express.Router();


class OrderRouter {

    public readonly routes: typeof router
    private readonly orderController: Order
    private readonly baseService: BaseService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.orderController = new Order({ mongoDatabase });
        this.baseService = new BaseService({ mongoDatabase, tableName: "USERS" });

        router.use("/private", this.baseService.verifyToken.bind(this.baseService));



        router.post("/private", this.orderController.newOrder.bind(this.orderController));
        router.get("/private/myOrders", this.orderController.myOrders.bind(this.orderController))
        publicRouter.get("/private/orderDetail/:orderId", orderDetails(), this.orderController.orderDetail.bind(this.orderController));

        publicRouter.get("/public/allOrders", this.orderController.allOrders.bind(this.orderController));

        
        router.use("/private", router);

        this.routes = router;
        this.routes.use(publicRouter)
    }
}


export default OrderRouter