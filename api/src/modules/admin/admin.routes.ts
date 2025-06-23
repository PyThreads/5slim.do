import express, { Request, Response } from "express"
import { Admin } from "./admin.controller"
import { adminRoutesValidations } from "./admin.validationSchema"
import { Db } from "mongodb"
import BaseService from "../../base/baseService"
import { utils } from "../../utils"

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

        router.post("/client/register", adminRoutesValidations.clientRegister(), this.adminController.clientRegister.bind(this.adminController));
        router.put("/client/:_id", adminRoutesValidations.clientRegister(), this.adminController.updateClient.bind(this.adminController));
        router.get("/clients", adminRoutesValidations.getAllClients(), this.adminController.getAllClients.bind(this.adminController));

        router.post("/images/upload", utils.uploadFiles, this.adminController.uploadImage.bind(this.adminController));
        router.delete("/images/delete/:id", adminRoutesValidations.deleteImage(), this.adminController.deleteImage.bind(this.adminController));

        router.post("/articles/register", adminRoutesValidations.validationSchemaArticleForm(), this.adminController.createArticle.bind(this.adminController));
        router.put("/articles/update/:_id", adminRoutesValidations.validationSchemaArticleForm(), this.adminController.updateArticle.bind(this.adminController));
        router.get("/articles", adminRoutesValidations.getAllArticles(), this.adminController.getArticles.bind(this.adminController));

        router.use("/private", this.baseService.verifyTokenAdmin.bind(this.baseService));
        router.use("/private", router);
        router.use("/public", publicRouter);

        this.routes = router;
    }
}


export default AdminRouter