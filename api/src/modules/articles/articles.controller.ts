import { Request, Response } from "express";
import { ArticleService } from "./articles.service";
import { Db } from "mongodb";

export class ArticleController {
    private articleService: ArticleService;

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.articleService = new ArticleService({ mongoDatabase });
    }

    async getFeaturedArticles(req: Request, res: Response) {
        try {
            const result = await this.articleService.getArticlesFeatured();
            res.status(200).json({
                success: true,
                data: result,
                message: "Artículos destacados obtenidos exitosamente"
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error?.message || "Error al obtener artículos destacados"
            });
        }
    }
}