import express from "express"
import { Admin } from "./admin.controller"
import { adminRoutesValidations } from "./admin.validationSchema"
import { Db } from "mongodb"
import BaseService from "../../base/baseService"
import { utils } from "../../utils"
import createEmployeesRoutes from "./employees.routes"
import CategoriesRouter from "../categories/categories.routes"

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
        router.put("/profile", this.adminController.updateProfile.bind(this.adminController));

        router.post("/orders/create", adminRoutesValidations.creatOrderValidation(), this.adminController.createOrder.bind(this.adminController));
        router.get("/orders", adminRoutesValidations.paginatOrdersValidation(), this.adminController.getAllOrders.bind(this.adminController));
        router.get("/orders/print/:_id", adminRoutesValidations.printOrder(), this.adminController.printOrder.bind(this.adminController));
        router.get("/orders/print-label/:_id", adminRoutesValidations.printOrder(), this.adminController.printOrderLabel.bind(this.adminController));
        router.put("/orders/cancel/:_id", adminRoutesValidations.printOrder(), this.adminController.cancelOrder.bind(this.adminController));
        router.get("/orders/summary", adminRoutesValidations.summaryOrders(), this.adminController.ordersSummary.bind(this.adminController));
        router.put("/orders/status/:_id", this.adminController.updateOrderStatus.bind(this.adminController));
        router.put("/orders/bulk-status", this.adminController.bulkUpdateOrderStatus.bind(this.adminController));
        router.put("/orders/:orderId/comment", this.adminController.updateOrderComment.bind(this.adminController));

        router.post("/client/register", adminRoutesValidations.clientRegister(), this.adminController.clientRegister.bind(this.adminController));
        router.put("/client/:_id", adminRoutesValidations.clientRegister(), this.adminController.updateClient.bind(this.adminController));
        router.get("/clients", adminRoutesValidations.getAllClients(), this.adminController.getAllClients.bind(this.adminController));
        router.get("/clients/summary", this.adminController.getAllClientsSummary.bind(this.adminController));

        router.post("/images/upload", utils.uploadFiles, this.adminController.uploadImage.bind(this.adminController));
        router.delete("/images/delete/:id", adminRoutesValidations.deleteImage(), this.adminController.deleteImage.bind(this.adminController));

        router.post("/articles/register", adminRoutesValidations.validationSchemaArticleForm(), this.adminController.createArticle.bind(this.adminController));
        router.put("/articles/update/:_id", adminRoutesValidations.validationSchemaArticleForm(), this.adminController.updateArticle.bind(this.adminController));
        router.get("/articles", adminRoutesValidations.getAllArticles(), this.adminController.getArticles.bind(this.adminController));
        router.get("/articles/summary", this.adminController.articlesSummary.bind(this.adminController));
        
        router.post("/articles/:articleId/variants", this.adminController.addVariant.bind(this.adminController));
        router.put("/articles/:articleId/variants/:variantId", this.adminController.updateVariant.bind(this.adminController));
        router.delete("/articles/:articleId/variants/:variantId", this.adminController.deleteVariant.bind(this.adminController));
        router.get("/articles/:articleId/variants", this.adminController.getVariants.bind(this.adminController));

        router.use("/private", this.baseService.verifyTokenAdmin.bind(this.baseService));
        router.use("/private", createEmployeesRoutes({mongoDatabase}));
        router.use("/private/categories", new CategoriesRouter({mongoDatabase}).routes);
        router.use("/private", router);
        router.use("/public", publicRouter);

        this.routes = router;
    }
}


export default AdminRouter