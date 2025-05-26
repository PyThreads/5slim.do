import { Grid, Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Form as FormikForm, useFormikContext } from "formik";

import { CustomField } from '../../inputs/CustomField';
import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: "600"
})

export const CreateArticleForm = () => {

    const { isSubmitting, values }: { isSubmitting: boolean, values: any } = useFormikContext();

    return (
        <FormikForm>
            <Grid container spacing={2}  >

                <Grid container item xs={12} md={6} lg={4} >
                    <Grid item xs={12} mt={2}>
                        <CustomField name="description" label="Nombre" fullWidth />
                    </Grid>

                    <Grid item xs={12} mt={2}>
                        <CustomField name="category1" label="Categoría 1" fullWidth value={values.category1.description || ""} />
                    </Grid>

                    <Grid item xs={12} mt={2}>
                        <CustomField name="descriptiond" label="Categoría 2" fullWidth value={values.description || ""} />
                    </Grid>

                    <Grid item xs={12} mt={2}>
                        <CustomField name="descriptiond" label="Categoría 3" fullWidth value={values.description || ""} />
                    </Grid>
 
                </Grid>

                <Grid container item xs={12} md={6} lg={4} >
                    <Grid item xs={12} mt={2}>
                        <CustomField name="descriptiond" label="Categoría 1" fullWidth value={values.description || ""} />
                    </Grid>

                </Grid>

                <Grid container item xs={12} md={6} lg={4} >

                    <Grid item xs={12} mt={2}>
                        <CustomField name="descriptiondd" label="Categoria 2" fullWidth value={values.description || ""} />
                    </Grid>
                   

                    <Grid item xs={12} mt={2}>
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
                </Grid>

            </Grid>

        </FormikForm>
    );
}

export default CreateArticleForm;

const style = {
    saveButton: {
        fontFamily: poppins.style.fontFamily,
        backgroundColor: "#001987",
        fontSize: "16px",
        textTransform: "none",
        borderRadius: "10px",
        height: "51px",
        "&:hover": { backgroundColor: "#001987" }
    }
}