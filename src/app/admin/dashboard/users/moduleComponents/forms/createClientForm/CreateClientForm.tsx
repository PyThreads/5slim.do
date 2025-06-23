import React from "react";
import { Grid, Button, Typography, MenuItem, } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Form as FormikForm, useFormikContext } from "formik";
import { CustomField, DefaultSwitch } from '../../../../../../../../components/inputs/CustomField';
import { Inter } from "next/font/google";
import { GooglePlacesAutocompleteInput } from "../../../../../../../../components/inputs/GoogleGeoInput";
import { IAddressType, IClient, IClientAddressMap } from "../../../../../../../../api/src/interfaces";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export const CreateArticleForm = ({ onClose }: { onClose: Function }) => {
    const { isSubmitting, values, setFieldValue }: { isSubmitting: boolean, values: IClient, setFieldValue: any } = useFormikContext<IClient>();
    const [checked, setChecked] = React.useState(values && values.addresses.length > 0 ? true : false);


    const onSelect = (map: IClientAddressMap) => {

        const address = {
            ...values.addresses[0],
            address: map.address,
            city: map.city,
            map: map,
            isMap: true
        }

        setFieldValue("addresses", [address])
    }

    return (
        <FormikForm
        >
            <Grid container >

                <Typography fontFamily={"Inter"} fontSize={16} color={"#8B8D97"} marginTop={"28px"}>Información del cliente</Typography>

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
                    <DefaultSwitch checked={checked} setChecked={(checked: boolean) => {
                        setChecked(checked)
                        setFieldValue(
                            "addresses",
                            checked ? [
                                {
                                    type: "Residencial",
                                    name: "",
                                    address: "",
                                    city: "",
                                    county: "",
                                    childCounty: "",
                                    phone: "",
                                    isMap: false,
                                    map: {},
                                    default: true,
                                    country: "República Dominicana"
                                }
                            ]
                                :
                                []
                        )
                    }
                    } label="Agregar Dirección" />

                </Grid>

                {
                    checked &&

                    <React.Fragment>

                        <Grid item xs={12} mt="28px">
                            <CustomField name="addresses[0].name" placeholder="Nombre de la dirección" fullWidth value={values.addresses[0]?.name} />
                        </Grid>

                        <Grid item xs={12} mt="28px">
                            <CustomField name="addresses[0].type" placeholder="Dirección" fullWidth value={values.addresses[0]?.type} select>
                                {[
                                    IAddressType.BILLING,
                                    IAddressType.SHIPPING,
                                    IAddressType.WORK
                                ].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))
                                }
                            </CustomField>
                        </Grid>

                        <Grid item xs={12} mt="28px">
                            <CustomField name="addresses[0].phone" placeholder="Teléfono" fullWidth value={values.addresses[0]?.phone} />
                        </Grid>

                        <Grid item xs={12} mt="28px">
                            <CustomField name="addresses[0].address" placeholder="Dirección" fullWidth value={values.addresses[0]?.address} />
                        </Grid>

                        <Grid item xs={12} mt="28px">
                            <CustomField name="addresses[0].city" placeholder="Ciudad" fullWidth value={values.addresses[0]?.city} />
                        </Grid>

                        <Grid item xs={12} mt="28px">
                            <CustomField name="addresses[0].county" placeholder="Municipio" fullWidth value={values.addresses[0]?.county} />
                        </Grid>

                        <Grid item xs={12} mt="28px">
                            <CustomField name="addresses[0].childCounty" placeholder="Sector" fullWidth value={values.addresses[0]?.childCounty} />
                        </Grid>

                        <Grid item xs={12} mt="28px">
                            <GooglePlacesAutocompleteInput onSelect={onSelect} placeholder="Buscar en mapa" comingCords={{lng: values.addresses[0]?.map?.lng, lat: values.addresses[0]?.map?.lat}} />
                        </Grid>
                    </React.Fragment>
                }


                <Grid container item xs={12} spacing={2} mt="28px">

                    <Grid item xs={6}>

                        <Button
                            variant="contained"
                            type="submit"
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

export default CreateArticleForm;

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