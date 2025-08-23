"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import TableCategoriesList from "./moduleComponents/TableCategoriesList";
import { ICategory, IPaginationResult, IUserType } from "../../../../../api/src/interfaces";
import { categoriesService } from "./categoriesService";
import CustomModal from "../../../../../components/modals/CustomModal";
import CreateCategoryForm from "./moduleComponents/forms/CreateCategoryForm";
import { useAdminAuth } from "../../../../../context/AdminContext";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function AdminCategories() {
    const { currentAdmin } = useAdminAuth() as { currentAdmin: any };
    const [result, setResult] = useState<IPaginationResult>()
    const [filters, setFilters] = useState({ page: 1, limit: 10 })
    const [openModal, setOpenModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);

    // Only show categories module for "Cliente" user type
    if (currentAdmin?.userType !== IUserType.CLIENTE) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <Typography fontFamily="Inter" fontSize="18px" color="#8B8D97">
                    No tienes permisos para acceder a este módulo
                </Typography>
            </Box>
        );
    }

    const getAllCategories = useCallback(async () => {
        const result = await categoriesService.getAllCategories(filters)
        setResult(result)
    }, [setResult, filters])

    useEffect(() => {
        getAllCategories()
    }, [filters, getAllCategories])

    const handleEditCategory = (category: ICategory) => {
        setCategoryToEdit(category);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCategoryToEdit(null);
        getAllCategories();
    };

    return (
        <React.Fragment>
            <Grid>
                <Grid container justifyContent={"space-between"} alignItems={{ xs: "flex-start", sm: "center" }} spacing={{ xs: 2, sm: 0 }}>
                    <Grid item xs={12} sm="auto">
                        <Typography fontFamily={"Inter"} color={"#45464E"}
                            sx={{ fontSize: { xs: "20px", sm: "24px" }, fontWeight: 600 }}
                        >
                            Categorías
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm="auto">
                        <Button variant="contained" sx={{ ...style.accionButton }}
                            onClick={() => setOpenModal(true)}
                        >
                            Agregar Nueva Categoría
                        </Button>
                    </Grid>
                </Grid>

                <Box mt={"23px"} pb={10}>
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
            </Grid>

            <CustomModal open={openModal} borderRadius={"16px"}>
                <CreateCategoryForm 
                    categoryToEdit={categoryToEdit} 
                    onClose={handleCloseModal} 
                />
            </CustomModal>
        </React.Fragment>
    )
}

const style = {
    accionButton: {
        backgroundColor: "#5570F1",
        fontSize: { xs: 14, sm: 14 },
        fontFamily: inter.style.fontFamily,
        height: { xs: 44, sm: 36 },
        minWidth: { xs: '100%', sm: 'auto' },
        textTransform: "none",
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "#5570F1",
        }
    }
}