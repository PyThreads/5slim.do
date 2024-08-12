import express from "express"
import { Articles } from "./articles.controller"
import { paginateArticles,schemaBrandsAndModels } from "./articles.validationSchema"

const router = express.Router()


class ArticlesRouter {

    articlesController: Articles
    routes: typeof router

    constructor(){
        this.articlesController = new Articles();
        router.get("/", paginateArticles(), this.articlesController.getArticles.bind(this.articlesController))
        router.get("/categories", this.articlesController.getCategories.bind(this.articlesController))
        router.get("/years", this.articlesController.getYears.bind(this.articlesController))
        router.get("/brandAndModels",schemaBrandsAndModels(), this.articlesController.getBrandsAndModels.bind(this.articlesController))
        this.routes = router
    }
}

export default ArticlesRouter