import express from "express"
import { Admin } from "./admin.controller"
import { adminRoutesValidations } from "./admin.validationSchema"
import { Db } from "mongodb"
import BaseService from "../../base/baseService"

const router = express.Router();
const publicRouter = express.Router();


class AdminRouter {

    public readonly routes: typeof router
    private readonly adminController: Admin
    private readonly baseService: BaseService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.adminController = new Admin({ mongoDatabase });
        this.baseService = new BaseService({ mongoDatabase, tableName: "USERS" })

        //PUBLIC ROUTES
        publicRouter.post("/login", adminRoutesValidations.validateLogin(), this.adminController.login.bind(this.adminController))


        router.get("/me", this.adminController.me.bind(this.adminController));

        router.use("/private", this.baseService.verifyTokenAdmin.bind(this.baseService));
        router.use("/private", router);


        router.use("/public", publicRouter);

        this.routes = router;
    }
}


export default AdminRouter