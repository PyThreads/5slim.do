import * as Yup from "yup";

export const initialValuesArticleForm = {
    description: "",
    categories: [],
    variants: [],
    hasDiscount: "",
    discount: {
        type: "",
        value: "",
        endDate: "",
        hasExpiration: false
    },
    published: true,
    shortDescription: "",
    tipTap: "",
    advertisement: {
        type: "",
        value: ""
    },
    images: []
}

export const validationSchemaArticleForm = Yup.object().shape({
    description: Yup.string()
        .required('El nombre del articulo es requerida*.')
        .trim(),

    categories: Yup.array()
        .of(
            Yup.object().shape({
                _id: Yup.number().required('La categoría es requerida*.'),
                description: Yup.string().required('La descripción es requerida*.').trim(),
                slug: Yup.string().required('El slug es requerido*.').trim(),
            }).required('La categoría es requerida*.')
        ).min(1, 'Debe seleccionar al menos una categoría*.')
        .required('Debe seleccionar al menos una categoría*.'),
        
    variants: Yup.array(),

    hasDiscount: Yup.boolean(),

    discount: Yup.mixed().when('hasDiscount', {
        is: true,
        then: () =>
            Yup.object().shape({
                type: Yup.string()
                    .required('El tipo de descuento es requerido*.')
                    .trim(),

                value: Yup.number()
                    .required('El valor de descuento es requerido*.'),

                hasExpiration: Yup.boolean(),

                endDate: Yup.string().when('hasExpiration', {
                    is: true,
                    then: () =>
                        Yup.string().required('Debe seleccionar una fecha de finalización*.').trim(),
                    otherwise: () => Yup.string().nullable(),
                }),
            }).required('El descuento es requerido o desmarque el descuento en el formulario*.'),
        otherwise: () =>
            Yup.object().shape({
                type: Yup.string().nullable(),
                value: Yup.string().nullable(),
                endDate: Yup.string().nullable(),
                hasExpiration: Yup.boolean().nullable(),
            }),
    }),
    advertisement: Yup.object().shape({
        type: Yup.string()
            .required('El tipo de del monto publicitario es requerido*.')
            .trim(),

        value: Yup.number()
            .required('El valor de de la publicidad es requerido*.')
    }).required('El valor de la publicidad es requerido*.'),

    published: Yup.boolean(),

    shortDescription: Yup.string()
        .required('La descripción es requerida*.')
        .trim(),

    tipTap: Yup.string().trim(),
    images: Yup.array()
});