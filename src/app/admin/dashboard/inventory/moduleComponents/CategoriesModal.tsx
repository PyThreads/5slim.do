"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Dialog, DialogContent } from "@mui/material";
import { Inter } from "next/font/google";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { ICategory, IPaginationResult, IUserType } from "../../../../../../api/src/interfaces";
import { categoriesService } from "../../categories/categoriesService";
import { useAdminAuth } from "../../../../../../context/AdminContext";
import TableCategoriesList from "../../categories/moduleComponents/TableCategoriesList";
import CreateCategoryForm from "../../categories/moduleComponents/forms/CreateCategoryForm";
import CustomModal from "../../../../../../components/modals/CustomModal";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

interface CategoriesModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CategoriesModal({ open, onClose }: CategoriesModalProps) {
    const [result, setResult] = useState<IPaginationResult>();
    const [filters, setFilters] = useState({ page: 1, limit: 10 });
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);

    // Categories module available for all user types

    const getAllCategories = useCallback(async () => {
        const result = await categoriesService.getAllCategories(filters);
        setResult(result);
    }, [setResult, filters]);

    useEffect(() => {
        if (open) {
            getAllCategories();
        }
    }, [filters, getAllCategories, open]);

    const handleEditCategory = (category: ICategory) => {
        setCategoryToEdit(category);
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
        setCategoryToEdit(null);
        getAllCategories();
    };

    return (
        <>
            <Dialog 
                open={open} 
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        maxHeight: "90vh"
                    }
                }}
            >
                <DialogContent sx={{ p: 0 }}>
                    <Box padding={{ xs: "16px", sm: "22px 21px" }}>
                        <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography 
                                fontFamily="Inter" 
                                color="#45464E"
                                fontSize={{ xs: "16px", sm: "20px", md: "24px" }}
                                fontWeight={600}
                            >
                                Gestión de Categorías
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={2}>
                                <Button 
                                    variant="contained" 
                                    sx={style.accionButton}
                                    startIcon={<AddIcon sx={{ display: { xs: "none", sm: "block" } }} />}
                                    onClick={() => setOpenCreateModal(true)}
                                >
                                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                        Agregar Nueva Categoría
                                    </Box>
                                    <AddIcon sx={{ display: { xs: "block", sm: "none" } }} />
                                </Button>
                                
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
                                    onClick={onClose}
                                />
                            </Box>
                        </Grid>

                        <Box>
                            <TableCategoriesList
                                setFilters={setFilters}
                                rows={result?.list || []}
                                currentPage={result?.currentPage || 1}
                                limit={filters.limit}
                                totalItems={result?.totalItems || 0}
                                totalPages={result?.totalPages || 1}
                                onEditCategory={handleEditCategory}
                            />
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <CustomModal open={openCreateModal} borderRadius="16px">
                <CreateCategoryForm 
                    categoryToEdit={categoryToEdit} 
                    onClose={handleCloseCreateModal} 
                />
            </CustomModal>
        </>
    );
}

const style = {
    accionButton: {
        backgroundColor: "#5570F1",
        fontSize: 14,
        fontFamily: inter.style.fontFamily,
        height: 36,
        textTransform: "none",
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "#5570F1",
        }
    }
};