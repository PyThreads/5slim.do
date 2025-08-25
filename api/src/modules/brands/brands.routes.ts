import express, { Request, Response } from "express";
import { BrandController } from "./brands.controller";
import { BrandService } from "./brands.service";
import { adminRoutesValidations } from "../admin/admin.validationSchema";
import { Db } from "mongodb";
import BaseService from "../../base/baseService";

const router = express.Router();

class BrandsRouter {
    public readonly routes: typeof router;
    private readonly brandController: BrandController;
    private readonly baseService: BaseService;

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        const brandService = new BrandService({ mongoDatabase });
        this.brandController = new BrandController(brandService);
        this.baseService = new BaseService({ mongoDatabase, tableName: "BRANDS" });

        router.use("/", this.baseService.verifyTokenAdmin.bind(this.baseService));
        router.use("/", (req: Request, res: Response, next) => {
            req.body.user = res.locals.admin;
            next();
        });

        router.post(
            "/create",
            adminRoutesValidations.createCategoryValidation(),
            (req: Request, res: Response) => this.brandController.createBrand(req, res)
        );

        router.put(
            "/:id",
            adminRoutesValidations.updateCategoryValidation(),
            (req: Request, res: Response) => this.brandController.updateBrand(req, res)
        );

        router.get(
            "/",
            adminRoutesValidations.getAllCategoriesValidation(),
            (req: Request, res: Response) => this.brandController.getBrands(req, res)
        );

        this.routes = router;
    }
}

export default BrandsRouter