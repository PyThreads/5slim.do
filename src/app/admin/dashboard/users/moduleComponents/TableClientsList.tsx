import { Box, Button, Checkbox, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { FilterDateIcon, FilterIcon, SortTableIcon } from "../../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Inter } from "next/font/google";
import { IClient } from "../../../../../../api/src/interfaces";
import { userService } from "../userService";
import { useState } from "react";
import SearchTable from "../../../../../../components/inputs/SearchTable";

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
            rows: IClient[],
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

            <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                <Typography fontFamily={"Inter"}>Clientes</Typography>

                <Box display={"flex"} alignItems={"center"}>

                    <Box width={"250px"} m={1}>
                        <SearchTable onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFilers((prev: any) => ({ ...prev, fullName: e.target.value, page: 1 }))
                        }} />
                    </Box>

                    <Box m={1}>
                        <Button variant="outlined" sx={{ ...styles.btnAdd }}
                            startIcon={<FilterIcon filled />}
                        >
                            Filtrar
                        </Button>
                    </Box>


                    <Box m={1}>
                        <Button variant="outlined" sx={{ ...styles.btnAdd }}
                            startIcon={<FilterDateIcon filled />}
                        >
                            Filtrar
                        </Button>
                    </Box>

                    <Box m={1}>
                        <Button variant="outlined" sx={{ ...styles.btnAdd }}
                            endIcon={<KeyboardArrowDownIcon fontSize="medium" />}
                        >
                            Acciones
                        </Button>
                    </Box>
                </Box>

            </Grid>

            <Grid item xs={12} mt={2}>
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
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Nombres
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Correo
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Celular
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Ordenes
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Total Ordenes
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>


                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Cliente desde
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell align="center" >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Estado
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ borderBottom: "1px solid #E1E2E9" }}>
                            {rows.map((row: IClient) => (
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
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.fullName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.addresses[0]?.phone || "N/A"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {0}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {0}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {userService.formatAmPmLetters(row.createdDate!)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#519C66"} fontSize={"12px"}
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

                            {/* <Typography variant="h6" fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#8B8D97"} >
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

                        <Typography variant="h6" fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#8B8D97"} ml={3}>
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
                                    fontFamily={"Inter"}
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
    }
}