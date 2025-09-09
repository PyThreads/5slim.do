import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";
import { IAdmin, ICategory } from "../../interfaces";

class CategoriesController {
    private categoriesService: CategoriesService;

    constructor({ categoriesService }: { categoriesService: CategoriesService }) {
        this.categoriesService = categoriesService;
    }

    async createCategory(req: Request, res: Response) {
        try {
            const user: IAdmin = res.locals.admin;
            const body: ICategory = req.body;
            
            const category = await this.categoriesService.createCategory({ body, user });
            
            res.status(201).json({
                success: true,
                data: category,
                message: "Categoría creada exitosamente"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    async updateCategory(req: Request, res: Response) {
        try {
            const user: IAdmin = res.locals.admin;
            const body: ICategory = req.body;
            const _id = parseInt(req.params._id);
            
            const category = await this.categoriesService.updateCategory({ _id, body, user });
            
            res.status(200).json({
                success: true,
                data: category,
                message: "Categoría actualizada exitosamente"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    async getAllCategories(req: Request, res: Response) {
        try {
            const user: IAdmin = res.locals.admin;
            const query = req.query;
            
            const categories = await this.categoriesService.getAllCategories({ 
                query: query as any, 
                ownerId: user.ownerId 
            });
            
            res.status(200).json({
                success: true,
                data: categories,
                message: "Categorías obtenidas exitosamente"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    async getPublicCategories(req: Request, res: Response) {
        try {
            const categories = await this.categoriesService.getPublicCategories();
            
            res.status(200).json({
                success: true,
                data: categories,
                message: "Categorías públicas obtenidas exitosamente"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }
}

export { CategoriesController }