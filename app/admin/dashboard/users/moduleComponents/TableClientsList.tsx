import { Box, Button, Card, CardContent, Checkbox, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { FilterDateIcon, FilterIcon, SortTableIcon } from "../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Inter } from "next/font/google";
import { IPaginatedClient } from "../../../../../api/src/interfaces";
import { useState } from "react";
import SearchTable from "../../../../../components/inputs/SearchTable";
import { userService } from "../userService";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function TableClientsList(
    {
        setFilers,
        rows,
        currentPage,
        limit,
        totalItems,
        totalPages,
        onDoubleClickRow
    }
        :
        {
            rows: IPaginatedClient[],
            currentPage: number,
            limit: number
            totalItems: number,
            totalPages: number,
            setFilers: Function
            onDoubleClickRow: Function
        }
) {
    const [checked, setChecked] = useState<number[]>([]);

    return (
        <Box padding={"22px 21px"} bgcolor={"#FFFFFF"} borderRadius={"12px"} >

            <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"} spacing={1}>

                <Grid item xs={12} md={5} lg={5} >
                    <Typography fontFamily={inter.style.fontFamily} fontSize={{ xs: 13, sm: 16, md: 16 }} color={"#45464E"}>Clientes</Typography>
                </Grid>

                <Grid container item display={"flex"} alignItems={"center"} xs={12} md={12} lg={7} spacing={1}>
                    <Grid item xs={12}>
                        <SearchTable 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFilers((prev: any) => ({ ...prev, fullName: e.target.value, page: 1 }))
                            }} 
                        />
                    </Grid>
                </Grid>

            </Grid>

            <Grid item xs={12} mt={2}>
                {/* Desktop Table */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <TableContainer component={Paper} sx={styles.tableContainer}>
                    <Table size="small" aria-label="a dense table" sx={styles.table}>
                        <TableHead sx={{ padding: 0 }}>
                            <TableRow
                                sx={styles.tableRow}
                            >
                                <TableCell>
                                    <Checkbox
                                        checked={checked.length === rows.length}
                                        onClick={() => {
                                            if (checked.length === rows.length) {
                                                setChecked([])
                                            } else {
                                                setChecked(rows.map(item => item._id) || [])
                                            }
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}

                                    />
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Nombres
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Correo
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Celular
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} textAlign={"center"} color={"#2C2D33"} mr={1}>
                                            Ordenes
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Total Ordenes
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>


                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Cliente desde
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell align="center" >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Estado
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ borderBottom: "1px solid #E1E2E9" }}>
                            {rows.map((row: IPaginatedClient) => (
                                <TableRow
                                    onDoubleClick={async () => {
                                        const userFullDetails = await userService.getClientDetails({ _id: row._id });
                                        onDoubleClickRow(userFullDetails)
                                    }}
                                    key={row._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: "0px !important" }}

                                >
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Checkbox
                                            checked={checked.some(item => row._id === item)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#5570F1", // color cuando está marcado
                                                }
                                            }}
                                            onClick={() => {
                                                setChecked(checked.some(item => row._id === item) ? checked.filter(item => item !== row._id) : [...checked, row._id])
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.fullName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.email || "N/A"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.phone || (row.addresses.length > 0 ? row.addresses[0].phone : "N/A")}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.totalOrdenes}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {userService.dominicanNumberFormat(row.totalGastado)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {userService.formatAmPmLetters(row.createdDate!)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#519C66"} fontSize={"12px"}
                                            borderRadius={"8px"} bgcolor={true ? "#32936F29" : "#FBE3E3"} width={"fit-content"} padding={"4px 4px"} textAlign={"center"}
                                        >
                                            {true ? "Activo" : "Inactivo"}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    </TableContainer>
                </Box>

                {/* Mobile Cards */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {rows.map((row: IPaginatedClient) => (
                        <Card key={row._id} sx={styles.mobileCard} onClick={async () => {
                            const userFullDetails = await userService.getClientDetails({ _id: row._id });
                            onDoubleClickRow(userFullDetails);
                        }}>
                            <CardContent sx={styles.mobileCardContent}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="h6" sx={styles.mobileCardTitle}>
                                        {row.fullName}
                                    </Typography>
                                    <Checkbox
                                        checked={checked.some(item => row._id === item)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setChecked(checked.some(item => row._id === item) ? checked.filter(item => item !== row._id) : [...checked, row._id]);
                                        }}
                                        sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Email:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.email}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Teléfono:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.phone || "N/A"}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Órdenes:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.totalOrdenes}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Total Gastado:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{userService.dominicanNumberFormat(row.totalGastado)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography sx={styles.mobileCardLabel}>Cliente desde:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{userService.formatAmPmLetters(row.createdDate!)}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>

                    <Box display={"flex"} alignItems={"center"}>

                        <Box sx={{ backgroundColor: "#5E636614" }}
                            padding="0px 11px"
                            width={"60px"}
                            height={"23px"}
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            borderRadius={"8px"}
                        >

                            {/* <Typography variant="h6" fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#8B8D97"} >
                                {limit}
                            </Typography> */}

                            <Select
                                value={limit}
                                size="small"
                                variant="outlined"
                                onChange={(e) => setFilers((prev: any) => ({ ...prev, limit: e.target.value, page: 1 }))}
                                sx={{
                                    width: 80,
                                    height: 36,
                                    outline: "none",
                                    border: "none",
                                    color: "#8B8D97",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "none"
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: 0,
                                    }
                                }}
                            >
                                {[5, 10, 25, 50, 100].map((option) => (
                                    <MenuItem key={option} value={option} color="#8B8D97">
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>

                        </Box>

                        <Typography variant="h6" fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#8B8D97"} ml={3}>
                            Items por página
                        </Typography>


                    </Box>

                    <Box display={"flex"}>

                        <TablePagination
                            component="div"
                            count={totalItems!} // total de elementos
                            page={currentPage! - 1} // ajustamos a base 0
                            rowsPerPage={limit}
                            rowsPerPageOptions={[]} // si no quieres mostrar opciones
                            labelDisplayedRows={({ page }) => (
                                <Typography
                                    component="span"
                                    fontFamily={inter.style.fontFamily}
                                    fontSize={"14px"}
                                    fontWeight={"400"}
                                    color={"#666666"}
                                    ml={2}
                                >
                                    {`${page + 1} de ${totalPages} Páginas`}
                                </Typography>
                            )}
                            labelRowsPerPage={""}
                            onPageChange={(_, newPage) => {
                                setFilers((prev: any) => ({ ...prev, page: newPage + 1 }));
                                setChecked([])
                            }}
                            sx={{
                                '& .MuiTablePagination-actions button': {
                                    color: '#8B8D97',
                                },
                            }}
                        />

                    </Box>

                </Box>


            </Grid>

        </Box >
    )
}

const styles = {
    tableContainer: {
        borderRadius: "0px !important",
        border: "none",
        boxShadow: "none",
        padding: "0px !important"
    },
    tableCellBody: {
        padding: "0px !important",
        border: "none",
        height: "48px"
    },
    table: {
        borderRadius: "0px !important",
        boxShadow: "none !important",
        border: "none !important",
        minWidth: 650,
        padding: "0px !important"
    },
    tableRow: {
        "& th": {
            borderTop: "1px solid #E1E2E9",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "1px solid #E1E2E9",
            padding: "0px !important",
            height: "52px"
        }
    },
    btnAdd: {
        fontSize: "14px",
        fontFamily: inter.style.fontFamily,
        height: "33px",
        textTransform: "none",
        borderRadius: "4px",
        padding: "8px",
        "&:hover": {
            backgroundColor: "transparent",
        },
        borderColor: "#53545C",
        color: "#53545C"
    },
    mobileCard: {
        mb: 2,
        borderRadius: "12px",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        "&:hover": {
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)"
        }
    },
    mobileCardContent: {
        padding: "16px !important"
    },
    mobileCardTitle: {
        fontFamily: inter.style.fontFamily,
        fontSize: "16px",
        fontWeight: "600",
        color: "#2C2D33"
    },
    mobileCardLabel: {
        fontFamily: inter.style.fontFamily,
        fontSize: "14px",
        fontWeight: "500",
        color: "#8B8D97"
    },
    mobileCardValue: {
        fontFamily: inter.style.fontFamily,
        fontSize: "14px",
        fontWeight: "400",
        color: "#6E7079"
    }
}