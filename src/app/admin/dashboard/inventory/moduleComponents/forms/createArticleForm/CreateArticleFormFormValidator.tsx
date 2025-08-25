import * as Yup from "yup";

export const initialValuesArticleForm = {
    description: "",
    externalCode: "",
    categories: [],
    brand: null,
    variants: [],
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

    externalCode: Yup.string()
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
    published: Yup.boolean(),
    shortDescription: Yup.string()
        .required('La descripción es requerida*.')
        .trim(),

    tipTap: Yup.string().trim(),
    images: Yup.array()
});