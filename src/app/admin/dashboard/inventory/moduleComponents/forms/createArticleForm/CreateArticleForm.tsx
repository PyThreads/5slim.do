import React from "react";
import { Grid, Typography, MenuItem, Box, Button, } from "@mui/material";
import { Form as FormikForm, useFormikContext } from "formik";
import { CustomField, DefaultSwitch, MultipleSelectChip } from '../../../../../../../../components/inputs/CustomField';
import { Inter } from "next/font/google";
import { IArticle, IArticleImages, IArticlesVariants, IDiscountType } from "../../../../../../../../api/src/interfaces";
import TableArticleTipTap from "../../TableArticleTipTap";
import { categories } from "../../../../../../utils/lists";
import { baseService } from "../../../../../../utils/baseService";
import { UploadArticlesPictures } from "../../UploadArticlesPictures";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import SaveIcon from '@mui/icons-material/Save';
import CustomModal from "../../../../../../../../components/modals/CustomModal";
import TableArticleVariants from "../../TableArticleVariants";
import CloseIcon from '@mui/icons-material/Close';
import { articleService } from "../../../articleService";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export const CreateArticleForm = () => {
    const { values, setValues, setFieldValue }: { values: IArticle, setValues: any, setFieldValue: any } = useFormikContext<IArticle>();
    const [advanced, setAdvanced] = React.useState(values.tipTap ? true : false);
    const [openModalVariantes, setOpenModalVariantes] = React.useState(false);

    return (
        <React.Fragment>
            <FormikForm>
                <Grid container justifyContent={"space-between"} alignItems={"center"}>

                    <Typography sx={{ ...style.title }}>Nuevo Artículo</Typography>

                    <Box display={"flex"}>

                        <Button variant="contained" type="button" sx={{ ...style.addButton }}
                            startIcon={<BackupTableIcon />}
                            onClick={() => setOpenModalVariantes(true)}
                        >
                            Variantes
                        </Button>

                        <Button variant="contained" type="submit" sx={{ ...style.addButton, ml: 1 }}
                            startIcon={<SaveIcon />}
                        >
                            Guardar y Publicar
                        </Button>
                    </Box>

                </Grid>

                <Grid container spacing={2} mt={"5px"} >
                    <Grid container item xs={12} md={8} >
                        <Box borderRadius={"12px"} padding={"25px"} minHeight={"145px"} margin={0} width={"100%"} bgcolor={"#FFF"} >
                            <Grid container item xs={12} spacing={2}>

                                <Grid container item xs={12} sm={6} spacing={2}>

                                    <Grid item xs={12} >
                                        <CustomField name="description" label="Descripción" placeholder="Nombre del articulo" fullWidth value={values.description} />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <MultipleSelectChip name="categories" label="Categorías" fullWidth
                                            items={categories}
                                            getLabel={(item: any) => item?.description}
                                            selected={values?.categories.map((category: any) => category?._id)}
                                            setSelected={(selected: any) => {
                                                const lists = selected.map((itemSelected: any) => {
                                                    return categories.find((category: any) => category._id === itemSelected)
                                                })
                                                setFieldValue("categories", lists)
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <CustomField label="Unidades" placeholder="Unidades disponibles" type="number" fullWidth value={articleService.getStockNumber(values)} disabled noValidate />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <CustomField 
                                            name="stockAlert" 
                                            label="Stock Alert" 
                                            placeholder="Alerta de stock bajo" 
                                            type="number" 
                                            fullWidth 
                                            value={values.stockAlert || 0} 
                                            onChange={(e: any) => {
                                                const value = e.target.value;
                                                setFieldValue("stockAlert", value === "" ? 0 : Number(value));
                                            }}
                                        />
                                    </Grid>

                                    <Grid container item xs={12} spacing={2} >
                                        <Grid item xs={6} >
                                            <Typography fontFamily={"Inter"} fontSize={"16px"} color={"#8B8D97"}>Descuento</Typography>
                                        </Grid>
                                        <Grid item xs={6} textAlign={"right"}>
                                            <DefaultSwitch checked={values.hasDiscount} setChecked={(checked: boolean) => {

                                                setValues({
                                                    ...values,
                                                    hasDiscount: checked,
                                                    discount: {
                                                        type: IDiscountType.AMOUNT,
                                                        value: 0,
                                                        endDate: "",
                                                        hasExpiration: false
                                                    }
                                                })

                                            }
                                            } label="Agregar Descuento"
                                                stylesLabel={{
                                                    fontFamily: inter.style.fontFamily,
                                                    fontSize: "16px",
                                                    color: "#8B8D97"
                                                }}
                                            />
                                        </Grid>
                                    </Grid>


                                    {

                                        values.hasDiscount &&
                                        <Grid container item xs={12} spacing={2}>
                                            <Grid item xs={6} >
                                                <CustomField select name="discount.type" label="Tipo de Descuento" placeholder="Nombres" fullWidth
                                                    onChange={(e: any) => setFieldValue("discount.type", e.target.value)}
                                                    value={values?.discount?.type || ""}>
                                                    {Object.entries(IDiscountType).map((option) => (
                                                        <MenuItem key={option[1]} value={option[1]}>
                                                            {option[1]}
                                                        </MenuItem>
                                                    ))}
                                                </CustomField>
                                            </Grid>
                                            <Grid item xs={6} >
                                                <CustomField name="discount.value" label="Valor del Descuento" placeholder="Valor del descuento" type="number" fullWidth value={values?.discount?.value || ""} />
                                            </Grid>


                                            <Grid container item xs={12} spacing={2} >
                                                <Grid item xs={6} >
                                                    <Typography fontFamily={"Inter"} fontSize={"16px"} color={"#8B8D97"}>Fecha de Expiración</Typography>
                                                </Grid>

                                                <Grid item xs={6} textAlign={"right"}>
                                                    <DefaultSwitch checked={values?.discount?.hasExpiration || false} setChecked={(checked: boolean) => {
                                                        setFieldValue("discount.hasExpiration", checked)
                                                    }
                                                    } label="Agregar Expiración"
                                                        stylesLabel={{
                                                            fontFamily: inter.style.fontFamily,
                                                            fontSize: "16px",
                                                            color: "#8B8D97"
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            {
                                                values?.discount?.hasExpiration &&
                                                <Grid item xs={12}>
                                                    <CustomField name="discount.endDate" label="Fecha de Expiración" placeholder="Precio de Venta" fullWidth type="datetime-local"
                                                        value={
                                                            baseService.dateToDateTimeLocal(values?.discount?.endDate || "")
                                                        }
                                                        onChange={(e: any) => {
                                                            const date = baseService.newDate(e.target.value);
                                                            setFieldValue("discount.endDate", date)
                                                        }}
                                                    />
                                                </Grid>
                                            }
                                        </Grid>

                                    }


                                </Grid>


                                <Grid item xs={12} sm={6} >

                                    <Grid item xs={12} >
                                        <CustomField name="shortDescription" label="Descripción Corta" placeholder="Descripción corta" fullWidth value={values.shortDescription} multiline rows={8} />
                                    </Grid>

                                    <Grid item xs={12} mt={2} >
                                        <Grid container item xs={12} spacing={2} >
                                            <Grid item xs={6} >
                                                <CustomField select name="advertisement.type" label="Publicidad tipo" placeholder="Publicidad tipo" fullWidth value={values?.advertisement?.type}

                                                >
                                                    {Object.entries(IDiscountType).map((option) => (
                                                        <MenuItem key={option[1]} value={option[1]}>
                                                            {option[1]}
                                                        </MenuItem>
                                                    ))}
                                                </CustomField>
                                            </Grid>

                                            <Grid item xs={6} >
                                                <CustomField name="advertisement.value" label="Valor de Publicidad" placeholder="Valor de la publicidad" fullWidth value={values?.advertisement?.value} />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12} mt={1} >
                                        <DefaultSwitch checked={advanced} setChecked={(checked: boolean) => {
                                            setAdvanced(checked)

                                        }
                                        } label="Avanzado"
                                            stylesLabel={{
                                                fontFamily: inter.style.fontFamily,
                                                fontSize: "16px",
                                                color: "#8B8D97"
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} mt={1} >
                                        <DefaultSwitch checked={values?.published} setChecked={(checked: boolean) => {
                                            setFieldValue("published", checked)

                                        }
                                        } label="Publicado"
                                            stylesLabel={{
                                                fontFamily: inter.style.fontFamily,
                                                fontSize: "16px",
                                                color: "#8B8D97"
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                {
                                    advanced &&

                                    <Grid item xs={12} >
                                        <TableArticleTipTap edit onUpdate={(content: any) => setFieldValue("tipTap", content)} oldContent={values?.tipTap || ""} />
                                    </Grid>

                                }


                            </Grid>


                        </Box>
                    </Grid>

                    <UploadArticlesPictures
                        images={values?.images || []}
                        setImages={(images: IArticleImages[]) => {
                            setFieldValue("images", images)
                        }}
                    />

                </Grid>
            </FormikForm >

            <CustomModal open={openModalVariantes} borderRadius={5} >
                <Grid container p={2} >

                    <Grid container item xs={12} alignItems={"center"} justifyContent={"space-between"} >
                        <Typography fontFamily={"Inter"} fontSize={"16px"} color={"#45464E"} fontWeight={"bold"}>Variantes del Artículo</Typography>

                        <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px",color:"black" }}
                            onClick={() => { setOpenModalVariantes(false) }}
                        />
                    </Grid>

                    <Grid xs={12} mt={2} sx={{width: {xs: 300, md:"100%"}}}>
                        <TableArticleVariants rows={values.variants} mainImage={values.images.find(item => item.primary)?.url!} onChange={(list: IArticlesVariants[])=>setFieldValue("variants", list)} />
                    </Grid>

                </Grid>
            </CustomModal>
        </React.Fragment>
    );
}

export default CreateArticleForm;


const style = {
    addButton: {
        backgroundColor: "#5570F1",
        fontSize: "14px",
        fontFamily: inter.style.fontFamily,
        height: "36px",
        textTransform: "none",
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "#5570F1",
        }
    },
    title: {
        fontFamily: inter.style.fontFamily,
        fontSize: 16,
        color: "#45464E",
    }
}