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
