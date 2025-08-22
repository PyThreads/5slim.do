import * as Yup from "yup";

export const initialValuesClientForm = {
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phone: "",
    addresses: [
    ],

}

export const validationSchemaClientForm = Yup.object().shape({
    firstName: Yup.string().required('El nombre es requerido*.').trim(),
    lastName: Yup.string().required('El apellido es requerido*.').trim(),
    fullName: Yup.string().trim(),
    email: Yup.string().required('El correo es requerido*.').trim(),
    phone: Yup.string().required('El teléfono es requerido*.').trim(),
    addresses: Yup.array().of(
        Yup.object().shape({
            type: Yup.string().trim(),
            name: Yup.string(),
            address: Yup.string().trim(),
            city: Yup.string().trim(),
            county: Yup.string().trim(),
            childCounty: Yup.string().trim(),
            phone: Yup.string().trim(),
            isMap: Yup.boolean(),
            map: Yup.object(),
            default: Yup.boolean(),
            country: Yup.string().trim()
        })
    )})