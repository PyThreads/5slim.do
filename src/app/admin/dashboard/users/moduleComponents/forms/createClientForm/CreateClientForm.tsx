import { Grid, Button, Typography, FormControlLabel, Switch, FormControl } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Form as FormikForm, useFormikContext } from "formik";

import { CustomField, IOSSwitch } from '../../../../../../../../components/inputs/CustomField';
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export const CreateArticleForm = () => {
    const [checked, setChecked] = React.useState(true);
    const { isSubmitting, values }: { isSubmitting: boolean, values: any } = useFormikContext();

    return (
        <FormikForm>
            <Grid spacing={2}>

                <Typography fontFamily={"Inter"} fontSize={16} color={"#8B8D97"} marginTop={"28px"}>Información del cliente</Typography>

                <Grid xs={12} mt="28px">
                    <CustomField name="firstName" label="Nombre" placeholder="Nombre del cliente" fullWidth />
                </Grid>

                <Grid xs={12} mt="28px">
                    <CustomField name="firstName" label="Nombre" placeholder="Nombre del cliente" fullWidth />
                </Grid>

                <Grid xs={12} mt="28px">
                    <CustomField name="firstName" label="Nombre" placeholder="Nombre del cliente" fullWidth />
                </Grid>

                <Grid xs={12} mt="28px">
                    <CustomField name="firstName" label="Nombre" placeholder="Nombre del cliente" fullWidth />
                </Grid>

                <Grid xs={12} mt="28px">
                    <CustomField name="firstName" label="Nombre" placeholder="Nombre del cliente" fullWidth />
                </Grid>

                <Grid xs={12} mt="28px">
                    <CustomField name="firstName" label="Nombre" placeholder="Nombre del cliente" fullWidth />
                </Grid>

                <Grid xs={12} mt="28px">

                    <FormControlLabel
                        control={
                            <IOSSwitch checked={checked} onChange={(event) => {
                                setChecked(event.target.checked)}
                            } />
                        }
                        label="Agregar dirección"
                        labelPlacement="start"
                        
                        sx={{
                            margin: 0,
                            '.MuiFormControlLabel-label': {
                                fontFamily: inter.style.fontFamily,
                                fontSize: "14px",
                                color: "#2B2F32",
                                margin: "0px 20px 0px 0px"
                            }
                        }}
                    />

                </Grid>

                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={style.saveButton}
                >
                    {isSubmitting && <CircularProgress size={"15px"} sx={{ color: "white", marginRight: "6px" }} />}
                    {isSubmitting ? 'Guardando' : 'Guardar'}
                </Button>
            </Grid>

        </FormikForm >
    );
}

export default CreateArticleForm;

const style = {
    saveButton: {
        backgroundColor: "#001987",
        fontSize: "16px",
        textTransform: "none",
        borderRadius: "10px",
        height: "51px",
        "&:hover": { backgroundColor: "#001987" }
    }
}