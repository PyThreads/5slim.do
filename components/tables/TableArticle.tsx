"use client"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Poppins } from 'next/font/google';
import Pagination from '@mui/material/Pagination';


const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: "600"
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
    createData('Frozen yoghurt yoghurt yoghurt yoghurt yoghurtyoghurtyoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];


const tableHeads = [
    {
        title: "Nombre",
        colspan: 2,
    },
    {
        title: "Marca"
    },
    {
        title: "Modelo"
    },
    {
        title: "Referencia"
    },
    {
        title: "Condición"
    },
    {
        title: "Precio"
    },
    {
        title: "Cantidad"
    }
]


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "#F1F1F1",
    },

}));


export default function TableArticle() {
    return (
        <React.Fragment>
            <TableContainer component={Paper} sx={{ ...styles.table }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {tableHeads.map((title, index) => (
                                <TableCell
                                    key={title.title}
                                    sx={{
                                        ...styles.tableCell,
                                        ...styles.headTitle,
                                        ...(index + 1 === tableHeads.length ? styles.lastCell : styles.firstCell)
                                    }}
                                >
                                    {title.title}
                                </TableCell>
                            ))}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, key) => (
                            <StyledTableRow
                                key={key}
                            >
                                <TableCell sx={{ ...styles.tableCell, ...styles.firstCell }}>{row.name}</TableCell>
                                <TableCell sx={{ ...styles.tableCell }}>{row.name}</TableCell>
                                <TableCell sx={{ ...styles.tableCell }}>{row.name}</TableCell>
                                <TableCell sx={{ ...styles.tableCell }}>{row.name}</TableCell>
                                <TableCell sx={{ ...styles.tableCell }}>{row.name}</TableCell>
                                <TableCell sx={{ ...styles.tableCell }}>{row.name}</TableCell>
                                <TableCell sx={{ ...styles.tableCell, ...styles.lastCell }}>{row.calories}</TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination count={10} variant="outlined" sx={{ float: "right", marginTop: 2 }} />
        </React.Fragment>
    );
}

const styles = {
    headTitle: {
        fontFamily: poppins.style.fontFamily,
        fontSize: "16px",
    },
    table: {
        width: "100%",
        borderRadius: "22px",
        boxShadow: "none",
        border: "solid 1px",
        borderColor: "#707070"
    },
    tableCell: {
        border: "solid 1px",
        borderLeftColor: "#707070",
        borderRightColor: "#707070",
        borderTop: "none",
        borderBottom: "none",
        textAlign: "center"
    },
    firstCell: {
        borderLeft: "none",
        border: "solid 1px",
    },
    lastCell: {
        borderRight: "none",
    }
}