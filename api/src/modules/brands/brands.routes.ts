import express, { Request, Response } from "express";
import { BrandController } from "./brands.controller";
import { BrandService } from "./brands.service";
import { adminRoutesValidations } from "../admin/admin.validationSchema";
import { Db } from "mongodb";
import BaseService from "../../base/baseService";

const router = express.Router();
const publicRouter = express.Router();

class BrandsRouter {
    public readonly routes: typeof router;
    private readonly brandController: BrandController;
    private readonly baseService: BaseService;

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        const brandService = new BrandService({ mongoDatabase });
        this.brandController = new BrandController(brandService);
        this.baseService = new BaseService({ mongoDatabase, tableName: "BRANDS" });

        // PUBLIC ROUTES
        publicRouter.get("/", (req: Request, res: Response) => this.brandController.getPublicBrands(req, res));

        // PRIVATE ROUTES
        router.post(
            "/create",
            adminRoutesValidations.createBrandValidation(),
            (req: Request, res: Response) => this.brandController.createBrand(req, res)
        );

        router.put(
            "/:id",
            adminRoutesValidations.updateBrandValidation(),
            (req: Request, res: Response) => this.brandController.updateBrand(req, res)
        );

        router.get(
            "/",
            adminRoutesValidations.getAllBrandsValidation(),
            (req: Request, res: Response) => this.brandController.getBrands(req, res)
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

export default BrandsRouter