import React, { useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Inter } from "next/font/google";
import CustomField from "../../../../../../../components/inputs/CustomField";
import { ICategory, IBrand } from "../../../../../../../api/src/interfaces";
import { categoriesService } from "../../categoriesService";
import { brandsService } from "../../../brands/brandsService";
import CloseIcon from '@mui/icons-material/Close';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function CreateCategoryForm({ categoryToEdit, onClose, isBrand = false }: { categoryToEdit?: ICategory | IBrand | null, onClose: Function, isBrand?: boolean }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [description, setDescription] = useState(categoryToEdit?.description || "");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!description.trim()) {
            setError("La descripción es requerida");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            const data = {
                _id: categoryToEdit?._id || 0,
                description: description.trim(),
                slug: ""
            };

            if (isBrand) {
                if (categoryToEdit) {
                    await brandsService.updateBrand(categoryToEdit._id, data as IBrand);
                } else {
                    await brandsService.createBrand(data as IBrand);
                }
            } else {
                if (categoryToEdit) {
                    await categoriesService.updateCategory(categoryToEdit._id, data as ICategory);
                } else {
                    await categoriesService.createCategory(data as ICategory);
                }
            }

            onClose();
        } catch (error: any) {
            setError(error?.response?.data?.message || "Ha ocurrido un error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Grid container width={400} p={2}>
            <Grid item xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={2}>
                <Typography fontFamily={"Inter"} fontSize={18} fontWeight={600} color={"#2C2D33"}>
                    {categoryToEdit ? `Editar ${isBrand ? 'Marca' : 'Categoría'}` : `Nueva ${isBrand ? 'Marca' : 'Categoría'}`}
                </Typography>
                <CloseIcon 
                    sx={{ 
                        backgroundColor: "#FFF2E2", 
                        width: 32, 
                        height: 32, 
                        borderRadius: "8px", 
                        cursor: "pointer", 
                        padding: "5px", 
                        color: "#000" 
                    }}
                    onClick={() => onClose()}
                />
            </Grid>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Grid item xs={12} mt={2}>
                    <CustomField 
                        name="description" 
                        placeholder={`Descripción de la ${isBrand ? 'marca' : 'categoría'}`} 
                        fullWidth 
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                        noValidate
                    />
                </Grid>

                {error && (
                    <Grid item xs={12} mt={1}>
                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#f74343"}>
                            {error}
                        </Typography>
                    </Grid>
                )}

                <Grid container item xs={12} spacing={2} mt={3}>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            type="button"
                            fullWidth
                            sx={{ ...style.saveButton, ...style.cancelButton }}
                            onClick={() => onClose()}
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <CircularProgress size={"15px"} sx={{ color: "white", marginRight: "6px" }} />}
                            {isSubmitting ? 'Guardando' : 'Guardar'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
}

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
        fontSize: "14px",
        textTransform: "none",
        borderRadius: "12px",
        height: "40px",
        fontWeight: "400",
        fontFamily: inter.style.fontFamily,
        "&:hover": { backgroundColor: "#5570F1" }
    }
}