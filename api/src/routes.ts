import express from "express"
import { Db } from "mongodb"

import AdminRouter from "./modules/admin/admin.routes"
import CategoriesRouter from "./modules/categories/categories.routes"

const router = express.Router()

class RouterApp{

    public readonly routes: typeof router;

    constructor({mongoDatabase}: {mongoDatabase: Db}){

        router.use("/admin",new AdminRouter({mongoDatabase}).routes);
        router.use("/categories", new CategoriesRouter({mongoDatabase}).routes);
        this.routes = router
    }

}

export default RouterApp