import { body, validationResult, param, query } from "express-validator";
import { Request, Response, NextFunction } from 'express';

const getAllEmployees = () => {
    return [
        query("page").optional().isInt({ min: 1 }).toInt().withMessage("page debe ser un entero mayor o igual a 1"),
        query("limit").optional().isInt({ min: 1 }).toInt().withMessage("limit debe ser un entero mayor o igual a 1"),
        query("fullName").optional().isString().trim().withMessage("fullName debe ser un string"),
        query("email").optional().isEmail().normalizeEmail().withMessage("email debe tener un formato válido"),
        query("_id").optional().isInt({ min: 1 }).toInt().withMessage("_id debe ser un entero mayor o igual a 1"),
        validation
    ];
};

const createEmployee = () => {
    return [
        body('firstName').notEmpty().withMessage('El nombre es requerido.').isString().withMessage('El nombre debe ser texto.').trim().escape(),
        body('lastName').notEmpty().withMessage('El apellido es requerido.').isString().withMessage('El apellido debe ser texto.').trim().escape(),
        body('email').notEmpty().withMessage('El correo es requerido.').isEmail().withMessage('Debe ser un correo válido.').normalizeEmail(),
        body('userType').optional().isIn(['Cliente', 'Empleado']).withMessage('El tipo de usuario debe ser Cliente o Empleado'),
        body('profilePicture').optional().isString().withMessage('La imagen de perfil debe ser una URL válida'),
        validation
    ];
};

const updateEmployee = () => {
    return [
        param("id").isInt({ min: 1 }).toInt().withMessage("El id del empleado es obligatorio y debe ser un número válido"),
        body('firstName').optional().isString().withMessage('El nombre debe ser texto.').trim().escape(),
        body('lastName').optional().isString().withMessage('El apellido debe ser texto.').trim().escape(),
        body('email').optional().isEmail().withMessage('Debe ser un correo válido.').normalizeEmail(),
        body('userType').optional().isIn(['Cliente', 'Empleado']).withMessage('El tipo de usuario debe ser Cliente o Empleado'),
        body('profilePicture').optional().isString().withMessage('La imagen de perfil debe ser una URL válida'),
        validation
    ];
};

const deleteEmployee = () => {
    return [
        param("id").isInt({ min: 1 }).toInt().withMessage("El id del empleado es obligatorio y debe ser un número válido"),
        validation
    ];
};

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

export const employeeValidations = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};