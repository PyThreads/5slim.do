import { Formik } from 'formik';
import { initialValuesClientForm, validationSchemaClientForm } from './CreateClientFormValidator';
import Form from "./CreateClientForm";
import axios from '../../../../../../../../context/axiosInstance';

export default function  CreateClientForm({ valuesToEdit, onClose }: { valuesToEdit?: any, onClose: Function }) {



    const handleSubmit = async (article: any) => {

        try {

            if (article._id) {

                await axios.put(`/admin/user/update/${article._id}`, article)

            } else {

                await axios.post(`/admin/user/create`, article)
            }

        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al crear el usuario."
        }

    }

    const getInitialValues = () => {
        return (valuesToEdit && Object.keys(valuesToEdit).length) > 0 ? valuesToEdit : initialValuesClientForm
    }

    return (
        <Formik
            validationSchema={validationSchemaClientForm}
            initialValues={getInitialValues()}
            onSubmit={handleSubmit}
            validateOnBlur
        >

                <Form />
        </Formik>
    )
}
