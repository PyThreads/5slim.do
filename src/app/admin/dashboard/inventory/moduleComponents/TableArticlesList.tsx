import { Box, Button, Card, CardContent, Checkbox, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { FilterDateIcon, SortTableIcon } from "../../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Inter } from "next/font/google";
import { IArticle } from "../../../../../../api/src/interfaces";
import { articleService } from "../articleService";
import { useState } from "react";
import SearchTable from "../../../../../../components/inputs/SearchTable";
import FilterPopover from "../../../../../../components/inputs/FilterPopover";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function TableArticlesList(
    {
        setFilers,
        rows,
        currentPage,
        limit,
        totalItems,
        totalPages,
        onDoubleClickRow,
        currentFilter
    }
        :
        {
            rows: IArticle[],
            currentPage: number,
            limit: number
            totalItems: number,
            totalPages: number,
            setFilers: Function
            onDoubleClickRow: Function
            currentFilter?: { hasStock?: boolean; lowStock?: boolean; hasOrderedVariants?: boolean; sortByOrders?: string; categories?: number[]; brand?: number; size?: string }
        }
) {
    const [checked, setChecked] = useState<number[]>([]);

    return (
        <Box padding={"22px 21px"} bgcolor={"#FFFFFF"} borderRadius={"12px"} >

            <Grid container spacing={2} alignItems="center">

                <Grid item xs={12} md={4}>
                    <Typography fontFamily={"Inter"}>Artículos</Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Grid container spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <SearchTable onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFilers((prev: any) => ({ ...prev, description: e.target.value, page: 1 }))
                            }} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <FilterPopover 
                                onFilterChange={(filters) => {
                                    setFilers((prev: any) => ({ ...prev, ...filters, page: 1 }))
                                }}
                                currentFilters={{ hasStock: currentFilter?.hasStock, lowStock: currentFilter?.lowStock, hasOrderedVariants: currentFilter?.hasOrderedVariants, sortByOrders: currentFilter?.sortByOrders, categories: currentFilter?.categories, brand: currentFilter?.brand, size: currentFilter?.size }}
                            />
                        </Grid>
                        
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

                                <TableCell align="center" />

                                <TableCell width="20%">
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Descripción
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell align="center" width="10%">
                                    <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"}>
                                        Código
                                    </Typography>
                                </TableCell>

                                <TableCell align="center" width="10%">
                                    <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"}>
                                        Cód. Ext.
                                    </Typography>
                                </TableCell>

                                <TableCell align="center" width="8%">
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Stock
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell align="center" width="8%">
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Ordenado
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell align="center" width="12%">
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"12px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Alerta
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell align="center" width="10%">
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"12px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Órdenes
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell align="center">
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Estado
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ borderBottom: "1px solid #E1E2E9" }}>
                            {rows.map((row: IArticle) => (
                                <TableRow
                                    onDoubleClick={async () => {
                                        const articleDetails = await articleService.getArticleDetails({ slug: row.slug });
                                        onDoubleClickRow(articleDetails)
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

                                    <TableCell align="right" sx={styles.tableCellBody}>
                                        <Box width={36} height={36} position={"relative"} bgcolor={"#F4F5FA"} borderRadius={"8px"}>
                                            <Image
                                                fill
                                                src={row.images.find(item => item.primary)?.url!}
                                                alt="Image articles list"
                                                objectFit="contain"
                                                style={{ borderRadius: "8px" }}
                                            />
                                        </Box>
                                    </TableCell>


                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Link href={`/admin/dashboard/inventory/newArticle/${row._id}`} target="_blank" style={{ textDecoration: 'none' }}>
                                            <Typography 
                                                fontFamily={"Inter"} 
                                                fontWeight={"400"} 
                                                color={"#5570F1"} 
                                                fontSize={"12px"} 
                                                ml={1}
                                                sx={{ 
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        textDecoration: 'underline'
                                                    },
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '150px'
                                                }}
                                            >
                                                {row.description}
                                            </Typography>
                                        </Link>
                                    </TableCell>

                                    <TableCell align="center" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"12px"}>
                                            {row._id}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="center" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"12px"}>
                                            {row.externalCode || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {articleService.getStockNumber(row)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="center" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {articleService.getOrderedStockNumber(row)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="center" sx={styles.tableCellBody}>
                                        {articleService.isLowStock(row) && (
                                            <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#CC5F5F"} fontSize={"12px"}
                                                borderRadius={"8px"} bgcolor={"#FBE3E3"} width={"fit-content"} padding={"4px 4px"} textAlign={"center"} mx={"auto"}
                                            >
                                                Ordenar pronto
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell align="center" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.totalOrders || 0}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="center" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#519C66"} fontSize={"12px"}
                                            borderRadius={"8px"} bgcolor={true ? "#32936F29" : "#FBE3E3"} width={"fit-content"} padding={"4px 4px"} textAlign={"center"} mx={"auto"}
                                        >
                                            {row.published ? "Publicado" : "No publicado"}
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
                    {rows.map((row: IArticle) => (
                        <Card key={row._id} sx={styles.mobileCard} onClick={async () => {
                            const articleDetails = await articleService.getArticleDetails({ slug: row.slug });
                            onDoubleClickRow(articleDetails);
                        }}>
                            <CardContent sx={styles.mobileCardContent}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Box display="flex" alignItems="center">
                                        <Box width={36} height={36} minWidth={36} minHeight={36} position="relative" bgcolor="#F4F5FA" borderRadius="8px" mr={2} flexShrink={0}>
                                            <Image
                                                fill
                                                src={row.images.find(item => item.primary)?.url!}
                                                alt="Image articles list"
                                                objectFit="contain"
                                                style={{ borderRadius: "8px" }}
                                            />
                                        </Box>
                                        <Typography variant="h6" sx={styles.mobileCardTitle}>
                                            {row.description}
                                        </Typography>
                                    </Box>
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
                                    <Typography sx={styles.mobileCardLabel}>Código:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row._id}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Cód. Ext.:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.externalCode || '-'}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Stock:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{articleService.getStockNumber(row)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Ordenado:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{articleService.getOrderedStockNumber(row)}</Typography>
                                </Box>
                                {articleService.isLowStock(row) && (
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography sx={styles.mobileCardLabel}>Alerta Stock:</Typography>
                                        <Typography sx={{
                                            ...styles.mobileCardValue,
                                            color: "#CC5F5F",
                                            backgroundColor: "#FBE3E3",
                                            padding: "4px 8px",
                                            borderRadius: "8px",
                                            fontSize: "12px"
                                        }}>
                                            Ordenar pronto
                                        </Typography>
                                    </Box>
                                )}
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Total Órdenes:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.totalOrders || 0}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography sx={styles.mobileCardLabel}>Estado:</Typography>
                                    <Typography sx={{
                                        ...styles.mobileCardValue,
                                        color: row.published ? "#519C66" : "#CC5F5F",
                                        backgroundColor: row.published ? "#32936F29" : "#FBE3E3",
                                        padding: "4px 8px",
                                        borderRadius: "8px",
                                        fontSize: "12px"
                                    }}>
                                        {row.published ? "Publicado" : "No publicado"}
                                    </Typography>
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