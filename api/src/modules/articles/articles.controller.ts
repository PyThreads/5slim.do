
import { Request, Response } from "express"
import { ArticlesService } from "./articles.service";
import { IPaginateArticles } from "../../interfaces";

class Articles {

    public articlesService: ArticlesService

    constructor() {
        this.articlesService = new ArticlesService()
    }


    async getCategories(req: Request, res: Response) {
        try {

            const response = await this.articlesService.getCategories();

            res.status(200).json({
                success: true,
                data: response,
                message: "Se han obtenido correctamente las categorías."
            })

        } catch (_error) {

            res.status(510).json({
                success: false,
                data: null,
                message: "Hemos tenido un error al obtener las categorías, por favor intenta nuevamente."
            })

        }
    }

    async getArticles(req: Request, res: Response) {
        try {
            const query = req.query as unknown as IPaginateArticles;

            const response = await this.articlesService.getArticles(query);

            res.status(200).json({
                success: true,
                data: response,
                message: "Se han obtenido correctamente los artículos."
            })

        } catch (_error) {

            res.status(510).json({
                success: false,
                data: null,
                message: "Hemos tenido un error al obtener los artículos, por favor intenta nuevamente."
            })

        }
    }

    async getYears(req: Request,res: Response){

        try {

            const response = await this.articlesService.getYears();

            res.status(200).json({
                success: true,
                data: response,
                message: "Se han obtenido correctamente los años."
            })

        } catch (_error) {

            res.status(510).json({
                success: false,
                data: null,
                message: "Hemos tenido un error al obtener los años, por favor intenta nuevamente."
            })

        }

    }

    async getBrandsAndModels(req: Request,res: Response){

        try {

            const query = req.query as unknown as Partial<IPaginateArticles>;

            const response = await this.articlesService.getBrandsAndModels(query);

            res.status(200).json({
                success: true,
                data: response,
                message: "Se han obtenido correctamente las marcas y modelos."
            })

        } catch (_error) {

            res.status(510).json({
                success: false,
                data: null,
                message: "Hemos tenido un error al obtener las marcas y modelos."
            })

        }

    }

}

export { Articles };
