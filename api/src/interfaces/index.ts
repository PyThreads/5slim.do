export interface IArticlesSummary {
    total: number;
    outOfStock: number;
    soldToday: number;
    lowStockAlert: number;
}
export interface IPaginateOrders {
    page: number
    limit: number
    fullClient?: string
    status?: IOrderStatus
    _id?: number
}

export enum CancelOrderType {
    CANCEL_ONLY = "Solo cancelar orden",
    RETURN_ITEMS = "Cancelar y retornar items"
}

export enum IArticleStatus {
    NEW = "Nuevo",
    USED = "Usado",
    USED_LIKE_NEW = "Usado Como Nuevo",
    REFURBISHED = "Reparado"
}

export enum IArticleAvailability {
    AVAILABLE = "Disponible",
    NOT_AVAILABLE = "No disponible",
    ORDERED = "Encargado"
}

export enum IPaymentType {
    CASH = "Efectivo",
    CREDIT_CARD = "Tarjeta",
    TRANSFER = "Transferencia"
}

export enum IOrderStatus {
    PENDING = "Pendiente",
    DELIVERED = "Entregado",
    CANCELLED = "Cancelada",
    PAID = "Pagado",
    PREPARING_FOR_DELIVERY = "Preparando para entrega"
}

export interface ICategory {
    _id: number;
    description: string;
    slug: string;
}

export interface IArticleDiscount {
    type?: string;
    value?: string;
    startDate?: string;
    endDate?: string;
    hasExpiration?: boolean;
}

export interface IAdvertisementArticle {
    type: string;
    value: number
}

export interface IArticleImages {
    id: string
    url: string
    primary: boolean
}

export interface IArticlesVariants {
    _id: string;
    costPrice: number;
    sellingPrice: number;
    stock: number;
    status: IArticleStatus;
    images: IArticleImages[];
    source?: string;
    tracking?: string;
    available?: string;
    comment?: string;
}

export interface IOrdersSummary {
    total: number;
    pending: number;
    delivered: number;
    cancelled: number;
    paid: number;
    preparingForDelivery: number;
    earnings: number;
    totalSold: number;
}

export interface IArticle {
    variants: IArticlesVariants[];
    _id: number;
    description: string;
    slug: string;
    categories: ICategory[];
    hasDiscount: boolean;
    discount?: IArticleDiscount;
    published: boolean;
    shortDescription: string;
    tipTap: string;
    advertisement?: IAdvertisementArticle
    images: IArticleImages[];
    stockAlert?: number;
    totalOrders?: number;
    ownerId: number
}

export interface IOrder {
    _id: number;
    articles: IArticleCart[];
    client: IClientOrder;
    paymentType: IPaymentType;
    status: IOrderStatus;
    createdDate: Date;
    updatedDate: Date;
    total: ICartTotals
    createdBy: ICreatedBy
    updatedBy?: ICreatedBy
    comment?: string
    ownerId: number
}

export interface IClientOrder {
    _id: number;
    fullName: string;
    fullClient: string;
    email: string;
    address: IClientAddress
    createdDate: Date;
}

export interface IArticleCart {
    variant: IArticlesVariants;
    _id: number;
    description: string;
    slug: string;
    categories: ICategory[];
    hasDiscount: boolean;
    discount?: IArticleDiscount;
    published: boolean;
    shortDescription: string;
    tipTap: string;
    advertisement?: IAdvertisementArticle
    images: IArticleImages[];
}

export interface IPaginateArticles {
    page: number
    limit: number
    description?: string
    slug?: string
    _id?: number
}

export interface IPaginateClients {
    page: number
    limit: number
    fullName?: string
    active?: boolean
    email?: string
    _id?: number
    published?: boolean
    hasStock?: boolean
    lowStock?: boolean
    hasOrderedVariants?: boolean
    sortByOrders?: string
}


export interface IPaginationResult {
    totalPages: number;
    list: any[];
    currentPage: number;
    totalItems: number;
}

export enum COLLNAMES {
    ADMIN = "ADMIN",
    CLIENTS = "CLIENTS",
    ARTICLES = "ARTICLES",
    ORDER = "0RDER"
}

export interface ICartTotals {
    total: number;
    subTotal: number;
    discount: number
}


export interface INotify {
    type: "success" | "error"
    message: string
    title: string
    open: boolean
    setOpen: Function
    delay?: number
}

export enum IAddressType {
    BILLING = "Residencial",
    SHIPPING = "Envío",
    WORK = "Trabajo"
}

export enum IDiscountType {
    PERCENT = "Porcentaje",
    AMOUNT = "Monto"
}

export interface IFunctionProps {
    createValidation: Function,
    projection?: Object
}



export interface IChangePasswordBody {
    password: string;
    newPassword: string;
    newPassword1: string;
}


export interface IPaginateArticles {
    page: number
    limit: number
    description?: string
    category?: string
}

export interface IUser {
    _id: number;
    name: string;
    lastName: string
    fullName: string
    email: string,
    token?: string
    phone?: string | undefined
    mobilePhone?: string
}

export interface IClientAddressMap {
    address: string;
    zipCode?: string;
    city: string;
    lat: string | number;
    lng: string | number;
    url: string;
    place_id: string;
}



export interface IClientAddress {
    type: string;
    name: string;
    address: string;
    city: string;
    county: string;       // Municipio
    childCounty: string;  // Sector
    phone: string;
    isMap: boolean;
    map?: IClientAddressMap; // Puedes definir una estructura más específica si sabes qué contiene
    default: boolean;
    country?: string
}

export interface IClient {
    _id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    addresses: IClientAddress[];
    createdDate?: Date
    createdBy?: ICreatedBy
    updatedBy?: ICreatedBy
    fullClient: string
    updatedDate?: Date
    ownerId: number
}

export interface IPaginatedClient {
    _id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    addresses: IClientAddress[];
    createdDate?: Date
    createdBy?: ICreatedBy
    updatedBy?: ICreatedBy
    fullClient: string
    updatedDate?: Date
    totalOrdenes: number;
    totalGastado: number;
    ownerId: number
}

export interface ICreatedBy {
    _id: number;
    fullName: string;
}
export enum IUserType {
    CLIENTE = "Cliente",
    EMPLEADO = "Empleado"
}

export interface IAdmin {
    _id: number;
    firstName: string;
    lastName: string
    fullName: string
    email: string,
    token?: string
    profilePicture?: string
    userType: IUserType
    ownerId: number
}

export interface IUserAddress {
    _id: number
    userId?: number
    name: string;
    lastName: string;
    address1: string;
    city: string;
    county: string;
    childCounty: string;
    phone: string;
}

export interface ISubmitPassword {
    email: string;
    code: string;
    password: string;
}

export interface ItypeTempCode {
    identifier: any;
    type: EnumTypeTempCode;
    code?: string;
    used?: boolean
    createdDate?: Date
}

export enum EnumTypeTempCode {
    START_SESSION = "startSession"
}
