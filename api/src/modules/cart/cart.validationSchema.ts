import { body, param, validationResult } from "express-validator"
import { Request, Response, NextFunction } from 'express';


const removeItem = () => {

    return [
        param('mercCodigo').isInt().toInt().notEmpty().withMessage("El id del articulo es obligatorio."),
        validation
    ]
}

const addItem = () => {

    return [
        body('Cant').isNumeric().toInt().withMessage("La cantidad es obligatoria."),
        body('Marca').isString().withMessage("La marca del vehículo del articulo es obligatoria."),
        body('Merc_Ano').isString().withMessage("El año es obligatorio."),
        body('Merc_Codigo').isInt().toInt().withMessage("El código del articulo es obligatorio"),
        body('Merc_Referencia').isString().optional().withMessage("La referencia debe ser un texto."),
        body('Modelo').isString().withMessage("El modelo del vehículo del articulo es obligatorio."),
        body('Precio').isFloat().toFloat().withMessage("El precio del articulo es obligatorio."),
        body('PrecioItbis').isFloat().toFloat().withMessage("El Itbis del precio es obligatorio."),
        body('Precio2').isFloat().toFloat().withMessage("El precio2 del articulo es obligatorio."),
        body('PrecioItbis2').isFloat().toFloat().withMessage("El Itbis2 del articulo es obligatorio."),
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


export { addItem, removeItem }