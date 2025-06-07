import * as Yup from "yup";

export const initialValuesClientForm = {
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    addresses: [
    ],

}

export const validationSchemaClientForm = Yup.object().shape({
    firstName: Yup.string().required('El nombre es requerido*.').trim(),
    lastName: Yup.string().required('El apellido es requerido*.').trim(),
    fullName: Yup.string().trim(),
    email: Yup.string().required('El correo es requerido*.').trim(),
    addresses: Yup.array().of(
        Yup.object().shape({
            type: Yup.string().required('El tipo de domicilio es requerido*.').trim(),
            name: Yup.string(),
            address: Yup.string().required('La dirección es requerida*.').trim(),
            city: Yup.string().required('La ciudad es requerida*.').trim(),
            county: Yup.string().required('El municipio es requerido*.').trim(),
            childCounty: Yup.string().required('El sector es requerido*.').trim(),
            phone: Yup.string().required('El teléfono es requerido*.').trim(),
            isMap: Yup.boolean(),
            map: Yup.object(),
            default: Yup.boolean().required('El domicilio es requerido*.'),
            country: Yup.string().trim()
        })
    )})