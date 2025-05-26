import express from "express"
import {
    submitPassword,
} from "./categories.validationSchema"
import { Db } from "mongodb"
import BaseService from "../../base/baseService"

const router = express.Router();
const publicRouter = express.Router();


class CategoriesRouter {

    public readonly routes: typeof router
    private readonly baseService: BaseService


    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.baseService = new BaseService({ mongoDatabase, tableName: "BRANDS_CATEGORIES" })



        router.use("/private", this.baseService.verifyTokenAdmin.bind(this.baseService))
        router.use("/private", router);
        new BaseService({mongoDatabase,tableName: "BRANDS_CATEGORIES",app:router,prefix: "/",functionProps: {createValidation: submitPassword}})

        router.use("/public", publicRouter);

        this.routes = router;
    }
}


export default CategoriesRouter