import { createSlice } from "@reduxjs/toolkit";
import { ICartArticle, IUser } from "../interfaces";

export const mainFinderSlice = createSlice({
    name: 'mainFinderSlice',
    initialState: {
        values: {
            year: "",
            brand: "",
            model: "",
            category: "",
            description: "",
            limit: 12,
            page: 1
        }
    },
    reducers: {
        updateMainFinderSlice: (state, action) => {
            state.values = action.payload;
        }
    }
})

export const articlesMainFinderSlice = createSlice({
    name: 'articlesMainFinderSlice',
    initialState: {
        values: []
    },
    reducers: {
        updateArticlesMainFinderSlice: (state, action) => {
            state.values = action.payload;
        }
    }
})



let cartArticles: ICartArticle[] = [];
let parsedUser: IUser | null = null;

const init = async () => {
    if (typeof window !== 'undefined') {
        const userLocalStorage = window.localStorage.getItem("user")
        parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;
    }
}

export const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        values: parsedUser
    },
    reducers: {
        updateUserSlice: (state: { values: IUser | null }, action: { payload: IUser | null }) => {
            state.values = action.payload;
        }
    }
})

export const mobileAsideSlice = createSlice({
    name: 'userSlice',
    initialState: {
        open: false
    },
    reducers: {
        updateMobileAside: (state: { open: boolean }, action: { payload: boolean }) => {
            state.open = action.payload;
        }
    }
})

export const cartAsideSlice = createSlice({
    name: 'cartAside',
    initialState: {
        open: false
    },
    reducers: {
        updateCartAside: (state: { open: boolean }, action: { payload: boolean }) => {
            state.open = action.payload;
        }
    }
})


export const cartArticlesSlice = createSlice({
    name: "cartArticlesSlice",
    initialState: {
        list: cartArticles
    },
    reducers: {
        updateCartArticles: (state: { list: ICartArticle[] }, action: { payload: ICartArticle[] }) => {
            state.list = action.payload;
        }
    }

})

init();

const updateMainFinderSlice = mainFinderSlice.actions.updateMainFinderSlice
const updateUserSlice = userSlice.actions.updateUserSlice
const updateMobileAside = mobileAsideSlice.actions.updateMobileAside
const updateCartAside = cartAsideSlice.actions.updateCartAside
const updateCartArticles = cartArticlesSlice.actions.updateCartArticles

export { updateMainFinderSlice, updateUserSlice, updateMobileAside, updateCartAside, updateCartArticles }