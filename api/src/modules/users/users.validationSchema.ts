import { body, validationResult } from "express-validator"
import { Request, Response, NextFunction } from 'express';


const addAddressValidation = () => {

    return [
        body('name').isString().notEmpty().withMessage("El nombre es obligatorio."),
        body('lastName').isString().notEmpty().withMessage("El apellido es obligatorio."),
        body('address1').isString().withMessage("La dirección es obligatoria."),
        body('city').isString().notEmpty().withMessage("La ciudad es obligatoria."),
        body('county').isString().notEmpty().withMessage("El municipio es obligatorio."), // La contraseña es opcional en este esquema
        body('childCounty').isString().notEmpty().withMessage("El sector es obligatorio."),
        body('phone').isString().notEmpty().withMessage("El teléfono es obligatoria."), // La contraseña es opcional en este esquema
        validation
    ]
}

const updatePersonalInfoValidation = () => {

    return [
        body('name').isString().notEmpty().withMessage("El nombre es obligatorio."),
        body('lastName').isString().notEmpty().withMessage("El apellido es obligatorio."),
        body('email').isString().notEmpty().withMessage("El correo es obligatorio."),
        validation
    ]
}

const changePasswordValidation = () => {

    return [
        body('password').isString().notEmpty().withMessage("El la clave actual es obligatoria."),
        body('newPassword').isString().notEmpty().withMessage("La nueva clave es obligatoria."),
        validation
    ]
}

const registerUser = () => {

    return [
        body('name').isString().notEmpty().withMessage("El nombre es obligatorio."),
        body('lastName').isString().notEmpty().withMessage("El apellido es obligatorio."),
        body('email').isEmail().withMessage("El correo es obligatorio."),
        body('phone').isString().withMessage("El teléfono es obligatorio."),
        body('password').isString().withMessage("La clave es obligatoria."), // La contraseña es opcional en este esquema
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

const forgotPasswordValidation = () => {
    return [
        body('email').isString().withMessage("El correo del usuario es obligatorio."),
        validation
    ]
}

const submitPassword = () => {
    return [
        body('email').isString().withMessage("El correo de usuario es obligatorio."),
        body('code').isString().withMessage("El código de validación es obligatorio."),
        body("password").isString().withMessage("La nueva clave es obligatoria."),
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
    registerUser,
    validateLogin,
    forgotPasswordValidation,
    submitPassword, addAddressValidation,
    changePasswordValidation,
    updatePersonalInfoValidation
}