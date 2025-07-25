import { useCallback, useEffect, useState } from "react";
import { IArticle, IArticleCart, IArticlesVariants, IClient, IOrder, IOrderStatus, IPaginationResult, IPaymentType } from "../../../../../../api/src/interfaces";
import { ordersService } from "../ordersService";
import { userService } from "../../users/userService";
import { articleService } from "../../inventory/articleService";
import { Box, Button, CircularProgress, Grid, MenuItem, Paper, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import { BagOrderIcon } from "../../../../../../components/icons/Svg";
import { Inter } from "next/font/google";
import { baseService } from "../../../../utils/baseService";
import SearchTable from "../../../../../../components/inputs/SearchTable";
import CustomField, { AutocompleteCustom } from "../../../../../../components/inputs/CustomField";
import CustomModal from "../../../../../../components/modals/CustomModal";
import Image from "next/image";
import { eventBus } from "../../../../utils/broadcaster";
import React from "react";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function CreateOrder({ setOpenModal }: { setOpenModal: Function }) {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const [filtersArticle, setFilersArticles] = useState<string>("")
    const [filtersClient, setFiltersClient] = useState<string>("")
    const [result, setResult] = useState<IPaginationResult>()
    const [resultArticles, setResultArticles] = useState<IPaginationResult>()
    const [selectedArticle, selectArticle] = useState<IArticle | null>(null)
    const [openModalArticle, setOpenModalArticle] = useState(false)
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<Partial<IOrder>>({
        total: { total: 0, discount: 0, subTotal: 0 },
        status: IOrderStatus.PENDING,
        articles: []
    })

    const totals = ordersService.getTotalOrder(order.articles as IArticleCart[])

    const getAllClients = useCallback(async () => {
        const result = await userService.getAllClients({ fullName: filtersClient })
        setResult(result)
    }, [setResult, filtersClient])

    useEffect(() => {
        getAllClients()
    }, [filtersClient, getAllClients])

    const getAllArticles = useCallback(async () => {
        const result = await articleService.getAllArticles({ description: filtersArticle })
        setResultArticles(result)
    }, [setResultArticles, filtersArticle])

    useEffect(() => {
        getAllArticles()
    }, [filtersArticle, getAllArticles])

    const createOrder = useCallback(async () => {
        try {
            setLoading(true);
            ordersService.validateNewOrder(order as IOrder)
            await ordersService.createOrder(order as IOrder);
            setOrder({
                total: { total: 0, discount: 0, subTotal: 0 },
                status: IOrderStatus.PENDING,
                articles: []
            })
            setOpenModal(false);
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Ha ocurrido un error al crear la orden."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })

        } finally {
            setLoading(false);

        }
    }, [order])

    return (
        <Box height={"70vh"}
            sx={{
                ...style.hideScroll,
                padding: { xs: "24px 16px", md: "28px 24px" }
            }}
        >
            <Grid p={0} m={0} height={"90%"}>

                <Grid item container height={10} justifyContent={"space-between"}>
                    <Typography fontFamily={"Poppins"} fontSize={"20px"} fontWeight={600}>Nueva Orden</Typography>
                    <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px", color: "#000" }}
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    />
                </Grid>

                <Grid container spacing={2} xs={12} mt={2}>

                    <Grid item xs={12} md={12} lg={6} >

                        <Grid xs={12} >
                            <Typography fontFamily={"Poppins"} fontSize={"16px"} color={"#8B8D97"} fontWeight={500}>Detalles De La Orden</Typography>
                        </Grid>

                        <Grid item xs={12} mt={2}>
                            <AutocompleteCustom
                                getDefaultValue={() => { order?.client || {} }}
                                isOptionEqualToValue={(option: any, value: any) => option.fullClient === value.fullClient}
                                options={result?.list || []}
                                getOptionLabel={(option: IClient) => (
                                    option.fullClient
                                )}
                                size="small"
                                renderOption={(props: any, option: any) => {
                                    const { key, ...rest } = props;
                                    return (
                                        <Box key={key} display="flex" alignItems="center" {...rest}>
                                            <AccountCircleIcon fontSize="medium" sx={{ color: "#8B8D97", marginRight: 1 }} />
                                            <Typography fontFamily="Inter" fontSize="14px" color="#8B8D97">
                                                {option.fullClient}
                                            </Typography>
                                        </Box>
                                    );
                                }}
                                onChange={(_event: any, newValue: IClient | null) => {
                                    const orderStruct = order ? { ...order } : {};

                                    if (!newValue && (!orderStruct.client || !orderStruct.client._id)) {
                                        delete orderStruct.client
                                        setOrder(orderStruct)
                                        return
                                    }

                                    if (!newValue) return

                                    setOrder({
                                        ...order, client: {
                                            _id: newValue._id, fullClient: newValue.fullClient, fullName: newValue.fullName, address: newValue.addresses.find(address => address.default)!, email: newValue.email,
                                            createdDate: newValue.createdDate!
                                        }
                                    })
                                }}
                                customErrorText={""}
                                label="Cliente"
                                onSearch={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setFiltersClient(event.target.value)
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} mt={2} >

                            <CustomField noValidate name="paymentType" size="small" fullWidth select label="Tipo De Pago" value={order?.paymentType || ""}
                                onChange={(e: any) => {
                                    setOrder({ ...order, paymentType: e.target.value as IPaymentType })
                                }}
                            >
                                {
                                    Object.entries(IPaymentType).map(([key, value]) =>
                                    (
                                        <MenuItem key={value} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))
                                }
                            </CustomField>

                        </Grid>


                        <Grid item xs={12} mt={2}>
                            <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#53545C"} fontWeight={400} mb={"8px"}>Fecha De La Orden</Typography>
                            <CustomField name="discount.endDate" fullWidth type="datetime-local" noValidate size="small"
                                value={
                                    baseService.dateToDateTimeLocal(order?.createdDate || "")
                                }
                                onChange={(e: any) => {
                                    const date = baseService.newDate(e.target.value);
                                    setOrder({ ...order, createdDate: date })
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} mt={2} >
                            <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#53545C"} fontWeight={400} mb={"8px"}>Estado</Typography>
                            <CustomField noValidate name="status" size="small" fullWidth select value={order.status}
                                onChange={(e: any) => {
                                    setOrder({ ...order, status: e.target.value })
                                }}
                            >

                                {
                                    Object.entries(IOrderStatus).map(([_, value]) =>
                                    (
                                        <MenuItem key={value} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))
                                }
                            </CustomField>
                        </Grid>

                        <Grid item xs={12} mt={2}>
                            <CustomField noValidate name="comment" size="small" fullWidth value={order.comment} placeholder="Nota" multiline rows={3}
                                onChange={(e: any) => {
                                    setOrder({ ...order, comment: e.target.value })
                                }}
                            />
                        </Grid>

                    </Grid>

                    <Grid item xs={12} md={12} lg={6} >

                        <Grid xs={12}>
                            <Typography fontFamily={"Poppins"} fontSize={"16px"} color={"#8B8D97"} fontWeight={500}>Artículos</Typography>
                        </Grid>

                        <Grid item xs={12} mt={3} >
                            <Grid item xs={12} mt={3}>
                                <SearchTable
                                    onChange={(e) => {
                                        setFilersArticles(e.target.value);
                                    }}
                                    handleClick={(e) => {
                                        setAnchorEl(e.currentTarget)
                                    }}
                                />

                            </Grid>

                            <Grid item xs={12} mt={3} sx={{ ...style.hideScroll }} >

                                {
                                    order.articles!.length > 0 && order.articles!.map((item: IArticleCart) => (

                                        <React.Fragment key={item.variant._id}>
                                            <Box display={"flex"} mt={1}>
                                                <Box height={49} width={49} minWidth={49} borderRadius={"8px"} border={"1px solid #00000007"} boxShadow={"0px 0px 4px #F1F3F9"} position={"relative"} >
                                                    <Image
                                                        src={item.variant.images.find(item => item.primary)?.url! || "/Image.svg"}
                                                        fill
                                                        alt="Image articles list"
                                                        objectFit="contain"
                                                        style={{ borderRadius: "8px" }}
                                                    />
                                                </Box>
                                                <Box ml={"14px"} width={"100%"} position={"relative"} height={"49px"}>

                                                    <Box width={"100% !important"} display={"flex"} justifyContent={"space-between"} position={"absolute"} top={0}>
                                                        <Tooltip title={item.description} placement="top" arrow>
                                                            <Typography fontFamily={"Inter"} sx={{ fontSize: { xs: "10px", md: "12px" } }} color={"#000"} fontWeight={400}>{item.description.length > 34 ? item.description.slice(0, 34 - 3) + "..." : item.description}</Typography>
                                                        </Tooltip>

                                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#CC5F5F"} fontWeight={500} sx={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                setOrder({
                                                                    ...order,
                                                                    articles: order?.articles?.filter(value => value.variant._id !== item.variant._id)
                                                                }
                                                                )
                                                            }}
                                                        >
                                                            Eliminar
                                                        </Typography>
                                                    </Box>

                                                    <Box width={"100% !important"} display={"flex"} justifyContent={"space-between"} position={"absolute"} bottom={0}>
                                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#8B8D97"} fontWeight={400}>{baseService.dominicanNumberFormat(item.variant.sellingPrice)}</Typography>
                                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#8B8D97"} fontWeight={500} sx={{ cursor: "pointer" }}>{item.variant.stock}</Typography>
                                                    </Box>

                                                </Box>
                                            </Box>

                                            <Box borderBottom={"1px solid #00000007"} paddingBottom={"5px"} mt={1} width={"100%"} display={"flex"} justifyContent={"space-between"}>
                                                <Typography fontFamily={"Inter"} fontSize={"15px"} color={"#8B8D97"} fontWeight={500}>Sub-total</Typography>
                                                <Typography fontFamily={"Inter"} fontSize={"15px"} color={"#33343A"} fontWeight={500}>{baseService.dominicanNumberFormat(item.variant.sellingPrice * item.variant.stock)}</Typography>
                                            </Box>

                                        </React.Fragment>

                                    ))
                                }

                                {
                                    order.articles!.length === 0 &&

                                    <Box height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
                                        <Box bgcolor={"#E1E2E9"} width={140} height={140} borderRadius={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} >
                                            <BagOrderIcon />
                                        </Box>

                                        <Typography fontFamily={"Poppins"} sx={{ fontSize: { xs: "14px", sm: "20px" } }} color={"#000"} fontWeight={500} mt={"40px"}>
                                            Agregar Artículos
                                        </Typography>

                                        <Typography fontFamily={"Inter"} sx={{ fontSize: { xs: "11px", sm: "13px"} }} textAlign={"center"} color={"#8B8D97"} fontWeight={500} mt={"12px"}>
                                            Busca y Agrega Artículos a Esta Orden.
                                        </Typography>
                                    </Box>
                                }

                            </Grid>
                            {
                                order.articles!.length > 0 &&
                                <Grid item xs={12} mt={3}>
                                    <Box display={"flex"} justifyContent={"space-between"}>
                                        <Typography fontFamily={"Inter"} fontSize={"16px"} color={"#8B8D97"} fontWeight={500} >Descuento</Typography>
                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#33343A"} fontWeight={500} >{ordersService.dominicanNumberFormat(totals.discount!)}</Typography>
                                    </Box>

                                    <Box display={"flex"} justifyContent={"space-between"}>
                                        <Typography fontFamily={"Inter"} fontSize={"16px"} color={"#8B8D97"} fontWeight={500} >Subtotal</Typography>
                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#33343A"} fontWeight={500} >{ordersService.dominicanNumberFormat(totals.subTotal)}</Typography>
                                    </Box>

                                    <Box display={"flex"} justifyContent={"space-between"}>
                                        <Typography fontFamily={"Inter"} fontSize={"16px"} color={"#8B8D97"} fontWeight={500} >Total</Typography>
                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#33343A"} fontWeight={500} >{ordersService.dominicanNumberFormat(totals.total)}</Typography>
                                    </Box>
                                </Grid>
                            }
                        </Grid>
                    </Grid>

                </Grid>

                <Grid display={"flex"} justifyContent={"center"} mt={"40px"} pb={2}>
                    <Box sx={{ display: { xs: "flex", md: "block" } }}>
                        <Button sx={style.btnAdd} onClick={() => setOpenModal(false)}>Cancelar</Button>
                        <Button sx={{ ...style.btnAdd, ...style.btnAddFilled }}
                            onClick={createOrder}>
                            {loading && <CircularProgress size={15} color="inherit" sx={{ marginRight: 1 }} />}
                            {!loading ? "Crear Orden" : "Creando Orden"}
                        </Button>
                    </Box>
                </Grid>

            </Grid>


            <Popover
                id={Boolean(anchorEl) ? 'simple-popover' : undefined}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                disableAutoFocus
                disableEnforceFocus
                PaperProps={{
                    sx: {
                        width: anchorEl && (anchorEl?.clientWidth || 0) + 39,
                        height: 300,
                        display: anchorEl ? "block" : "none",
                        marginLeft: "-40px",
                        pointerEvents: "auto",
                        ...style.hideScroll
                    }
                }}
            >
                <Box sx={{ height: 100, paddingLeft: 1, paddingRight: 1 }}>
                    {
                        resultArticles?.list.map((item: IArticle) => (
                            <Box display={"flex"} key={item._id} borderBottom={"1px solid #00000007"} paddingBottom={"12px"} mt={1}>
                                <Box height={49} width={49} minWidth={49} borderRadius={"8px"} border={"1px solid #00000007"} boxShadow={"0px 0px 4px #F1F3F9"} position={"relative"} >
                                    <Image
                                        src={item.images.find(item => item.primary)?.url!}
                                        fill
                                        alt="Image articles list"
                                        objectFit="contain"
                                        style={{ borderRadius: "8px" }}
                                    />
                                </Box>
                                <Box ml={"14px"} width={"100%"} position={"relative"} height={"49px"}>
                                    <Tooltip title={item.description} placement="top" arrow>
                                        <Typography fontFamily={"Inter"} sx={{ fontSize: { xs: "12px", md: "14px" } }} color={"#000"} fontWeight={400}>{item.description.length > 34 ? item.description.slice(0, 34 - 3) + "..." : item.description}</Typography>
                                    </Tooltip>

                                    <Box width={"100% !important"} display={"flex"} justifyContent={"space-between"} position={"absolute"} bottom={0}>
                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#8B8D97"} fontWeight={400}>{baseService.dominicanNumberFormat(item.variants?.length > 0 ? item.variants[0].sellingPrice : 0)}</Typography>
                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#5570F1"} fontWeight={500} sx={{ cursor: "pointer" }}
                                            onClick={() => {
                                                selectArticle(item);
                                                setOpenModalArticle(true);
                                            }}
                                        >Agregar</Typography>
                                    </Box>
                                </Box>
                            </Box>

                        ))
                    }
                </Box>
            </Popover >

            <CustomModal open={openModalArticle} borderRadius={"8px"}>
                <Box padding={"10px 10px"} minHeight={200} maxHeight={"80vh"}>
                    <Grid item container height={10} justifyContent={"space-between"}>
                        <Typography fontFamily={"Poppins"} fontSize={"20px"} fontWeight={600}>Seleccionar Variante</Typography>
                        <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px", color: "#000" }}
                            onClick={() => {
                                setOpenModalArticle(false);
                                selectArticle(null);
                                setAnchorEl(null);
                            }}
                        />
                    </Grid>

                    <TableContainer component={Paper} sx={{
                        marginTop: "40px",
                        overflowX: "auto",
                        width: {xs: 300, md: "100%"}
                    }} >
                        <Table size="small" aria-label="a dense table">

                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell><Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Estado</Typography></TableCell>
                                    <TableCell><Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Stock</Typography></TableCell>
                                    <TableCell align="left"> <Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Costo</Typography></TableCell>
                                    <TableCell align="left">  <Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Venta</Typography></TableCell>
                                    <TableCell align="left">  <Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Ganancia</Typography></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {selectedArticle && selectedArticle.variants.map((row: IArticlesVariants) => (
                                    <TableRow
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        onDoubleClick={() => {

                                            const currentClickedArticle: any = { ...selectedArticle };

                                            const itemOnList = order.articles!.find(item => item.variant._id === row._id)

                                            if (itemOnList) {
                                                if (itemOnList.variant.stock + 1 > row.stock) {
                                                    eventBus.emit("notify", { message: "No hay stock suficiente, seleccione otra variante.", open: true, type: "error", title: "Error!", delay: 2000 })
                                                    return
                                                }
                                                const arr = [...order.articles!].filter((currentInCart) => currentInCart.variant._id !== itemOnList.variant._id);
                                                itemOnList.variant.stock += 1
                                                setOrder({ ...order, articles: [...arr, itemOnList] })

                                            } else {

                                                if (row.stock < 1) {
                                                    eventBus.emit("notify", { message: "No hay stock suficiente, seleccione otra variante.", open: true, type: "error", title: "Error!", delay: 2000 })
                                                    return
                                                }

                                                setOrder({ ...order, articles: [...order.articles!, { ...currentClickedArticle, variant: { ...row, stock: 1 } }] })
                                            }

                                            eventBus.emit("notify", { message: "Artículo agregado al carrito.", open: true, type: "success", title: "Agregado!", delay: 1000 })
                                        }}
                                    >

                                        <TableCell align="right">

                                            <Box textAlign={"center"}
                                                component={"label"} htmlFor={"upload-image-variant-listed" + row._id}
                                            >
                                                <Box width={36} height={36} position={"relative"} bgcolor={"#F4F5FA"} borderRadius={"8px"} justifyContent={"center"} display={"flex"} alignItems={"center"}>
                                                    {

                                                        row.images?.length > 0 ?
                                                            (
                                                                <Image
                                                                    fill
                                                                    key={row.images.find(item => item.primary)?.url!}
                                                                    src={row.images.find(item => item.primary)?.url!}
                                                                    alt="Image articles list"
                                                                    objectFit="contain"
                                                                    style={{ borderRadius: "8px" }}
                                                                />)
                                                            :
                                                            (<Image
                                                                alt={"5slim.do. logo"}
                                                                style={{ objectFit: "cover" }}
                                                                width={46}
                                                                height={46}
                                                                src={"/Image.svg"}
                                                            />)
                                                    }
                                                </Box>

                                            </Box>
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.status}
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.stock}
                                        </TableCell>

                                        <TableCell align="center">
                                            {baseService.dominicanNumberFormat(row.costPrice)}
                                        </TableCell>

                                        <TableCell align="center">
                                            {baseService.dominicanNumberFormat(row.sellingPrice)}
                                        </TableCell>

                                        <TableCell align="center">
                                            {baseService.dominicanNumberFormat(row.sellingPrice - row.costPrice)}
                                        </TableCell>

                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
            </CustomModal>

        </Box >
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
    btnAdd: {
        fontSize: { xs: "12px", md: "14px" },
        fontFamily: inter.style.fontFamily,
        height: { xs: "36px", sm: "36px", md: "40px", lg: "58px" },
        textTransform: "none",
        borderRadius: "12px",
        padding: "8px",
        "&:hover": {
            backgroundColor: "transparent",
        },
        borderColor: "#5570F1",
        border: "1px solid",
        color: "#5570F1",
        width: { xs: 100, md: "180px" },
        margin: "0px 8px"
    },
    btnAddFilled: {
        backgroundColor: "#5570F1",
        color: "#FFFFFF",
        "&:hover": {
            backgroundColor: "#5570F1",
        }
    }
}