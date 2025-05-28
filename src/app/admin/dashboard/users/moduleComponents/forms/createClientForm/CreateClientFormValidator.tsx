import * as Yup from "yup";

export const initialValuesClientForm = {
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phone: "",
    addresses: [
        {
            name: "",
            address: "",
            city: "",
            county: "",
            childCounty: "",
            phone: "",
            type: "",
            isMap: false,
            mapAddress: "",
            default: false
        }
    ],

}

export const validationSchemaClientForm = Yup.object().shape({
    firstName: Yup.string().required('El nombre es requerido.'),
    lastName: Yup.string().required('El apellido es requerido.'),
    fullName: Yup.string().required('El nombre completo es requerido.'),
    email: Yup.string().required('El correo es requerido.'),
    phone: Yup.string().required('El teléfono es requerido.'),
    addresses: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('El nombre es requerido.'),
            address: Yup.string().required('La dirección es requerida.'),
            city: Yup.string().required('La ciudad es requerida.'),
            county: Yup.string().required('El municipio es requerido.'),
            childCounty: Yup.string().required('El sector es requerido.'),
            phone: Yup.string().required('El teléfono es requerido.'),
            type: Yup.string().required('El tipo de domicilio es requerido.'),
            default: Yup.boolean().required('El domicilio es requerido.'),
        })
    )
})