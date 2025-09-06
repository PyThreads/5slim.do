import { Formik } from 'formik';
import { initialValuesArticleForm, validationSchemaArticleForm } from './CreateArticleFormFormValidator';
import Form from "./CreateArticleForm";
import axios from '../../../../../../../context/adminAxiosInstance';
import { IArticle } from '../../../../../../../api/src/interfaces';
import { eventBus } from '../../../../../../utils/broadcaster';
import { useRouter } from 'next/navigation';


export default function CreateArticleForm({ valuesToEdit, onClose }: { valuesToEdit?: any, onClose: Function }) {
    
    const navigation = useRouter()

    const handleSubmit = async (article: IArticle,{ resetForm }:any) => {

        try {

            if(article.images.length === 0){
                eventBus.emit("notify", { message: "El artículo debe tener al menos una imagen.", open: true, type: "error", title: "Error!" });
                return;
            }

            if (article._id) {

                await axios.put(`/admin/private/articles/update/${article._id}`, article)

            } else {
                const {data}: any = await axios.post(`/admin/private/articles/register`, article)
                resetForm();
                navigation.push("/admin/dashboard/inventory/newArticle/" + data.data._id)
            }

            eventBus.emit("notify", { message: "Registro guardado de forma exitosa.", open: true, type: "success", title: "Guardado!" })
            onClose()

        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al guardar los datos del artículo."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
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
                validateOnChange
                validateOnBlur
            >
                <Form />

            </Formik>
    )
}
