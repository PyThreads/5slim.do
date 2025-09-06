import React from "react";
import { Grid, Typography, MenuItem, Box, Button, } from "@mui/material";
import { Form as FormikForm, useFormikContext } from "formik";
import { CustomField, DefaultSwitch, MultipleSelectChip } from '../../../../../../../components/inputs/CustomField';
import { Inter } from "next/font/google";
import { IArticle, IArticleImages, IArticlesVariants, IDiscountType, ICategory, IBrand } from "../../../../../../../api/src/interfaces";
import TableArticleTipTap from "../../TableArticleTipTap";
import { categoriesService } from "../../../../categories/categoriesService";
import { brandsService } from "../../../../brands/brandsService";
import { baseService } from "../../../../../../utils/baseService";
import { UploadArticlesPictures } from "../../UploadArticlesPictures";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import SaveIcon from '@mui/icons-material/Save';
import CustomModal from "../../../../../../../components/modals/CustomModal";
import TableArticleVariants from "../../TableArticleVariants";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { articleService } from "../../../articleService";
import CreateCategoryForm from "../../../../categories/moduleComponents/forms/CreateCategoryForm";
import CreateBrandForm from "../../../../brands/moduleComponents/forms/CreateBrandForm";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export const CreateArticleForm = () => {
    const { values, setValues, setFieldValue }: { values: IArticle, setValues: any, setFieldValue: any } = useFormikContext<IArticle>();
    const [advanced, setAdvanced] = React.useState(values.tipTap ? true : false);
    const [openModalVariantes, setOpenModalVariantes] = React.useState(false);
    const [variants, setVariants] = React.useState<IArticlesVariants[]>([]);
    const [_loadingVariants, setLoadingVariants] = React.useState(false);
    const [categories, setCategories] = React.useState<ICategory[]>([]);
    const [brands, setBrands] = React.useState<IBrand[]>([]);
    const [openCategoryModal, setOpenCategoryModal] = React.useState(false);
    const [openBrandModal, setOpenBrandModal] = React.useState(false);

    const loadVariants = async () => {
        if (!values._id) return;
        try {
            const variants = await articleService.getVariants(values._id);
            setVariants(variants);
        } catch (error) {
            console.error('Error loading variants:', error);
        }
    };

    const loadCategories = async () => {
        try {
            const result = await categoriesService.getAllCategories({ page: 1, limit: 100 });
            setCategories(result.list || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadBrands = async () => {
        try {
            const result = await brandsService.getAllBrands({ page: 1, limit: 100 });
            setBrands(result.list || []);
        } catch (error) {
            console.error('Error loading brands:', error);
        }
    };

    React.useEffect(() => {
        loadCategories();
        loadBrands();
    }, []);

    const handleOpenVariantsModal = async () => {
        if (values._id) {
            setLoadingVariants(true);
            await loadVariants();
            setLoadingVariants(false);
        }
        setOpenModalVariantes(true);
    };

    return (
        <React.Fragment>
            <FormikForm>
                <Grid container justifyContent={"space-between"} alignItems={"center"}>

                    <Typography sx={{ ...style.title }}>Nuevo Artículo</Typography>

                    <Box display={"flex"}>

                        <Button variant="contained" type="button" sx={{ ...style.addButton }}
                            onClick={handleOpenVariantsModal}
                            disabled={!values._id}
                        >
                            <BackupTableIcon sx={{ display: { xs: 'block', sm: 'none' } }} />
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                                <BackupTableIcon />
                                Variantes
                            </Box>
                        </Button>

                        <Button variant="contained" type="submit" sx={{ ...style.addButton, ml: 1 }}
                        >
                            <SaveIcon sx={{ display: { xs: 'block', sm: 'none' } }} />
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                                <SaveIcon />
                                Guardar y Publicar
                            </Box>
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

                                    <Grid container item xs={12} spacing={2}>
                                        <Grid item xs={6}>
                                            <CustomField 
                                                label="Código Interno" 
                                                placeholder="ID del sistema" 
                                                fullWidth 
                                                value={values._id || 'Se asignará automáticamente'} 
                                                disabled 
                                                noValidate 
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <CustomField 
                                                name="externalCode" 
                                                label="Código Externo" 
                                                placeholder="Código personalizado" 
                                                fullWidth 
                                                value={values.externalCode || ''}
                                                onChange={(e: any) => {
                                                    const value = e.target.value.trim();
                                                    setFieldValue("externalCode", value === '' ? "" : value);
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box display="flex"  gap={1} alignItems={"center"}>
                                            <Box flex={1}>
                                                <MultipleSelectChip name="categories" label="Categorías" fullWidth
                                                    items={categories}
                                                    getLabel={(item: ICategory) => item?.description}
                                                    selected={values?.categories.map((category: ICategory) => category?._id)}
                                                    setSelected={(selected: number[]) => {
                                                        const lists = selected.map((itemSelected: number) => {
                                                            return categories.find((category: ICategory) => category._id === itemSelected)
                                                        }).filter(Boolean)
                                                        setFieldValue("categories", lists)
                                                    }}
                                                />
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => setOpenCategoryModal(true)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '8px',
                                                    borderColor: '#5570F1',
                                                    color: '#5570F1',
                                                    '&:hover': {
                                                        borderColor: '#5570F1',
                                                        backgroundColor: 'rgba(85, 112, 241, 0.04)'
                                                    }
                                                }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </Button>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box display="flex" gap={1} alignItems={"center"}>
                                            <Box flex={1}>
                                                <CustomField 
                                                    name="brand" 
                                                    label="Marca" 
                                                    fullWidth 
                                                    select
                                                    value={values?.brand?._id || ""}
                                                    onChange={(e: any) => {
                                                        const selectedBrand = brands.find(brand => brand._id === parseInt(e.target.value));
                                                        setFieldValue("brand", selectedBrand || null);
                                                    }}
                                                    noValidate
                                                >
                                                    <MenuItem value="">
                                                        <em>Seleccionar marca</em>
                                                    </MenuItem>
                                                    {brands.map((brand) => (
                                                        <MenuItem key={brand._id} value={brand._id}>
                                                            {brand.description}
                                                        </MenuItem>
                                                    ))}
                                                </CustomField>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => setOpenBrandModal(true)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '8px',
                                                    borderColor: '#5570F1',
                                                    color: '#5570F1',
                                                    '&:hover': {
                                                        borderColor: '#5570F1',
                                                        backgroundColor: 'rgba(85, 112, 241, 0.04)'
                                                    }
                                                }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </Button>
                                        </Box>
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




                                </Grid>


                                <Grid item xs={12} sm={6} >

                                    <Grid item xs={12} >
                                        <CustomField name="shortDescription" label="Descripción Corta" placeholder="Descripción corta" fullWidth value={values.shortDescription} multiline rows={8} />
                                    </Grid>



                                    <Grid item xs={12} mt={2} >
                                        <Grid container item xs={12} spacing={2} >
                                            <Grid item xs={6} >
                                                <CustomField 
                                                    select 
                                                    name="advertisement.type" 
                                                    label="Publicidad tipo (Opcional)" 
                                                    placeholder="Publicidad tipo" 
                                                    fullWidth 
                                                    value={values?.advertisement?.type || ""} 
                                                    onChange={(e: any) => {
                                                        setFieldValue("advertisement.type", e.target.value);
                                                    }}
                                                    noValidate
                                                >
                                                    <MenuItem value="">
                                                        <em>Ninguno</em>
                                                    </MenuItem>
                                                    {Object.entries(IDiscountType).map((option) => (
                                                        <MenuItem key={option[1]} value={option[1]}>
                                                            {option[1]}
                                                        </MenuItem>
                                                    ))}
                                                </CustomField>
                                            </Grid>

                                            <Grid item xs={6} >
                                                <CustomField 
                                                    name="advertisement.value" 
                                                    label="Valor de Publicidad (Opcional)" 
                                                    placeholder="Valor de la publicidad" 
                                                    fullWidth 
                                                    value={values?.advertisement?.value || ""} 
                                                    onChange={(e: any) => {
                                                        setFieldValue("advertisement.value", e.target.value);
                                                    }}
                                                    noValidate 
                                                />
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

                                    <Grid item xs={12} mt={1} >
                                        <DefaultSwitch checked={values?.featured || false} setChecked={(checked: boolean) => {
                                            setFieldValue("featured", checked)

                                        }
                                        } label="Destacado"
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
                        <Typography fontFamily={inter.style.fontFamily} fontSize={"16px"} color={"#45464E"} fontWeight={"bold"}>Variantes del Artículo</Typography>

                        <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px",color:"black" }}
                            onClick={() => { setOpenModalVariantes(false) }}
                        />
                    </Grid>

                    <Grid xs={12} mt={2} sx={{width: {xs: 300, md:"100%"}}}>
                        <TableArticleVariants 
                            rows={variants} 
                            mainImage={values.images.find(item => item.primary)?.url!} 
                            onChange={setVariants}
                            articleId={values._id}
                        />
                    </Grid>

                </Grid>
            </CustomModal>

            <CustomModal open={openCategoryModal} borderRadius={"16px"}>
                <CreateCategoryForm 
                    onClose={() => {
                        setOpenCategoryModal(false);
                        loadCategories();
                        loadBrands();
                    }} 
                />
            </CustomModal>

            <CustomModal open={openBrandModal} borderRadius={"16px"}>
                <CreateBrandForm 
                    onClose={() => {
                        setOpenBrandModal(false);
                        loadBrands();
                    }} 
                />
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