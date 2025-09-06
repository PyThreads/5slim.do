import { Formik } from 'formik';
import { initialValuesClientForm, validationSchemaClientForm } from './CreateClientFormValidator';
import Form from "./CreateClientForm";
import axios from '../../../../../../../context/adminAxiosInstance';
import { IClient } from '../../../../../../../api/src/interfaces';
import { eventBus } from '../../../../../../utils/broadcaster';


export default function CreateClientForm({ valuesToEdit, onClose }: { valuesToEdit?: any, onClose: Function }) {
    
    const handleSubmit = async (user: IClient) => {

        try {

            user.fullName = user.firstName.trim() + " " + user.lastName.trim()

            if (user._id) {

                await axios.put(`/admin/private/client/${user._id}`, user)

            } else {

                await axios.post(`/admin/private/client/register`, user)
            }

            eventBus.emit("notify", { message: "Registro guardado de forma exitosa.", open: true, type: "success", title: "Guardado!" })
            onClose()

        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al guardar los datos del usuario."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })
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
                validateOnSubmit={true}
                validateOnChange={false}
                validateOnBlur={false}
                validateOnMount={false}
                shouldComponentUpdate
            >
                <Form  onClose={onClose}/>

            </Formik>
    )
}
