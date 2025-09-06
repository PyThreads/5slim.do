import express from "express"
import { Db } from "mongodb"

import AdminRouter from "./modules/admin/admin.routes"
import CarouselStoreRoutes from "./modules/carouselStore/carouselStore.routes"
import ArticleRoutes from "./modules/articles/articles.routes"
import CategoriesRouter from "./modules/categories/categories.routes"
import BrandsRouter from "./modules/brands/brands.routes"

const router = express.Router()

class RouterApp{

    public readonly routes: typeof router;

    constructor({mongoDatabase}: {mongoDatabase: Db}){

        router.use("/admin",new AdminRouter({mongoDatabase}).routes);
        router.use("/carouselStore", new CarouselStoreRoutes({mongoDatabase}).routes);
        router.use("/articles", new ArticleRoutes({mongoDatabase}).routes);
        router.use("/categories", new CategoriesRouter({mongoDatabase}).routes);
        router.use("/brands", new BrandsRouter({mongoDatabase}).routes);
        this.routes = router
    }

}

export default RouterApp