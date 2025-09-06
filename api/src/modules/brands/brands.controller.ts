import { Request, Response } from "express";
import { BrandService } from "./brands.service";
import { IAdmin } from "../../interfaces";

export class BrandController {
    private brandService: BrandService;

    constructor(brandService: BrandService) {
        this.brandService = brandService;
    }

    async getBrands(req: Request, res: Response) {
        try {
            const user = res.locals.admin as IAdmin;
            const result = await this.brandService.getBrands({ query: req.query, ownerId: user.ownerId });
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async createBrand(req: Request, res: Response) {
        try {
            const user = res.locals.admin as IAdmin;
            const result = await this.brandService.register({ body: req.body, user });
            res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async updateBrand(req: Request, res: Response) {
        try {
            const user = res.locals.admin as IAdmin;
            const _id = parseInt(req.params.id);
            const result = await this.brandService.updateBrand({ _id, body: req.body, user });
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getPublicBrands(req: Request, res: Response) {
        try {
            const brands = await this.brandService.getPublicBrands();
            
            res.status(200).json({
                success: true,
                data: brands,
                message: "Marcas públicas obtenidas exitosamente"
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