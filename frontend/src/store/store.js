import { configureStore } from '@reduxjs/toolkit'
import paragraphReducer from '../Slices/paragraphsSlice'
import { apiSlice } from './apiSlice'

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    paragraphs: paragraphReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})