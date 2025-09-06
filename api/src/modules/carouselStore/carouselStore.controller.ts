import { Request, Response } from "express";
import { CarouselStoreService } from "./carouselStore.service";
import { Db } from "mongodb";

export class CarouselStoreController {
    private carouselStoreService: CarouselStoreService;

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.carouselStoreService = new CarouselStoreService({ mongoDatabase });
    }

    async create(req: Request, res: Response) {
        try {
            const result = await this.carouselStoreService.createCarouselSlide({
                body: req.body,
                user: res.locals.admin
            });
            res.status(200).json({
                success: true,
                data: result,
                message: "Slide creado exitosamente"
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error?.message || "Error al crear slide"
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await this.carouselStoreService.updateCarouselSlide({
                _id: req.params.id,
                body: req.body,
                user: res.locals.admin
            });
            res.status(200).json({
                success: true,
                data: result,
                message: "Slide actualizado exitosamente"
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error?.message || "Error al actualizar slide"
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const result = await this.carouselStoreService.deleteCarouselSlide({
                _id: req.params.id,
                user: res.locals.admin
            });
            res.status(200).json({
                success: true,
                data: result,
                message: "Slide eliminado exitosamente"
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error?.message || "Error al eliminar slide"
            });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const { page, limit } = req.query;
            const result = await this.carouselStoreService.getAllCarouselSlides({
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 10
            });
            res.status(200).json({
                success: true,
                data: result,
                message: "Slides obtenidos exitosamente"
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error?.message || "Error al obtener slides"
            });
        }
    }

    async getPublicSlides(req: Request, res: Response) {
        try {
            const result = await this.carouselStoreService.getPublicSlides();
            res.status(200).json({
                success: true,
                data: result,
                message: "Slides obtenidos exitosamente"
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                data: null,
                message: error?.message || "Error al obtener slides"
            });
        }
    }
}