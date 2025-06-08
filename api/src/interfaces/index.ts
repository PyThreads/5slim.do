export interface IPaginateClients {
    page: number
    limit: number
    fullName?: string
    active?: boolean
    email?: string
    _id?: number

}

export interface IPaginationResult {
    totalPages: number;
    list: any[];
    currentPage: number;
    totalItems: number;
}

export enum COLLNAMES {
    ADMIN = "ADMIN",
    CLIENTS = "CLIENTS"
}


export interface INotify {
    type: "success" | "error"
    message: string
    title: string
    open: boolean
    setOpen: Function
}

export enum IAddressType {
    BILLING = "Residencial",
    SHIPPING = "Envío",
    WORK = "Trabajo"
}

export interface IFunctionProps {
    createValidation: Function,
    projection?: Object
}

export interface ICartTotals {
    total: number;
    tax: number;
    subTotal: number;
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
}

export interface IClient {
    _id: number;
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    addresses: IClientAddress[];
    createdDate?: Date
    createdBy?: ICreatedBy
    updatedBy?: ICreatedBy
    fullClient: string
    updatedDate?: Date
}

export interface ICreatedBy {
    _id: number;
    fullName: string;
}
export interface IAdmin {
    _id: number;
    name: string;
    lastName: string
    fullName: string
    email: string,
    token?: string
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
