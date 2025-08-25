import { useCallback, useEffect, useState } from "react";
import { IArticle, IArticleCart, IArticlesVariants, IClient, IOrder, IOrderStatus, IOrderType, IOrderDiscountType, IPaymentStatus, IPaginationResult } from "../../../../../../api/src/interfaces";
import { ordersService } from "../ordersService";
import { userService } from "../../users/userService";
import { articleService } from "../../inventory/articleService";
import { Box, Button, CircularProgress, Grid, MenuItem, Paper, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Chip, Autocomplete, TextField } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { BagOrderIcon } from "../../../../../../components/icons/Svg";
import { Inter } from "next/font/google";
import { baseService } from "../../../../utils/baseService";
import SearchTable from "../../../../../../components/inputs/SearchTable";
import SearchFilterPopover from "../../../../../../components/inputs/SearchFilterPopover";
import CustomField, { AutocompleteCustom } from "../../../../../../components/inputs/CustomField";
import CustomModal from "../../../../../../components/modals/CustomModal";
import Image from "next/image";
import { eventBus } from "../../../../utils/broadcaster";
import React from "react";
import { useRouter } from 'next/navigation';
import CreateClientForm from "../../users/moduleComponents/forms/createClientForm/index";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function CreateOrder({ setOpenModal }: { setOpenModal: Function }) {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const router = useRouter()
    const [filtersArticle, setFilersArticles] = useState<string>("")
    const [filtersClient, setFiltersClient] = useState<string>("")
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [selectedBrand, setSelectedBrand] = useState<number | undefined>(undefined)
    const [sizeFilter, setSizeFilter] = useState<string>("")
    const [result, setResult] = useState<IPaginationResult>()
    const [resultArticles, setResultArticles] = useState<IPaginationResult>()
    const [selectedArticle, selectArticle] = useState<IArticle | null>(null)
    const [openModalArticle, setOpenModalArticle] = useState(false)
    const [openCreateClientModal, setOpenCreateClientModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<Partial<IOrder>>({
        total: { total: 0, discount: 0, subTotal: 0 },
        status: IOrderStatus.PENDING,
        orderType: IOrderType.CASH,
        paymentStatus: IPaymentStatus.NOT_PAID,
        payments: [],
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
        const result = await articleService.getArticlesForOrders({ 
            articleSearch: filtersArticle,
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            brand: selectedBrand,
            size: sizeFilter || undefined
        })
        setResultArticles(result)
    }, [setResultArticles, filtersArticle, selectedCategories, selectedBrand, sizeFilter])

    useEffect(() => {
        getAllArticles()
    }, [filtersArticle, selectedCategories, selectedBrand, sizeFilter, getAllArticles])

    const createOrder = useCallback(async () => {
        try {
            setLoading(true);
            ordersService.validateNewOrder(order as IOrder)
            const result = await ordersService.createOrder(order as IOrder);
            setOrder({
                total: { total: 0, discount: 0, subTotal: 0 },
                status: IOrderStatus.PENDING,
                orderType: IOrderType.CASH,
                paymentStatus: IPaymentStatus.NOT_PAID,
                payments: [],
                articles: []
            })
            router.push(`/admin/dashboard/orders/${result._id}`);
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Ha ocurrido un error al crear la orden."
            eventBus.emit("notify", { message, open: true, type: "error", title: "Error!" })

        } finally {
            setLoading(false);

        }
    }, [order, router])

    return (
        <Box height={"70vh"}
            sx={{
                ...style.hideScroll,
                padding: { xs: "24px 16px", md: "28px 24px" },
                minWidth : "90vw"
            }}
        >
            <Grid p={0} m={0} xs={12}>
                <Grid item container height={10} justifyContent={"space-between"}>
                    <Typography fontFamily={"Poppins"} fontSize={"20px"} fontWeight={600}>Nueva Orden</Typography>
                    <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px", color: "#000" }}
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    />
                </Grid>

                <Grid container spacing={2} xs={12} mt={2}>

                    <Grid item xs={12} md={12} lg={6}>

                        <Grid xs={12} >
                            <Typography fontFamily={"Poppins"} fontSize={"16px"} color={"#8B8D97"} fontWeight={500}>Detalles De La Orden</Typography>
                        </Grid>

                        <Grid item xs={12} mt={2}>
                            <Box display="flex" gap={1} alignItems="flex-end">
                                <Box flex={1}>
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
                                                    _id: newValue._id, fullClient: newValue.fullClient, fullName: newValue.fullName, phone: newValue.phone, address: newValue.addresses.find(address => address.default), email: newValue.email,
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
                                </Box>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setOpenCreateClientModal(true)}
                                    sx={{ minWidth: 'auto', padding: '8px', height: '40px' }}
                                >
                                    <AddIcon fontSize="small" />
                                </Button>
                            </Box>
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
                                    [IOrderStatus.PENDING, IOrderStatus.PREPARING_FOR_DELIVERY].map((value) =>
                                    (
                                        <MenuItem key={value} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))
                                }
                            </CustomField>
                        </Grid>

                        <Grid item xs={12} mt={2} >
                            <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#53545C"} fontWeight={400} mb={"8px"}>Tipo de Orden</Typography>
                            <CustomField noValidate name="orderType" size="small" fullWidth select value={order.orderType}
                                onChange={(e: any) => {
                                    setOrder({ ...order, orderType: e.target.value })
                                }}
                            >
                                {
                                    Object.entries(IOrderType).map(([key, value]) =>
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
                                <Box display="flex" gap={1} alignItems="center">
                                    <Box flex={1}>
                                        <SearchTable
                                            onChange={(e) => {
                                                setFilersArticles(e.target.value);
                                            }}
                                            handleClick={(e) => {
                                                setAnchorEl(e.currentTarget)
                                            }}
                                        />
                                    </Box>
                                    <SearchFilterPopover
                                        onFilterChange={(filters) => {
                                            setSelectedCategories(filters.categories || []);
                                            setSelectedBrand(filters.brand);
                                            setSizeFilter(filters.size || "");
                                        }}
                                        currentFilters={{
                                            categories: selectedCategories,
                                            brand: selectedBrand,
                                            size: sizeFilter
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} mt={3} sx={{ ...style.hideScroll }} >

                                {
                                    order.articles!.length > 0 && order.articles!.map((item: IArticleCart) => (

                                        <React.Fragment key={item.variant._id}>
                                            <Box display={"flex"} mt={1} p={1} border={"1px solid #E1E2E9"} borderRadius={"8px"}>
                                                <Box height={49} width={49} minWidth={49} borderRadius={"8px"} border={"1px solid #00000007"} boxShadow={"0px 0px 4px #F1F3F9"} position={"relative"} >
                                                    <Image
                                                        src={
                                                            item.variant.images.find(item => item.primary)?.url!
                                                            ||
                                                            item.images.find(item => item.primary)?.url!
                                                            || "/Image.svg"
                                                        }
                                                        fill
                                                        alt="Image articles list"
                                                        objectFit="contain"
                                                        style={{ borderRadius: "8px" }}
                                                    />
                                                </Box>
                                                <Box ml={"14px"} width={"100%"}>
                                                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"flex-start"} mb={1}>
                                                        <Box flex={1}>
                                                            <Tooltip title={item.description} placement="top" arrow>
                                                                <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#000"} fontWeight={500}>
                                                                    {item.description.length > 20 ? item.description.slice(0, 20) + "..." : item.description}
                                                                </Typography>
                                                            </Tooltip>
                                                            <Box display="flex" flexDirection="column" gap={0.2} mt={0.5}>
                                                                <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#8B8D97"} fontWeight={400}>CÓDIGO: {item._id}</Typography>
                                                                {item.externalCode && (
                                                                    <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#8B8D97"} fontWeight={400}>CÓDIGO EXTERNO: {item.externalCode}</Typography>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                        <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#CC5F5F"} fontWeight={500} sx={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                setOrder({
                                                                    ...order,
                                                                    articles: order?.articles?.filter(value => value.variant._id !== item.variant._id)
                                                                })
                                                            }}
                                                        >
                                                            ✕
                                                        </Typography>
                                                    </Box>

                                                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
                                                        <Typography fontFamily={"Inter"} fontSize={"11px"} color={"#8B8D97"} fontWeight={400}>
                                                            {baseService.dominicanNumberFormat(item.variant.sellingPrice)}
                                                        </Typography>
                                                        <Box display={"flex"} alignItems={"center"} gap={1}>
                                                            <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#8B8D97"} sx={{ cursor: "pointer" }}
                                                                onClick={() => {
                                                                    if (item.variant.stock > 1) {
                                                                        setOrder({
                                                                            ...order,
                                                                            articles: order?.articles?.map(article => 
                                                                                article.variant._id === item.variant._id 
                                                                                    ? { ...article, variant: { ...article.variant, stock: article.variant.stock - 1 } }
                                                                                    : article
                                                                            )
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                -
                                                            </Typography>
                                                            <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#000"} fontWeight={500} minWidth={"20px"} textAlign={"center"}>
                                                                {item.variant.stock}
                                                            </Typography>
                                                            <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#8B8D97"} sx={{ cursor: "pointer" }}
                                                                onClick={() => {
                                                                    // Buscar el artículo original para obtener el stock disponible
                                                                    const originalArticle = resultArticles?.list.find((art: any) => art.variant._id === item.variant._id);
                                                                    const maxStock = originalArticle?.variant.stock || 0;
                                                                    
                                                                    if (item.variant.stock >= maxStock) {
                                                                        eventBus.emit("notify", { message: "No hay más stock disponible.", open: true, type: "error", title: "Error!", delay: 2000 });
                                                                        return;
                                                                    }
                                                                    
                                                                    setOrder({
                                                                        ...order,
                                                                        articles: order?.articles?.map(article => 
                                                                            article.variant._id === item.variant._id 
                                                                                ? { ...article, variant: { ...article.variant, stock: article.variant.stock + 1 } }
                                                                                : article
                                                                        )
                                                                    });
                                                                }}
                                                            >
                                                                +
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                                        <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#5570F1"} fontWeight={500} sx={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                const currentDiscount = item.orderDiscount;
                                                                const newDiscount = currentDiscount ? undefined : { type: IOrderDiscountType.PERCENT, value: 10 };
                                                                
                                                                setOrder({
                                                                    ...order,
                                                                    articles: order?.articles?.map(article => 
                                                                        article.variant._id === item.variant._id 
                                                                            ? { ...article, orderDiscount: newDiscount }
                                                                            : article
                                                                    )
                                                                });
                                                            }}
                                                        >
                                                            {item.orderDiscount ? 'Quitar Desc.' : '+ Descuento'}
                                                        </Typography>
                                                        {item.orderDiscount && (
                                                            <Box display={"flex"} alignItems={"center"} gap={0.5}>
                                                                <CustomField 
                                                                    select 
                                                                    size="small" 
                                                                    value={item.orderDiscount.type} 
                                                                    onChange={(e: any) => {
                                                                        setOrder({
                                                                            ...order,
                                                                            articles: order?.articles?.map(article => 
                                                                                article.variant._id === item.variant._id 
                                                                                    ? { ...article, orderDiscount: { ...article.orderDiscount!, type: e.target.value } }
                                                                                    : article
                                                                            )
                                                                        });
                                                                    }}
                                                                    sx={{ width: '90px' }}
                                                                    noValidate
                                                                >
                                                                    <MenuItem value="PERCENT">%</MenuItem>
                                                                    <MenuItem value="VALUE">RD$</MenuItem>
                                                                </CustomField>
                                                                
                                                                <CustomField 
                                                                    size="small" 
                                                                    type="number" 
                                                                    value={item.orderDiscount.value} 
                                                                    onChange={(e: any) => {
                                                                        const value = parseFloat(e.target.value) || 0;
                                                                        setOrder({
                                                                            ...order,
                                                                            articles: order?.articles?.map(article => 
                                                                                article.variant._id === item.variant._id 
                                                                                    ? { ...article, orderDiscount: { ...article.orderDiscount!, value } }
                                                                                    : article
                                                                            )
                                                                        });
                                                                    }}
                                                                    sx={{ width: '90px' }}
                                                                    noValidate
                                                                />
                                                                
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Box borderBottom={"1px solid #00000007"} paddingBottom={"5px"} mt={1} width={"100%"}>
                                                {item.orderDiscount && (
                                                    <Box display={"flex"} justifyContent={"space-between"} mb={0.5}>
                                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#FF9800"} fontWeight={500}>
                                                            Descuento ({item.orderDiscount.value}{item.orderDiscount.type === IOrderDiscountType.PERCENT ? '%' : ' RD$'})
                                                        </Typography>
                                                        <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#FF9800"} fontWeight={500}>
                                                            -{baseService.dominicanNumberFormat(
                                                                item.orderDiscount.type === IOrderDiscountType.PERCENT 
                                                                    ? (item.variant.sellingPrice * item.variant.stock * item.orderDiscount.value / 100)
                                                                    : item.orderDiscount.value
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                <Box display={"flex"} justifyContent={"space-between"}>
                                                    <Typography fontFamily={"Inter"} fontSize={"15px"} color={"#8B8D97"} fontWeight={500}>Sub-total</Typography>
                                                    <Typography fontFamily={"Inter"} fontSize={"15px"} color={"#33343A"} fontWeight={500}>
                                                        {baseService.dominicanNumberFormat(
                                                            item.orderDiscount 
                                                                ? (item.variant.sellingPrice * item.variant.stock) - (
                                                                    item.orderDiscount.type === IOrderDiscountType.PERCENT 
                                                                        ? (item.variant.sellingPrice * item.variant.stock * item.orderDiscount.value / 100)
                                                                        : item.orderDiscount.value
                                                                )
                                                                : item.variant.sellingPrice * item.variant.stock
                                                        )}
                                                    </Typography>
                                                </Box>
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

                                        <Typography fontFamily={"Inter"} sx={{ fontSize: { xs: "11px", sm: "13px" } }} textAlign={"center"} color={"#8B8D97"} fontWeight={500} mt={"12px"}>
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
                        maxHeight: 400,
                        minHeight: 'auto',
                        display: anchorEl ? "block" : "none",
                        marginLeft: "-40px",
                        pointerEvents: "auto",
                        ...style.hideScroll
                    }
                }}
            >
                <Box sx={{ padding: 1 }}>
                    {
                        resultArticles?.list.map((item: any) => (
                            <Box 
                                key={`${item._id}-${item.variant._id}`} 
                                sx={{
                                    display: "flex",
                                    padding: 2,
                                    marginBottom: 1,
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px",
                                    backgroundColor: "#FAFAFA",
                                    '&:hover': {
                                        backgroundColor: "#F3F4F6",
                                        borderColor: "#D1D5DB"
                                    }
                                }}
                            >
                                <Box height={60} width={60} minWidth={60} borderRadius={"8px"} border={"1px solid #E5E7EB"} boxShadow={"0px 2px 4px rgba(0,0,0,0.1)"} position={"relative"} overflow={"hidden"}>
                                    <Image
                                        src={item.variant.images?.find((img: any) => img.primary)?.url || item.images?.find((img: any) => img.primary)?.url || "/Image.svg"}
                                        fill
                                        alt="Image articles list"
                                        style={{ objectFit: "cover" }}
                                    />
                                </Box>
                                <Box ml={2} flex={1} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
                                    <Box>
                                        <Typography 
                                            fontFamily={"Inter"} 
                                            fontSize={"12px"} 
                                            color={"#111827"} 
                                            fontWeight={500}
                                        >
                                            {item.description}
                                        </Typography>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#059669"} fontWeight={600} mt={0.5}>
                                            {baseService.dominicanNumberFormat(item.variant.sellingPrice)}
                                        </Typography>
                                    </Box>
                                    
                                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"flex-end"} mt={1}>
                                        <Box>
                                            <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#6B7280"} fontWeight={400}>
                                                CÓDIGO: {item._id}
                                            </Typography>
                                            {item.externalCode && (
                                                <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#6B7280"} fontWeight={400}>
                                                    EXT: {item.externalCode}
                                                </Typography>
                                            )}
                                            <Typography 
                                                fontFamily={"Inter"} 
                                                fontSize={"11px"} 
                                                color={item.variant.available === "Disponible" ? "#059669" : 
                                                      item.variant.available === "Encargado" ? "#D97706" : "#DC2626"} 
                                                fontWeight={500}
                                            >
                                                {item.variant.available} ({item.variant.stock})
                                            </Typography>
                                        </Box>
                                        
                                        <Typography 
                                            fontFamily={"Inter"} 
                                            fontSize={"12px"} 
                                            color={item.variant.available === "Disponible" && item.variant.stock > 0 ? "#2563EB" : "#DC2626"} 
                                            fontWeight={600}
                                            sx={{ 
                                                cursor: item.variant.available === "Disponible" && item.variant.stock > 0 ? "pointer" : "default",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                backgroundColor: item.variant.available === "Disponible" && item.variant.stock > 0 ? "#EFF6FF" : "#FEF2F2",
                                                border: `1px solid ${item.variant.available === "Disponible" && item.variant.stock > 0 ? "#DBEAFE" : "#FECACA"}`,
                                                '&:hover': item.variant.available === "Disponible" && item.variant.stock > 0 ? {
                                                    backgroundColor: "#DBEAFE"
                                                } : {}
                                            }}
                                            onClick={() => {
                                                if (item.variant.available !== "Disponible" || item.variant.stock <= 0) {
                                                    eventBus.emit("notify", { message: "Esta variante no está disponible para venta.", open: true, type: "error", title: "Error!", delay: 2000 })
                                                    return
                                                }

                                                const currentClickedArticle: any = { ...item };
                                                const itemOnList = order.articles!.find(orderItem => orderItem.variant._id === item.variant._id)

                                                if (itemOnList) {
                                                    if (itemOnList.variant.stock + 1 > item.variant.stock) {
                                                        eventBus.emit("notify", { message: "No hay stock suficiente.", open: true, type: "error", title: "Error!", delay: 2000 })
                                                        return
                                                    }
                                                    const arr = [...order.articles!].filter((currentInCart) => currentInCart.variant._id !== itemOnList.variant._id);
                                                    itemOnList.variant.stock += 1
                                                    setOrder({ ...order, articles: [...arr, itemOnList] })
                                                } else {
                                                    setOrder({ ...order, articles: [...order.articles!, { ...currentClickedArticle, variant: { ...item.variant, stock: 1 } }] })
                                                }

                                                eventBus.emit("notify", { message: "Artículo agregado al carrito.", open: true, type: "success", title: "Agregado!", delay: 1000 })
                                                setAnchorEl(null);
                                            }}
                                        >
                                            {item.variant.available === "Disponible" && item.variant.stock > 0 ? "Agregar" : 
                                             item.variant.available === "Encargado" ? "Encargado" : "Agotado"}
                                        </Typography>
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
                        width: { xs: 300, md: "100%" }
                    }} >
                        <Table size="small" aria-label="a dense table">

                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell><Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Estado</Typography></TableCell>
                                    <TableCell><Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Talla</Typography></TableCell>
                                    <TableCell><Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Disponibilidad</Typography></TableCell>
                                    <TableCell><Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Stock</Typography></TableCell>
                                    <TableCell align="left"> <Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Costo</Typography></TableCell>
                                    <TableCell align="left">  <Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Venta</Typography></TableCell>
                                    <TableCell align="left">  <Typography fontFamily={"Inter"} fontSize={"16px"} textAlign={"center"}>Ganancia</Typography></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {selectedArticle && selectedArticle.variants.filter((item: IArticlesVariants) => item.available).map((row: IArticlesVariants, index: number) => (
                                    <TableRow
                                        key={`${row._id}-${index}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        onDoubleClick={() => {
                                            if (row.available !== "Disponible") {
                                                eventBus.emit("notify", { message: "Esta variante no está disponible para venta.", open: true, type: "error", title: "Error!", delay: 2000 })
                                                return
                                            }

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

                                                    <Image
                                                        fill
                                                        key={row.images.find(item => item.primary)?.url! || selectedArticle.images.find(item => item.primary)?.url!}
                                                        src={row.images.find(item => item.primary)?.url! || selectedArticle.images.find(item => item.primary)?.url!}
                                                        alt="Image articles list"
                                                        objectFit="contain"
                                                        style={{ borderRadius: "8px" }}
                                                    />

                                                </Box>

                                            </Box>
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.status}
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.size || "-"}
                                        </TableCell>

                                        <TableCell align="center">
                                            <Typography
                                                sx={{
                                                    color: row.available === "Disponible" ? "#519C66" : row.available === "Encargado" ? "#FF9800" : "#CC5F5F",
                                                    fontWeight: 500,
                                                    fontSize: "12px"
                                                }}
                                            >
                                                {row.available || "No disponible"}
                                            </Typography>
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

            {/* Modal Crear Cliente */}
            <CustomModal open={openCreateClientModal} borderRadius={"8px"}>
                <Box padding={"20px"} minHeight={200} maxHeight={"80vh"} sx={{ overflowY: 'auto' }}>
                    <Grid item container justifyContent={"space-between"} alignItems={"center"} mb={2}>
                        <Typography fontFamily={"Poppins"} fontSize={"20px"} fontWeight={600}>Crear Cliente</Typography>
                        <CloseIcon 
                            sx={{ 
                                backgroundColor: "#FFF2E2", 
                                width: 32, 
                                height: 32, 
                                borderRadius: "8px", 
                                cursor: "pointer", 
                                padding: "5px", 
                                color: "#000" 
                            }}
                            onClick={() => setOpenCreateClientModal(false)}
                        />
                    </Grid>
                    
                    <CreateClientForm 
                        onClose={() => {
                            setOpenCreateClientModal(false);
                            getAllClients(); // Refresh client list
                        }} 
                    />
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