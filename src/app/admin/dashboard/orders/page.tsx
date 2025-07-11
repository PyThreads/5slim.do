"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import SummaryOrders from "./moduleComponents/SummaryOrders";
import CustomModal from "../../../../../components/modals/CustomModal";
import CreateOrder from "./moduleComponents/CreateOrder";
import TableOrderList from "./moduleComponents/TableOrderList";
import { IOrder, IPaginateOrders, IPaginationResult } from "../../../../../api/src/interfaces";
import { ordersService } from "./ordersService";
import { useRouter } from "next/navigation";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function Orders() {
    const router = useRouter()
    const [filters, setFilers] = useState<IPaginateOrders>({
        page: 1,
        limit: 10
    })

    const [openModal, setOpenModal] = useState(false);


    const [result, setResult] = useState<IPaginationResult>()

    const getAllOrders = useCallback(async () => {
        const result = await ordersService.getAllOrders(filters)
        setResult(result)
    }, [setResult, filters])

    useEffect(() => {
        getAllOrders()
    }, [filters, getAllOrders])

    return (
        <Grid>
            <Grid container justifyContent={"space-between"} alignItems={"center"}>

                <Typography sx={{ ...style.title }}>Resumen Órdenes</Typography>


                <Button variant="contained" sx={{ ...style.addButton }}
                    startIcon={<AddIcon />}
                    onClick={() => setOpenModal(true)}
                >
                    Agregar Nueva Orden
                </Button>

            </Grid>

            <Box mt={"23px"}>
                <SummaryOrders />
            </Box>


            <Box mt={"23px"} pb={10}>
                <TableOrderList
                    onDoubleClickRow={(order: IOrder) => {
                        router.push(`/admin/dashboard/orders/${order._id}`)
                    }}
                    setFilers={setFilers}
                    rows={result?.list || []}
                    currentPage={filters.page}
                    limit={filters.limit}
                    totalItems={result?.totalItems || 0}
                    totalPages={result?.totalPages || 0}
                />
            </Box>


            <CustomModal
                open={openModal}
                borderRadius={"12px"}
            >
                <CreateOrder setOpenModal={() => {
                    setOpenModal(false);
                    getAllOrders();
                }
                } />
            </CustomModal>

        </Grid >
    )
}

const style = {
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
    title: {
        fontFamily: inter.style.fontFamily,
        fontSize: { xs: 13, sm: 16, md: 16 },
        color: "#45464E",
    }
}