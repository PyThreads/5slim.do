import { Router } from "express";
import { CarouselStoreController } from "./carouselStore.controller";
import { carouselStoreValidationSchema } from "./carouselStore.validationSchema";
import { Db } from "mongodb";
import BaseService from "../../base/baseService";
import { COLLNAMES } from "../../interfaces";

class CarouselStoreRoutes {
    public readonly routes: Router;
    private controller: CarouselStoreController;
    private baseService: BaseService;

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.routes = Router();
        this.controller = new CarouselStoreController({ mongoDatabase });
        this.baseService = new BaseService({ mongoDatabase, tableName: COLLNAMES.CAROUSEL_STORE });
        
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.routes.post("/", this.baseService.verifyTokenAdmin.bind(this.baseService), carouselStoreValidationSchema.create, this.controller.create.bind(this.controller));
        this.routes.put("/:id", this.baseService.verifyTokenAdmin.bind(this.baseService), carouselStoreValidationSchema.update, this.controller.update.bind(this.controller));
        this.routes.delete("/:id", this.baseService.verifyTokenAdmin.bind(this.baseService), this.controller.delete.bind(this.controller));
        this.routes.get("/", this.baseService.verifyTokenAdmin.bind(this.baseService), this.controller.getAll.bind(this.controller));
        this.routes.get("/public", this.controller.getPublicSlides.bind(this.controller));
    }
}

export default CarouselStoreRoutes;