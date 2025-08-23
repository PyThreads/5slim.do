import express, { Request, Response } from "express";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { adminRoutesValidations } from "../admin/admin.validationSchema";
import { Db } from "mongodb";
import BaseService from "../../base/baseService";

const router = express.Router();

class CategoriesRouter {
    public readonly routes: typeof router;
    private readonly categoriesController: CategoriesController;
    private readonly baseService: BaseService;

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        const categoriesService = new CategoriesService({ mongoDatabase });
        this.categoriesController = new CategoriesController({ categoriesService });
        this.baseService = new BaseService({ mongoDatabase, tableName: "CATEGORIES" });

        // Apply middleware first
        router.use("/", this.baseService.verifyTokenAdmin.bind(this.baseService));
        router.use("/", (req: Request, res: Response, next) => {
            req.body.user = res.locals.admin;
            next();
        });

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

        this.routes = router;
    }
}

export default CategoriesRouter