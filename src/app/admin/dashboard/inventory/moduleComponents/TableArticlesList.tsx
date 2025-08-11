import { Box, Button, Checkbox, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { FilterDateIcon, SortTableIcon } from "../../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Inter } from "next/font/google";
import { IArticle } from "../../../../../../api/src/interfaces";
import { articleService } from "../articleService";
import { useState } from "react";
import SearchTable from "../../../../../../components/inputs/SearchTable";
import FilterPopover from "../../../../../../components/inputs/FilterPopover";
import Image from "next/image";

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
            currentFilter?: { published?: boolean; hasStock?: boolean; lowStock?: boolean }
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

                        <Grid item xs={6} sm={3} md={2}>
                            <FilterPopover 
                                onFilterChange={(filters) => {
                                    setFilers((prev: any) => ({ ...prev, ...filters, page: 1 }))
                                }}
                                currentFilters={{ published: currentFilter?.published, hasStock: currentFilter?.hasStock, lowStock: currentFilter?.lowStock }}
                            />
                        </Grid>
                        
                    </Grid>
                </Grid>

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

                                <TableCell align="center" />

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
                                            Stock
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
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"12px"} ml={1}>
                                            {row.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {articleService.getStockNumber(row)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {0}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#519C66"} fontSize={"12px"}
                                            borderRadius={"8px"} bgcolor={true ? "#32936F29" : "#FBE3E3"} width={"fit-content"} padding={"4px 4px"} textAlign={"center"}
                                        >
                                            {row.published ? "Publicado" : "No publicado"}
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