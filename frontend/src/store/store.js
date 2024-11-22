import { configureStore } from '@reduxjs/toolkit'
import paragraphReducer from '../Slices/paragraphsSlice'
import { apiSlice } from './apiSlice'
import userReducer from '../Slices/usersSlice'

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    paragraphs: paragraphReducer,
    login: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})