import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CustomField from '../../../../../../components/inputs/CustomField';
import { v4 as uuidv4 } from 'uuid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { Box, MenuItem, Typography } from '@mui/material';
import { IArticleStatus, IArticlesVariants } from '../../../../../../api/src/interfaces';
import { baseService } from '../../../../utils/baseService';

export default function TableArticleVariants({ rows = [], onChange }: { rows: IArticlesVariants[], onChange: Function }) {

    const [newOne, setNewOne] = React.useState<IArticlesVariants>({
        _id: uuidv4(),
        costPrice: 0,
        sellingPrice: 0,
        status: IArticleStatus.NEW,
        stock: 1
    })

    const handleChangeNewOne = (value: any, name: any, row?: IArticlesVariants | null | undefined) => {

        if (row) {
            const obt: IArticlesVariants = {
                ...row,
                [name]: value
            };

            const arr = [...rows];
            const index = arr.findIndex((item) => item._id === obt._id);

            if (index !== -1) {
                arr[index] = obt;
                onChange([...arr]); // Clonamos para asegurar rerender
            }

            return;
        }

        setNewOne({
            ...newOne,
            [name]: value
        })
    }

    const addSelected = () => {

        const arr = [...rows];

        for (let stockIn = 1; stockIn <= newOne.stock; stockIn++) {
            const object: IArticlesVariants = {
                _id: uuidv4(),
                costPrice: newOne.costPrice,
                sellingPrice: newOne.sellingPrice,
                status: IArticleStatus.NEW,
                stock: 1
            }

            arr.push(object)
        }

        onChange(arr)

        setNewOne({
            _id: uuidv4(),
            costPrice: 0,
            sellingPrice: 0,
            status: IArticleStatus.NEW,
            stock: 1
        })
    }

    const removeSelected = (row: IArticlesVariants) => {
        const arr = rows.filter((item) => item._id !== row._id);
        onChange([...arr])
    }

    return (
        <Box overflow={"auto"} maxHeight={"80vh"} sx={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none',
            }
        }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 900 }} size="small" aria-label="a dense table">
                    <TableBody>
                        <TableRow>
                            <TableCell align="right">
                                <CustomField size={"small"} placeholder="Nombres" fullWidth noValidate select value={newOne.status}
                                    name="status"
                                    onChange={(e: any) => handleChangeNewOne(e.target.value, "status")}
                                >

                                    {Object.entries(IArticleStatus).map((option) => (
                                        <MenuItem key={option[1]} value={option[1]}>
                                            {option[1]}
                                        </MenuItem>
                                    ))}
                                    <MenuItem>

                                    </MenuItem>
                                </CustomField>
                            </TableCell>

                            <TableCell align="right">
                                <CustomField size={"small"} placeholder="Cantidad" fullWidth noValidate type="number" name="stock" value={newOne.stock} onChange={(e: any) => {
                                    handleChangeNewOne(Number(e.target.value) || "", "stock")
                                }} />
                            </TableCell>

                            <TableCell align="right">
                                <CustomField size={"small"} placeholder="Costo" fullWidth noValidate name="costPrice" type="number" value={newOne.costPrice} onChange={(e: any) => {
                                    handleChangeNewOne(Number(e.target.value) || "", "costPrice")
                                }} />
                            </TableCell>

                            <TableCell align="right">
                                <CustomField size={"small"} placeholder="Venta" fullWidth noValidate name="sellingPrice" type="number" value={newOne.sellingPrice} onChange={
                                    (e: any) => handleChangeNewOne(Number(e.target.value) || "", "sellingPrice")
                                } />
                            </TableCell>

                            <TableCell align="right">
                                <CustomField size={"small"} placeholder="Ganancia" fullWidth noValidate disabled value={
                                    baseService.dominicanNumberFormat(Number(newOne.sellingPrice || 0) - Number(newOne.costPrice || 0))
                                } />
                            </TableCell>

                            <TableCell align="right">
                                <AddCircleIcon sx={{ cursor: "pointer", color: '#A3A3A3' }} onClick={addSelected} />
                            </TableCell>

                        </TableRow>

                    </TableBody>
                </Table>

            </TableContainer>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 900 }} size="small" aria-label="a dense table">

                    <TableHead>
                        <TableRow>
                            <TableCell><Typography fontFamily={"Inter"} fontSize={"16px"}>Estado</Typography></TableCell>
                            <TableCell><Typography fontFamily={"Inter"} fontSize={"16px"}>Stock</Typography></TableCell>
                            <TableCell align="left"> <Typography fontFamily={"Inter"} fontSize={"16px"}>Costo</Typography></TableCell>
                            <TableCell align="left">  <Typography fontFamily={"Inter"} fontSize={"16px"}>Venta</Typography></TableCell>
                            <TableCell align="left">  <Typography fontFamily={"Inter"} fontSize={"16px"}>Ganancia</Typography></TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {rows.map((row, key) => (
                            <TableRow
                                key={key}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right">
                                    <CustomField size={"small"} placeholder="Nombres" fullWidth noValidate select value={row.status}
                                        onChange={(e: any) => handleChangeNewOne(e.target.value, "status", row)}
                                    >

                                        {Object.entries(IArticleStatus).map((option) => (
                                            <MenuItem key={option[1]} value={option[1]}>
                                                {option[1]}
                                            </MenuItem>
                                        ))}
                                        <MenuItem>

                                        </MenuItem>
                                    </CustomField>
                                </TableCell>
                                <TableCell align="right">
                                    <CustomField size={"small"} placeholder="Cantidad" fullWidth noValidate type="number" name="stock" value={row.stock} onChange={(e: any) => {
                                        handleChangeNewOne(Number(e.target.value) || "", "stock", row)
                                    }} />
                                </TableCell>

                                <TableCell align="right">
                                    <CustomField size={"small"} placeholder="Costo" fullWidth noValidate name="costPrice" type="number" value={row.costPrice} onChange={(e: any) => {
                                        handleChangeNewOne(Number(e.target.value) || "", "costPrice", row)
                                    }} />
                                </TableCell>

                                <TableCell align="right">
                                    <CustomField size={"small"} placeholder="Venta" fullWidth noValidate name="sellingPrice" type="number" value={row.sellingPrice} onChange={
                                        (e: any) => handleChangeNewOne(Number(e.target.value) || "", "sellingPrice", row)
                                    } />
                                </TableCell>
                                <TableCell align="right">
                                    <CustomField size={"small"} placeholder="Ganancia" fullWidth noValidate disabled value={
                                        baseService.dominicanNumberFormat(Number(row.sellingPrice || 0) - Number(row.costPrice || 0))
                                    } />
                                </TableCell>

                                <TableCell align="right">
                                    <DoNotDisturbOnIcon sx={{ cursor: "pointer", color: '#A3A3A3' }} onClick={() => removeSelected(row)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}