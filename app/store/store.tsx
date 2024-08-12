import { configureStore } from "@reduxjs/toolkit"
import { mainFinderSlice, userSlice, mobileAsideSlice, cartAsideSlice,cartArticlesSlice } from "./slice"



const store = configureStore({
    reducer: {
        mainFinder: mainFinderSlice.reducer,
        userStore: userSlice.reducer,
        mobileAsideSlice: mobileAsideSlice.reducer,
        cartAsideStore: cartAsideSlice.reducer,
        cartArticles: cartArticlesSlice.reducer

    }
})

export default store

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
