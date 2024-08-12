import { param, validationResult } from "express-validator"
import { Request, Response, NextFunction } from 'express';


const orderDetails = () => {

    return [
        param('orderId').isInt().toInt().notEmpty().withMessage("El número de orden es obligatorio."),
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

export { orderDetails }