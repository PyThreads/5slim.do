import { query, validationResult } from "express-validator"
import { Request, Response, NextFunction } from 'express';


const paginateArticles = () => {

    return [
        query("page").toInt().isInt({ min: 1 }).withMessage("El query page debe ser un número entero válido y mayor o igual a 1."),
        query("limit").toInt().isInt({ min: 1 }).withMessage("El query limit debe ser un número entero válido y mayor o igual a 1."),
        query("description").optional().isString().withMessage("El query description debe ser una cadena de texto válida."),
        query("category").optional().isString().withMessage("El query category debe ser una cadena de texto válida."),
        query("year").optional().isInt().toInt().withMessage("El query year debe ser un número entero válido."),
        query("model").optional().isString().withMessage("El query model debe ser una cadena de texto válida."),
        query("brand").optional().isString().withMessage("El query brand debe ser una cadena de texto válida."),
        validation
    ]
}

const schemaBrandsAndModels = () => {
    return [
        query("brand").optional().isString().withMessage("El query brand debe ser una cadena de texto válida."),
        validation
    ]
}

const validation = (req: Request, res: Response, next: NextFunction) => {
    const errors: any[] = validationResult(req).array();

    if (errors.length === 0) {
        return next();
    }

    const errorMessage = errors[0].msg;

    return res.status(422).json({
        success: false,
        data: null,
        message: errorMessage
    });
};


export { paginateArticles, schemaBrandsAndModels }