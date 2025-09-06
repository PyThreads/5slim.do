import { Router } from "express";
import { ArticleController } from "./articles.controller";
import { Db } from "mongodb";

class ArticleRoutes {
    public readonly routes: Router;
    private controller: ArticleController;

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.routes = Router();
        this.controller = new ArticleController({ mongoDatabase });
        
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.routes.get("/featured", this.controller.getFeaturedArticles.bind(this.controller));
    }
}

export default ArticleRoutes;