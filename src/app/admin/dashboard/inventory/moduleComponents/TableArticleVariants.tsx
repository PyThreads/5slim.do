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
import { IArticleImages, IArticleStatus, IArticlesVariants } from '../../../../../../api/src/interfaces';
import { baseService } from '../../../../utils/baseService';
import { UploadImageIcon } from '../../../../../../components/icons/Svg';
import axios from '../../../../../../context/adminAxiosInstance';
import { eventBus } from '../../../../utils/broadcaster';
import Image from 'next/image';

export default function TableArticleVariants({ rows = [], onChange }: { rows: IArticlesVariants[], onChange: Function }) {
    const refInput = React.useRef<HTMLInputElement>(null);
    const refInput2 = React.useRef<HTMLInputElement>(null);
    const [newOne, setNewOne] = React.useState<Partial<IArticlesVariants>>(() => ({
        _id: uuidv4(),
        costPrice: 0,
        sellingPrice: 0,
        status: IArticleStatus.NEW,
        stock: 1,
        images: []
    }));

    const handleChangeNewOne = (value: any, name: any, row?: IArticlesVariants | null | undefined) => {
        if (row) {
            const updatedRow: IArticlesVariants = {
                ...row,
                [name]: value
            };

            const arr = [...rows];
            const index = arr.findIndex((item) => item._id === updatedRow._id);

            if (index !== -1) {
                arr[index] = updatedRow;
                onChange([...arr]);
            }
            return;
        }

        setNewOne(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const addSelected = () => {
        const arr = [...rows];

        for (let i = 1; i <= newOne.stock!; i++) {
            const variant: IArticlesVariants = {
                _id: uuidv4(),
                costPrice: newOne.costPrice!,
                sellingPrice: newOne.sellingPrice!,
                status: IArticleStatus.NEW,
                stock: 1,
                images: newOne.images!
            };
            arr.push(variant);
        }

        onChange(arr);

        setNewOne({
            _id: uuidv4(),
            costPrice: 0,
            sellingPrice: 0,
            status: IArticleStatus.NEW,
            stock: 1,
            images: []
        });
    }

    const removeSelected = (row: IArticlesVariants) => {
        const arr = rows.filter((item) => item._id !== row._id);
        onChange([...arr]);
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary = false, item?: IArticlesVariants | null) => {
        try {
            const file = e.target.files;
            if (!file || file.length === 0) return;

            const formData = new FormData();
            for (const i in file) {
                formData.append(i, file[i]);
            }

            const { data }: { data: any } = await axios.post("/admin/private/images/upload", formData);
            let result = data.data as IArticleImages[];

            if (isPrimary && result.length > 0) {
                result = result.map((image, index) => ({
                    ...image,
                    primary: index === 0
                }));
            }

            if (item) {
                const arr = [...rows];
                const index = arr.findIndex((value) => item._id === value._id);
                if (index !== -1) {
                    const currentImages = arr[index].images || [];
                    const cleanedImages = currentImages.map(img => ({ ...img, primary: false }));
                    const list = [...cleanedImages, ...result];

                    arr[index] = {
                        ...arr[index],
                        images: list
                    };

                    onChange([...arr]);
                }
                return;
            }

            const cleanedNewImages = (newOne.images || []).map(img => ({ ...img, primary: false }));
            const newImageList = [...cleanedNewImages, ...result];

            setNewOne({
                ...newOne,
                images: newImageList
            });

        } catch (error) {
            eventBus.emit("notify", {
                message: "Ha ocurrido un error al subir la imagen.",
                open: true,
                type: "error",
                title: "Upss!"
            });
        } finally {
            if (refInput.current) refInput.current.value = "";
            if (refInput2.current) refInput2.current.value = "";
        }
    };

    return (
        <Box overflow={"auto"} maxHeight={"70vh"} sx={{
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

                                <Box textAlign={"center"}
                                    component={"label"} htmlFor="upload-image-variant"
                                >
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        id="upload-image-variant"
                                        accept="image/*"
                                        multiple={false}
                                        onChange={(e) => handleChange(e, true)}
                                        ref={refInput}

                                    />
                                    <Box width={36} height={36} position={"relative"} bgcolor={"#F4F5FA"} borderRadius={"8px"} justifyContent={"center"} display={"flex"} alignItems={"center"}>
                                        {
                                            newOne.images!.length > 0 ? (
                                                <Image
                                                    fill
                                                    key={newOne.images!.find(item => item.primary)?.url!}
                                                    src={newOne.images!.find(item => item.primary)?.url!}
                                                    alt="Image articles list"
                                                    objectFit="contain"
                                                    style={{ borderRadius: "8px" }}
                                                />

                                            )
                                                :
                                                (

                                                    <UploadImageIcon filled={false} />
                                                )
                                        }
                                    </Box>

                                </Box>
                            </TableCell>
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
                            <TableCell><Typography fontFamily={"Inter"} fontSize={"16px"}></Typography></TableCell>
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

                                    <Box textAlign={"center"}
                                        component={"label"} htmlFor={"upload-image-variant-listed" + row._id}
                                    >
                                        <input
                                            type="file"
                                            style={{ display: "none" }}
                                            id={"upload-image-variant-listed" + row._id}
                                            accept="image/*"
                                            multiple={false}
                                            onChange={(e) => handleChange(e, true, row)}
                                            ref={refInput2}

                                        />
                                        <Box width={36} height={36} position={"relative"} bgcolor={"#F4F5FA"} borderRadius={"8px"} justifyContent={"center"} display={"flex"} alignItems={"center"}>
                                            {
                                                row.images?.length > 0 ? (
                                                    <Image
                                                        fill
                                                        key={newOne.images!.find(item => item.primary)?.url!}
                                                        src={row.images.find(item => item.primary)?.url!}
                                                        alt="Image articles list"
                                                        objectFit="contain"
                                                        style={{ borderRadius: "8px" }}
                                                    />

                                                )
                                                    :
                                                    (

                                                        <UploadImageIcon filled={false} />
                                                    )
                                            }
                                        </Box>

                                    </Box>
                                </TableCell>

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