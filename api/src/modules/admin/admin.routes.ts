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
        publicRouter.post("/sendEmailCode", adminRoutesValidations.validateSendCode(), this.adminController.sendEmailCode.bind(this.adminController))

        //PRIVATE ROUTES
        router.get("/me", this.adminController.me.bind(this.adminController));
        router.post("/client/register", adminRoutesValidations.clientRegister(),this.adminController.clientRegister.bind(this.adminController));
        router.put("/client/:_id", adminRoutesValidations.clientRegister(), this.adminController.updateClient.bind(this.adminController));
        router.get("/clients", adminRoutesValidations.getAllClients(), this.adminController.getAllClients.bind(this.adminController));
        router.use("/private", this.baseService.verifyTokenAdmin.bind(this.baseService));
        router.use("/private", router);


        router.use("/public", publicRouter);

        this.routes = router;
    }
}


export default AdminRouter