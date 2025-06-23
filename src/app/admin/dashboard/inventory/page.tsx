"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import SummaryClients from "./moduleComponents/SummaryArticle";
import TableClientsList from "./moduleComponents/TableArticlesList";
import { IArticle, IPaginateClients, IPaginationResult } from "../../../../../api/src/interfaces";
import { articleService } from "./articleService";
import Link from "next/link";
import { useRouter } from 'next/navigation'

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

    const getAllArticles = useCallback(async () => {
        const result = await articleService.getAllArticles(filters)
        setResult(result)
    }, [setResult, filters])

    useEffect(() => {
        getAllArticles()
    }, [filters, getAllArticles])

    return (
        <Box>
            <Grid container justifyContent={"space-between"} alignItems={"center"}>

                <Typography sx={{ ...style.title }}>Resumen inventario</Typography>

                <Link href="/admin/dashboard/inventory/newArticle">
                    <Button variant="contained" sx={{ ...style.addButton }}
                        startIcon={<AddIcon />}
                    >
                        Agregar Nuevo Artículo
                    </Button>
                </Link>

            </Grid>

            <Box mt={"23px"}>
                <SummaryClients />
            </Box>

            <Box mt={"23px"} pb={10}>
                <TableClientsList
                    onDoubleClickRow={(article: IArticle) => {
                        router.push(`/admin/dashboard/inventory/newArticle/${article._id}`)
                    }}
                    setFilers={setFilers}
                    rows={result?.list || []}
                    currentPage={filters.page}
                    limit={filters.limit}
                    totalItems={result?.totalItems || 0}
                    totalPages={result?.totalPages || 0}
                />
            </Box>


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