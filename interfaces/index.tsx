
export interface IAdmin {
    _id: number
    name: string
    lastName: string
    fullName: string
    email: string
}

export interface IAdminContext {
    currentAdmin?: IAdmin | null
    signOut?: () => undefined
    me?: () => undefined
}