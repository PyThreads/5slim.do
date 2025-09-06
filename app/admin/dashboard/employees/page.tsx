"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import TableEmployeesList from "./moduleComponents/TableEmployeesList";
import CustomModal from "../../../../components/modals/CustomModal";
import CloseIcon from '@mui/icons-material/Close';
import CreateEmployeeFormValidator from "./moduleComponents/CreateEmployeeFormValidator";
import { IAdmin } from "../../../../api/src/interfaces";
import { employeeService } from "./employeeService";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function AdminEmployees() {
    const [open, setOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<IAdmin | null>(null)
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
    })
    const [result, setResult] = useState<any>()

    const getAllEmployees = useCallback(async () => {
        const result = await employeeService.getAllEmployees(filters)
        setResult(result)
    }, [setResult, filters])

    useEffect(() => {
        getAllEmployees()
    }, [filters, getAllEmployees])

    return (
        <Box>
            <Grid container justifyContent={"space-between"} alignItems={"center"}>

                <Typography sx={{ ...style.title }}>Gestión de Empleados</Typography>

                <Button 
                    variant="contained" 
                    sx={style.addButton}
                    onClick={() => setOpen(true)}
                >
                    <AddIcon />
                </Button>

            </Grid>

            <Box mt={"23px"} pb={10}>
                <TableEmployeesList
                    onDoubleClickRow={(employee: IAdmin) => {
                        setSelectedEmployee(employee)
                        setOpen(true)
                    }}
                    setFilters={setFilters}
                    rows={result?.list || []}
                    currentPage={filters.page}
                    limit={filters.limit}
                    totalItems={result?.totalItems || 0}
                    totalPages={result?.totalPages || 0}
                />
            </Box>

            <CustomModal open={open} borderRadius={"12px"}>
                <Box padding={"28px 24px"} maxWidth={423} minWidth={350} maxHeight={"70vh"}
                    sx={{
                        ...style.hideScroll
                    }}
                >

                    <Grid container p={0} m={0} justifyContent={"space-between"} >
                        <Typography fontFamily={inter.style.fontFamily} fontSize={"20px"} fontWeight={400}>
                            {selectedEmployee?._id ? "Editar Empleado" : "Agregar Nuevo Empleado"}
                        </Typography>

                        <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px", color: "#000" }}
                            onClick={() => {
                                setOpen(false);
                                setFilters({ limit: 10, page: 1 })
                                setSelectedEmployee(null)
                            }}
                        />

                    </Grid>

                    <CreateEmployeeFormValidator
                        valuesToEdit={selectedEmployee?._id ? selectedEmployee : {}}
                        onClose={() => {
                            setOpen(false);
                            setFilters({ limit: 10, page: 1 })
                            setSelectedEmployee(null)
                        }
                        }
                    />
                </Box>
            </CustomModal>

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
    title: {
        fontFamily: inter.style.fontFamily,
        color: "#45464E",
    }
}