export interface ICartTotals {
    total: number;
    tax: number;
    subTotal: number;
}

export interface IUserOrder {
    _id: number;
    name: string;
    lastName: string;
    email:string;
    phone: string;
    address: IUserAddress
}

export interface IOrder{
    _id: number;
    totals: ICartTotals;
    user:IUserOrder;
    articles: ICartArticle[];
    createdDate: string
    status:"Cancelada" | "Creada"
    paymentStatus: "Pendiente" | "Pagada"
}

export interface ICartTotals {
    total: number;
    tax: number;
    subTotal: number;
}

export interface INavItem {
    name: string,
    draw: boolean,
    component?: React.ReactNode | null
    href?: string
}
export interface ISelectSearchProps {
    name: string,
    value: string | undefined | null | number,
    list: any[]
    disabled?: boolean,
    onChange: Function
    keyName: string
}

export interface IFinderSelectBody {
    year?: any
    brand?: any
    model?: any,
    description?: any,
    category?: any
}

export interface IArticle {
    Merc_Codigo?: number | null
    Merc_Referencia?: string | null
    Merc_Codigo_Barra?: string | null
    Merc_Nombre?: string | null
    Merc_Ubicacion_01?: string | null
    Merc_Ubicacion_02?: string | null
    Merc_Ubicacion_03?: string | null
    Alias?: string | null
    Marca?: string | null
    Modelo?: string | null
    Merc_Ano?: string | null
    Merc_Existencia_Grl?: number | null
    Merc_Existencia_A01?: number | null
    Merc_Existencia_A02?: number | null
    Merc_Existencia_A03?: number | null
    Precio?: number | null
    PrecioItbis?: number | null
    Precio2?: number | null
    PrecioItbis2?: number | null
}


export interface ICartArticle {
    _id?: number;
    Merc_Codigo: number
    userId?: number
    Merc_Referencia?: string
    Merc_Codigo_Barra: string
    Merc_Nombre: string
    Marca: string
    Modelo: string
    Merc_Ano: string
    Precio: number
    PrecioItbis: number
    Precio2: number
    PrecioItbis2: number
    Cant: number
}


export interface IYears {
    year: number | null | string
}


export interface IBrandAndModel {
    description: string | null
}


export interface IUser {
    name: string
    lastName?: string
    fullName?: string,
    email: string,
    password?: string
    token: string
}

export interface IUserAddress {
    _id?: number
    userId?: number
    name: string;
    lastName: string;
    address1: string;
    city: string;
    county: string;
    childCounty: string;
    phone: string;
}

export interface IChangePasswordBody {
    password: string;
    newPassword: string;
    newPassword1: string;
}

