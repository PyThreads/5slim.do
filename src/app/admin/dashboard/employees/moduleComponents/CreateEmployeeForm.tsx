import React, { useState } from "react";
import { Grid, Button, Typography, MenuItem, CircularProgress } from "@mui/material";
import { Form as FormikForm, useFormikContext } from "formik";
import { CustomField } from '../../../../../../components/inputs/CustomField';
import { Inter } from "next/font/google";
import { IAdmin } from "../../../../../../api/src/interfaces";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export const CreateEmployeeForm = ({ onClose }: { onClose: Function }) => {
    const { isSubmitting, values, setFieldValue }: { isSubmitting: boolean, values: IAdmin, setFieldValue: any } = useFormikContext<IAdmin>();

    return (
        <FormikForm>
            <Grid container >

                <Typography fontFamily={"Inter"} fontSize={16} color={"#8B8D97"} marginTop={"28px"}>Información del empleado</Typography>

                <Grid item xs={12} mt="28px">
                    <CustomField name="firstName" placeholder="Nombres" fullWidth value={values.firstName} />
                </Grid>

                <Grid item xs={12} mt="28px">
                    <CustomField name="lastName" placeholder="Apellidos" fullWidth value={values.lastName} />
                </Grid>

                <Grid item xs={12} mt="28px">
                    <CustomField name="email" placeholder="Correo" fullWidth value={values.email} />
                </Grid>



                <Grid item xs={12} mt="28px">
                    <CustomField name="profilePicture" placeholder="URL Foto de Perfil (Opcional)" fullWidth value={values.profilePicture} />
                </Grid>

                <Grid container item xs={12} spacing={2} mt="28px">

                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            type="button"
                            fullWidth
                            sx={{ ...style.saveButton, ...style.cancelButton }}
                            onClick={() => {
                                onClose && onClose()
                            }}
                        >
                            Cancelar
                        </Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            sx={{ ...style.saveButton }}
                        >
                            {isSubmitting && <CircularProgress size={"15px"} sx={{ color: "white", marginRight: "6px" }} />}
                            {isSubmitting ? 'Guardando' : 'Guardar'}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

        </FormikForm >
    );
}

export default CreateEmployeeForm;

const style = {
    cancelButton: {
        color: "#5570F1",
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
        border: "1px solid #5570F1",
        "&:hover": { backgroundColor: "#FFFFFF" }
    },
    saveButton: {
        backgroundColor: "#5570F1",
        fontSize: "20px",
        textTransform: "none",
        borderRadius: "12px",
        height: "51px",
        fontWeight: "300",
        fontFamily: inter.style.fontFamily,
        "&:hover": { backgroundColor: "#5570F1" }
    }
}