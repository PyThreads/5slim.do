"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Dialog, DialogContent, Tabs, Tab } from "@mui/material";
import { Inter } from "next/font/google";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { ICategory, IBrand, IPaginationResult, IUserType } from "../../../../../../api/src/interfaces";
import { categoriesService } from "../../categories/categoriesService";
import { brandsService } from "../../brands/brandsService";
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
    const [tabValue, setTabValue] = useState(0);
    const [result, setResult] = useState<IPaginationResult>();
    const [brandsResult, setBrandsResult] = useState<IPaginationResult>();
    const [filters, setFilters] = useState({ page: 1, limit: 10 });
    const [brandsFilters, setBrandsFilters] = useState({ page: 1, limit: 10 });
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
    const [brandToEdit, setBrandToEdit] = useState<IBrand | null>(null);

    // Categories module available for all user types

    const getAllCategories = useCallback(async () => {
        const result = await categoriesService.getAllCategories(filters);
        setResult(result);
    }, [setResult, filters]);

    const getAllBrands = useCallback(async () => {
        const result = await brandsService.getAllBrands(brandsFilters);
        setBrandsResult(result);
    }, [setBrandsResult, brandsFilters]);

    useEffect(() => {
        if (open) {
            if (tabValue === 0) {
                getAllCategories();
            } else {
                getAllBrands();
            }
        }
    }, [filters, brandsFilters, getAllCategories, getAllBrands, open, tabValue]);

    const handleEditCategory = (category: ICategory) => {
        setCategoryToEdit(category);
        setOpenCreateModal(true);
    };

    const handleEditBrand = (brand: IBrand) => {
        setBrandToEdit(brand);
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
        setCategoryToEdit(null);
        setBrandToEdit(null);
        if (tabValue === 0) {
            getAllCategories();
        } else {
            getAllBrands();
        }
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
                                Gestión de {tabValue === 0 ? 'Categorías' : 'Marcas'}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={2}>
                                <Button 
                                    variant="contained" 
                                    sx={style.accionButton}
                                    startIcon={<AddIcon sx={{ display: { xs: "none", sm: "block" } }} />}
                                    onClick={() => setOpenCreateModal(true)}
                                >
                                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                        Agregar Nueva {tabValue === 0 ? 'Categoría' : 'Marca'}
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

                        <Tabs 
                            value={tabValue} 
                            onChange={(_, newValue) => setTabValue(newValue)}
                            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Categorías" />
                            <Tab label="Marcas" />
                        </Tabs>

                        <Box>
                            {tabValue === 0 ? (
                                <TableCategoriesList
                                    setFilters={setFilters}
                                    rows={result?.list || []}
                                    currentPage={result?.currentPage || 1}
                                    limit={filters.limit}
                                    totalItems={result?.totalItems || 0}
                                    totalPages={result?.totalPages || 1}
                                    onEditCategory={handleEditCategory}
                                />
                            ) : (
                                <TableCategoriesList
                                    setFilters={setBrandsFilters}
                                    rows={brandsResult?.list || []}
                                    currentPage={brandsResult?.currentPage || 1}
                                    limit={brandsFilters.limit}
                                    totalItems={brandsResult?.totalItems || 0}
                                    totalPages={brandsResult?.totalPages || 1}
                                    onEditCategory={handleEditBrand}
                                />
                            )}
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <CustomModal open={openCreateModal} borderRadius="16px">
                {tabValue === 0 ? (
                    <CreateCategoryForm 
                        categoryToEdit={categoryToEdit} 
                        onClose={handleCloseCreateModal} 
                    />
                ) : (
                    <CreateCategoryForm 
                        categoryToEdit={brandToEdit} 
                        onClose={handleCloseCreateModal}
                        isBrand={true}
                    />
                )}
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