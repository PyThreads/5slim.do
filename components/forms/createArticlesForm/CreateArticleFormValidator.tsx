import * as Yup from "yup";

export const initialValuesArticleForm = {
    description: "",
    category1: {},
    category2: {},

    
}

export const validationSchemaArticleForm = Yup.object().shape({
    description: Yup.string().required('El nombre del concurso es requerido.'),
    category1: Yup.object().shape({
        description: Yup.string().required('El nombre de la categoria es es requerido.'),
        _id: Yup.string().required('El nombre del concurso es requerido.'),
    })
})