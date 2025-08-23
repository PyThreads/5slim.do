import { Box, Button, Card, CardContent, Grid, IconButton, MenuItem, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { SortTableIcon } from "../../../../../../components/icons/Svg";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import { Inter } from "next/font/google";
import { ICategory } from "../../../../../../api/src/interfaces";
import { useState } from "react";
import SearchTable from "../../../../../../components/inputs/SearchTable";
import { baseService } from "../../../../utils/baseService";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function TableCategoriesList(
    {
        setFilters,
        rows,
        currentPage,
        limit,
        totalItems,
        totalPages,
        onEditCategory
    }
        :
        {
            rows: ICategory[],
            currentPage: number,
            limit: number
            totalItems: number,
            totalPages: number,
            setFilters: Function
            onEditCategory: Function
        }
) {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    return (
        <Box padding={0} bgcolor={"#FFFFFF"} borderRadius={"12px"} >

            <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"} spacing={1}>

                <Grid item xs={12} md={5} lg={5} >
                    <Typography fontFamily={"Inter"} fontSize={"18px"} fontWeight={600} color={"#2C2D33"}>Categorías</Typography>
                </Grid>

                <Grid container item display={"flex"} alignItems={"center"} xs={12} md={12} lg={7} spacing={1}>
                    <Grid item xs={12} md={6} lg={4}>
                        <SearchTable onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFilters((prev: any) => ({ ...prev, description: e.target.value, page: 1 }))
                        }} />
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

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Descripción
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Slug
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Fecha de creación
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Acciones
                                        </Typography>
                                    </Box>
                                </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ borderBottom: "1px solid #E1E2E9" }}>
                            {rows.map((row: ICategory) => (
                                <TableRow
                                    key={row._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: "0px !important" }}

                                >

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.description}
                                        </Typography>
                                    </TableCell>
                                    
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.slug}
                                        </Typography>
                                    </TableCell>
                                    
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.createdDate ? baseService.formatAmPmLetters(row.createdDate) : 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <IconButton
                                            size="small"
                                            onClick={(event) => {
                                                setAnchorEl(event.currentTarget);
                                                setSelectedCategory(row);
                                            }}
                                            sx={{ color: "#6E7079" }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    </TableContainer>
                </Box>

                {/* Mobile Cards */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {rows.map((row: ICategory) => (
                        <Card key={row._id} sx={styles.mobileCard}>
                            <CardContent sx={styles.mobileCardContent}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                    <Typography variant="h6" sx={styles.mobileCardTitle}>
                                        {row.description}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={(event) => {
                                            setAnchorEl(event.currentTarget);
                                            setSelectedCategory(row);
                                        }}
                                        sx={{ color: "#6E7079" }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Slug:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.slug}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography sx={styles.mobileCardLabel}>Creado:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.createdDate ? baseService.formatAmPmLetters(row.createdDate) : 'N/A'}</Typography>
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

                            <Select
                                value={limit}
                                size="small"
                                variant="outlined"
                                onChange={(e) => setFilters((prev: any) => ({ ...prev, limit: e.target.value, page: 1 }))}
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
                            count={totalItems!}
                            page={currentPage! - 1}
                            rowsPerPage={limit}
                            rowsPerPageOptions={[]}
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
                                setFilters((prev: any) => ({ ...prev, page: newPage + 1 }));
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

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => {
                    setAnchorEl(null);
                    setSelectedCategory(null);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ p: 1, minWidth: 120 }}>
                    <Button
                        fullWidth
                        startIcon={<EditIcon />}
                        onClick={() => {
                            if (selectedCategory) {
                                onEditCategory(selectedCategory);
                            }
                            setAnchorEl(null);
                            setSelectedCategory(null);
                        }}
                        sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            fontFamily: 'Inter',
                            fontSize: '14px',
                            color: '#2C2D33',
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        Editar
                    </Button>
                </Box>
            </Popover>

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

    mobileCard: {
        mb: 2,
        borderRadius: "12px",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    },
    mobileCardContent: {
        padding: "16px !important"
    },
    mobileCardTitle: {
        fontFamily: inter.style.fontFamily,
        fontSize: "14px",
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