import { body, validationResult, param } from "express-validator"
import { Request, Response, NextFunction } from 'express';


const submitPassword = () => {
    return [
        body('email').isString().withMessage("El correo de usuario es obligatorio."),
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


export {
    submitPassword
}