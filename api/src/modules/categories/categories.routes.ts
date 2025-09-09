import express, { Request, Response } from "express";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { adminRoutesValidations } from "../admin/admin.validationSchema";
import { Db } from "mongodb";
import BaseService from "../../base/baseService";

const router = express.Router();
const publicRouter = express.Router();

class CategoriesRouter {
    public readonly routes: typeof router;
    private readonly categoriesController: CategoriesController;
    private readonly baseService: BaseService;

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        const categoriesService = new CategoriesService({ mongoDatabase });
        this.categoriesController = new CategoriesController({ categoriesService });
        this.baseService = new BaseService({ mongoDatabase, tableName: "CATEGORIES" });

        // PUBLIC ROUTES
        publicRouter.get("/", (req: Request, res: Response) => this.categoriesController.getPublicCategories(req, res));

        // PRIVATE ROUTES
        router.post(
            "/create",
            adminRoutesValidations.createCategoryValidation(),
            (req: Request, res: Response) => this.categoriesController.createCategory(req, res)
        );

        router.put(
            "/:_id",
            adminRoutesValidations.updateCategoryValidation(),
            (req: Request, res: Response) => this.categoriesController.updateCategory(req, res)
        );

        router.get(
            "/",
            adminRoutesValidations.getAllCategoriesValidation(),
            (req: Request, res: Response) => this.categoriesController.getAllCategories(req, res)
        );

        // Apply authentication middleware to private routes
        router.use("/private", this.baseService.verifyTokenAdmin.bind(this.baseService));
        router.use("/private", (req: Request, res: Response, next) => {
            res.locals.admin = res.locals.admin;
            next();
        });
        
        router.use("/private", router);
        router.use("/public", publicRouter);

        this.routes = router;
    }
}

export default CategoriesRouter