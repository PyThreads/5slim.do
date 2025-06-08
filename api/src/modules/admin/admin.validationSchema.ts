import { body, validationResult, param, query } from "express-validator"
import { Request, Response, NextFunction } from 'express';


const getAllClients = () => {
    return [
        query("page").optional().isInt({ min: 1 }).toInt().withMessage("page debe ser un entero mayor o igual a 1"),
        query("limit").optional().isInt({ min: 1 }).toInt().withMessage("limit debe ser un entero mayor o igual a 1"),
        query("fullName").optional().isString().withMessage("fullName debe ser un string"),
        query("email").optional().isEmail().withMessage("email debe tener un formato válido"),
        query("active").optional().isBoolean().withMessage("active debe ser true o false").toBoolean(),
        query("_id").optional().isInt({ min: 1 }).toInt().withMessage("_id debe ser un entero mayor o igual a 1"),
        validation
    ]
}

const clientRegister = () => {
    return [
        param("_id").optional().isInt().toInt().withMessage("El id de usuario es obligatorio."),
        body('firstName').notEmpty().withMessage('El nombre es requerido.').isString().withMessage('El nombre debe ser texto.').trim(),
        body('lastName').notEmpty().withMessage('El apellido es requerido.').isString().withMessage('El apellido debe ser texto.').trim(),
        body('fullName').optional().isString().withMessage('El nombre completo debe ser texto.').trim(),
        body('email').notEmpty().withMessage('El correo es requerido.').isEmail().withMessage('Debe ser un correo válido.').trim(),
        body('addresses.*.type').notEmpty().withMessage('El tipo de domicilio es requerido.').isString().trim(),
        body('addresses.*.name').optional().isString().trim(),
        body('addresses.*.address').notEmpty().withMessage('La dirección es requerida.').isString().trim(),
        body('addresses.*.city').notEmpty().withMessage('La ciudad es requerida.').isString().trim(),
        body('addresses.*.county').notEmpty().withMessage('El municipio es requerido.').isString().trim(),
        body('addresses.*.childCounty').notEmpty().withMessage('El sector es requerido.').isString().trim(),
        body('addresses.*.phone').notEmpty().withMessage('El teléfono es requerido.').isString().withMessage('El teléfono debe ser texto.'.trim()),
        body('addresses.*.isMap').isBoolean().withMessage('isMap debe ser booleano.'),
        body('addresses.*.default').isBoolean().withMessage('default debe ser booleano.'),
        body('addresses.*.map').optional().custom((value) => {
            if (typeof value !== 'object') throw new Error('El mapa debe ser un objeto');
            const requiredFields = ['address', 'city', 'lat', 'lng', 'url', 'place_id'];
            for (const field of requiredFields) {
                if (!(field in value)) {
                    throw new Error(`El mapa debe incluir el campo '${field}'`);
                }
            }
            return true;
        }),
        validation
    ]
}

const validateLogin = () => {
    return [
        body('username').isString().withMessage("El nombre de usuario es obligatorio."),
        body('password').isString().withMessage("La clave es obligatoria."),
        validation
    ]
}

const validateSendCode = () => {
    return [
        body('username').isString().withMessage("El nombre de usuario es obligatorio."),
        validation
    ]
}

const validateOrdersDetails = () => {
    return [
        param('orderId').isInt().toInt().withMessage("El nombre de usuario es obligatorio."),
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


export const adminRoutesValidations = {
    validateLogin,
    validateOrdersDetails,
    validateSendCode,
    clientRegister,
    getAllClients
}