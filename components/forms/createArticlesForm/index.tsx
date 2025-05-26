import { Formik } from 'formik';
import { initialValuesArticleForm, validationSchemaArticleForm } from './CreateArticleFormValidator';
import Form from "./CreateArticleForm";
import axios from '../../../context/axiosInstance';

export default function  CreateArticleForm({ valuesToEdit, onClose }: { valuesToEdit?: any, onClose: Function }) {



    const handleSubmit = async (article: any) => {

        try {

            if (article._id) {

                await axios.put(`/enrollment/update/${article._id}`, article)

            } else {

                await axios.post(`/enrollment/create`, article)
            }

        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al crear el concurso."
        }

    }

    const getInitialValues = () => {
        return (valuesToEdit && Object.keys(valuesToEdit).length) > 0 ? valuesToEdit : initialValuesArticleForm
    }

    return (
        <Formik
            validationSchema={validationSchemaArticleForm}
            initialValues={getInitialValues()}
            onSubmit={handleSubmit}
            validateOnBlur
        >

                <Form />
        </Formik>
    )
}
