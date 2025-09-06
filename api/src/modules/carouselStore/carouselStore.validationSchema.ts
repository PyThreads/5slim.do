import { body } from "express-validator";

export const carouselStoreValidationSchema = {
    create: [
        body('image').notEmpty().withMessage('La imagen es requerida'),
        body('title').notEmpty().withMessage('El título es requerido'),
        body('price').isNumeric().withMessage('El precio debe ser un número').toFloat(),
        body('originalPrice').optional().isNumeric().withMessage('El precio original debe ser un número').toFloat(),
        body('description').notEmpty().withMessage('La descripción es requerida'),
        body('buttonText').notEmpty().withMessage('El texto del botón es requerido'),
        body('buttonLink').notEmpty().withMessage('El enlace del botón es requerido')
    ],
    update: [
        body('image').optional(),
        body('title').optional(),
        body('price').optional().isNumeric().withMessage('El precio debe ser un número').toFloat(),
        body('originalPrice').optional().isNumeric().withMessage('El precio original debe ser un número').toFloat(),
        body('description').optional(),
        body('buttonText').optional(),
        body('buttonLink').optional()
    ]
};