import { body, validationResult, param, query } from "express-validator"
import { Request, Response, NextFunction } from 'express';



const printOrder = () => {
    return [
        param("_id").isInt().toInt().withMessage("Por favor el '_id' de la orden."),
        validation
    ]
}

const creatOrderValidation = () => {
    return [
        body("articles").isArray({ min: 1 }).withMessage("Debe seleccionar al menos un artículo."),
        body("client._id").isInt().toInt().withMessage("Por favor incluir un cliente en la orden."),
        body("client.fullName").isString().withMessage("Por favor incluir el nombre del cliente en la orden."),
        body("client.fullClient").isString().withMessage("Por favor incluir un cliente en la orden."),
        body("client.email").isEmail().withMessage("Por favor incluir el correo del cliente en la orden."),
        body("client.address").isObject().withMessage("Por favor incluir la dirección del cliente en la orden."),
        body("paymentType").matches(/^Efectivo|Tarjeta|Transferencia$/).withMessage("Por favor incluir un tipo de pago en la orden."),
        body("status").matches(/^Pendiente|Entregado|Cancelada|Pagado|Preparando para entrega$/).withMessage("Por favor enviar un estado de la orden válido."),
        body("comment").optional().isString().withMessage("Por favor incluir un comentario en la orden."),
        validation
    ]
}

const paginatOrdersValidation = ()=>{
    return[
        query("page").isInt({min:1}).toInt().withMessage("Debe ingresar un número de página."),
        query("limit").isInt({min:1}).toInt().withMessage("Debe ingresar un número de límite."),
        query("status").optional().isString().withMessage("Debe ingresar un estado válido."),
        query("fullClient").optional().isString().withMessage("Debe ingresar un estado válido."),
        query("_id").optional().isInt({min:1}).toInt().withMessage("Debe ingresar un id."),
        validation
    ]
}

const validationSchemaArticleForm = () => {
    return [
      body('description').trim().notEmpty().withMessage('El nombre del artículo es requerida*.'),
      body('categories').isArray({ min: 1 }).withMessage('Debe seleccionar al menos una categoría*.'),
      body('categories.*._id').isNumeric().withMessage('La categoría es requerida*.'),
      body('categories.*.description').trim().notEmpty().withMessage('La descripción es requerida*.'),
      body('categories.*.slug').trim().notEmpty().withMessage('El slug es requerido*.'),
      body('variants').optional().isArray(),body('hasDiscount').optional().isBoolean(),
      body('discount').custom((value, { req }) => {
        if (req.body.hasDiscount) {
          if (!value || typeof value !== 'object') {
            throw new Error('El descuento es requerido o desmarque el descuento en el formulario*.');
          }
    
          if (!value.type || value.type.trim() === '') {
            throw new Error('El tipo de descuento es requerido*.');
          }
    
          if (value.value === undefined || value.value === null) {
            throw new Error('El valor de descuento es requerido*.');
          }
    
          if (value.hasExpiration && (!value.endDate || value.endDate.trim() === '')) {
            throw new Error('Debe seleccionar una fecha de finalización*.');
          }
        }
    
        return true;
      }),
      body('advertisement.type').trim().notEmpty().withMessage('El tipo del monto publicitario es requerido*.'),
      body('advertisement.value').isNumeric().withMessage('El valor de la publicidad es requerido*.'),
      body('published').optional().isBoolean(),
      body('shortDescription').trim().notEmpty().withMessage('La descripción es requerida*.'),
      body('tipTap').optional().trim(),
      body('images').optional().isArray()
    ];
}

const deleteImage = () => {
    return [
        param("id").isString().withMessage("El id de la imagen es obligatorio."),
        validation
    ]
}

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


const getAllArticles = () => {
    return [
        query("page").optional().isInt({ min: 1 }).toInt().withMessage("page debe ser un entero mayor o igual a 1"),
        query("limit").optional().isInt({ min: 1 }).toInt().withMessage("limit debe ser un entero mayor o igual a 1"),
        query("description").optional().isString().withMessage("description debe ser un string"),
        query("slug").optional().isString().withMessage("slug debe tener un formato válido"),
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

const summaryOrders = ()=>{
    return [
        query("from").isString().withMessage("Debe ingresar la fecha incial."),
        query("to").isString().withMessage("Debe ingresar la fecha final."),
        validation
    ]
}

export const adminRoutesValidations = {
    validateLogin,
    validateOrdersDetails,
    validateSendCode,
    clientRegister,
    getAllClients,
    deleteImage,
    validationSchemaArticleForm,
    getAllArticles,
    creatOrderValidation,
    paginatOrdersValidation,
    printOrder,
    summaryOrders
}