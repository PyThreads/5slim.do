import { body, validationResult,param } from "express-validator"
import { Request, Response, NextFunction } from 'express';


const validateLogin = () => {
    return [
        body('username').isString().withMessage("El nombre de usuario es obligatorio."),
        body('password').isString().withMessage("La clave es obligatoria."),
        validation
    ]
}

const validateOrdersDetails = () => {
    return [
        param('orderId').isInt().toInt().withMessage("El nombre de usuario es obligatorio."),
        validation
    ]
}

const validateAddPaymentLink = () => {
    return [
        param('orderId').isInt().toInt().withMessage("El nombre de usuario es obligatorio."),
        body('paymentLink').isString().withMessage("Debe enviar el link de pago"),
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


export const adminRoutesValidations =  {
    validateLogin,
    validateOrdersDetails,
    validateAddPaymentLink
}