import { Box, Button, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { FilterDateIcon, FilterIcon, SortTableIcon } from "../../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchTableClients from "./SearchTableClients";
import { Inter } from "next/font/google";
import { table } from "console";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})


function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    },
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    },
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    },
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    },
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    },
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    },
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    },
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    },
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    },
    {
        name: "Jose Reyes",
        email: "n2Mlq@example.com",
        phone: "123456789",
        orders: 2,
        totalOrders: "DOP 2,000.00",
        clientSince: "01 Enero 2025 12:00 AM",
        active: true
    }

];

export default function TableClientsList() {
    return (
        <Box padding={"22px 21px"} bgcolor={"#FFFFFF"} borderRadius={"12px"} >

            <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                <Typography fontFamily={"Inter"}>Clientes</Typography>

                <Box display={"flex"} alignItems={"center"}>

                    <Box width={"250px"} m={1}>
                        <SearchTableClients onChange={() => { }} />
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
                                <TableCell >
                                    <Checkbox
                                        checked={true}
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
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: "0px !important" }}
                                >
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Checkbox
                                            checked={true}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#5570F1", // color cuando está marcado
                                                }
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.phone}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.orders}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.totalOrders}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.clientSince}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#519C66"} fontSize={"12px"}
                                            borderRadius={"8px"} bgcolor={row.active ? "#32936F29" : "#FBE3E3"} width={"fit-content"} padding={"4px 4px"} textAlign={"center"}
                                        >
                                            {row.active ? "Activo" : "Inactivo"}
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

                            <Typography variant="h6" fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#8B8D97"} >
                                10
                            </Typography>

                            <KeyboardArrowDownIcon sx={{ color: "#8B8D97", fontSize: 20 }} />

                        </Box>

                        <Typography variant="h6" fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#8B8D97"} ml={2}>
                            Items por página
                        </Typography>


                    </Box>

                    <Box display={"flex"}>

                        <TablePagination
                            component="div"
                            count={1}
                            page={1}
                            rowsPerPage={10}
                            rowsPerPageOptions={[]}
                            labelDisplayedRows={
                                ({ page, count }) =>

                                    <Typography component="span" fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#666666"} ml={2} >
                                        {`${page} de ${count !== -1 ? count + ` Páginas` : ``}`}
                                    </Typography>
                            }
                            labelRowsPerPage={""}
                            onPageChange={() => { }}
                            sx={{
                                '& .MuiTablePagination-actions button': {
                                  color: '#8B8D97', // Cambia este color al que necesites
                                },
                              }}
                        />

                    </Box>

                </Box>


            </Grid>

        </Box>
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