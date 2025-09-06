import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Inter } from "next/font/google";
import CustomField from "../../../../../../components/inputs/CustomField";
import { ICategory } from "../../../../../../api/src/interfaces";
import CloseIcon from '@mui/icons-material/Close';
import { categoriesService } from "../../categoriesService";
import { UploadSingleImage } from "../../../inventory/moduleComponents/UploadSingleImage";


const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function CreateCategoryForm({ categoryToEdit, onClose }: { categoryToEdit?: ICategory | null, onClose: Function }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [description, setDescription] = useState("");
    const [slug, setSlug] = useState("");
    const [icon, setIcon] = useState("");
    const [error, setError] = useState("");

    // Reset form when categoryToEdit changes
    useEffect(() => {
        setDescription(categoryToEdit?.description || "");
        setSlug(categoryToEdit?.slug || "");
        setIcon(categoryToEdit?.icon || "");
        setError("");
    }, [categoryToEdit]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDescription(value);
        if (!categoryToEdit) {
            setSlug(generateSlug(value));
        }
    };

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
                slug: slug.trim() || generateSlug(description),
                icon: icon
            };

            if (categoryToEdit) {
                await categoriesService.updateCategory(categoryToEdit._id, data);
            } else {
                await categoriesService.createCategory(data);
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
                <Typography fontFamily={inter.style.fontFamily} fontSize={{ xs: 13, sm: 16, md: 16 }} color={"#45464E"}>
                    {categoryToEdit ? 'Editar Categoría' : 'Nueva Categoría'}
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
                        label="Descripción"
                        placeholder="Descripción de la categoría" 
                        fullWidth 
                        value={description}
                        onChange={handleDescriptionChange}
                        noValidate
                    />
                </Grid>

                <Grid item xs={12} mt={2}>
                    <CustomField 
                        name="slug" 
                        label="Slug (URL amigable)"
                        placeholder="slug-de-la-categoria" 
                        fullWidth 
                        value={slug}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
                        noValidate
                    />
                </Grid>

                <Grid item xs={12} mt={2}>
                    <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} mb={1}>
                        Imagen de la categoría
                    </Typography>
                    <UploadSingleImage 
                        imageUrl={icon}
                        onImageChange={setIcon}
                        aspectRatio="1:1"
                    />
                </Grid>

                {error && (
                    <Grid item xs={12} mt={1}>
                        <Typography fontFamily={inter.style.fontFamily} fontSize={"12px"} color={"#f74343"}>
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