import { Formik } from "formik";
import * as Yup from "yup";
import { IAdmin } from "../../../../../../api/src/interfaces";
import CreateEmployeeForm from "./CreateEmployeeForm";
import { employeeService } from "../employeeService";
import { eventBus } from "../../../../utils/broadcaster";

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("El nombre es requerido"),
    lastName: Yup.string().required("El apellido es requerido"),
    email: Yup.string().email("Email inválido").required("El email es requerido"),
    profilePicture: Yup.string().url("URL inválida").nullable()
});

export default function CreateEmployeeFormValidator({
    valuesToEdit,
    onClose
}: {
    valuesToEdit: Partial<IAdmin>,
    onClose: Function
}) {
    const initialValues: Partial<IAdmin> = valuesToEdit._id ? valuesToEdit : {
        firstName: valuesToEdit?.firstName?.trim() || "",
        lastName: valuesToEdit?.lastName?.trim() || "",
        fullName: valuesToEdit.fullName || "",
        email: valuesToEdit.email?.trim() || "",
        profilePicture: valuesToEdit.profilePicture || ""
    };

    const handleSubmit = async (values: Partial<IAdmin>) => {
        try {
            // Generate fullName
            values.fullName = `${values.firstName} ${values.lastName}`.trim();

            if (values._id) {
                await employeeService.updateEmployee(values._id, values);
                eventBus.emit('notify', {
                    type: 'success',
                    message: 'Empleado actualizado exitosamente',
                    title: 'Éxito',
                    open: true
                });
            } else {
                await employeeService.createEmployee(values);
                eventBus.emit('notify', {
                    type: 'success',
                    message: 'Empleado creado exitosamente',
                    title: 'Éxito',
                    open: true
                });
            }
            onClose();
        } finally {
            return;
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            <CreateEmployeeForm onClose={onClose} />
        </Formik>
    );
}