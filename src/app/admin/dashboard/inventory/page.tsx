"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import SummaryInventory from "./moduleComponents/SummaryInventory";
import TableArticleList from "./moduleComponents/TableArticlesList";
import CategoriesModal from "./moduleComponents/CategoriesModal";
import { IArticle, IPaginateClients, IPaginationResult } from "../../../../../api/src/interfaces";
import { articleService } from "./articleService";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function AdminClientes() {

    const router = useRouter()

    const [filters, setFilers] = useState<IPaginateClients>({
        page: 1,
        limit: 10,
    })
    const [result, setResult] = useState<IPaginationResult>()
    const [reloadSummary, setReloadSummary] = useState(false)
    const [openCategoriesModal, setOpenCategoriesModal] = useState(false)

    const getAllArticles = useCallback(async () => {
        const result = await articleService.getAllArticles(filters)
        setResult(result);
        setReloadSummary(prev => !prev);
    }, [setResult, filters,setReloadSummary])

    useEffect(() => {
        getAllArticles()
    }, [filters, getAllArticles])

    return (
        <Box>
            <Grid container justifyContent={"space-between"} alignItems={"center"}>

                <Typography sx={{ ...style.title }}>Resumen inventario</Typography>

                <Box display="flex" gap={2} alignItems="center">
                    <Button 
                        variant="contained" 
                        sx={style.categoryButton}
                        onClick={() => setOpenCategoriesModal(true)}
                    >
                        <CategoryIcon />
                    </Button>
                    
                    <Link href="/admin/dashboard/inventory/newArticle">
                        <Button 
                            variant="contained" 
                            sx={style.addButton}
                            startIcon={<AddIcon sx={{ display: { xs: "none", sm: "block" } }} />}
                        >
                            <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                Agregar Nuevo Artículo
                            </Box>
                            <AddIcon sx={{ display: { xs: "block", sm: "none" } }} />
                        </Button>
                    </Link>
                </Box>

            </Grid>

            <Box mt={"23px"}>
                <SummaryInventory reload={reloadSummary} />
            </Box>

            <Box mt={"23px"} pb={10}>
                <TableArticleList
                    onDoubleClickRow={(article: IArticle) => {
                        router.push(`/admin/dashboard/inventory/newArticle/${article._id}`)
                    }}
                    setFilers={setFilers}
                    rows={result?.list || []}
                    currentPage={filters.page}
                    limit={filters.limit}
                    totalItems={result?.totalItems || 0}
                    totalPages={result?.totalPages || 0}
                    currentFilter={{ hasStock: filters.hasStock, lowStock: filters.lowStock, hasOrderedVariants: filters.hasOrderedVariants, sortByOrders: filters.sortByOrders }}
                />
            </Box>

            <CategoriesModal 
                open={openCategoriesModal} 
                onClose={() => setOpenCategoriesModal(false)} 
            />

        </Box>
    )
}

const style = {
    hideScroll: {
        overflowY: "scroll",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
        "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari
        },
    },
    addButton: {
        backgroundColor: "#5570F1",
        fontSize: { xs: 12, sm: 14, md: 16 },
        fontFamily: inter.style.fontFamily,
        height: "36px",
        textTransform: "none",
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "#5570F1",
        }
    },
    categoryButton: {
        backgroundColor: "#28a745",
        fontSize: { xs: 12, sm: 14, md: 16 },
        fontFamily: inter.style.fontFamily,
        height: "36px",
        textTransform: "none",
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "#218838",
        }
    },
    title: {
        fontFamily: inter.style.fontFamily,
        fontSize: { xs: 13, sm: 16, md: 16 },
        color: "#45464E",
    }
}