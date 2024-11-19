import { configureStore } from '@reduxjs/toolkit'
import paragraphReducer from '../Slices/paragraphsSlice'

export default configureStore({
  reducer: {
    paragraphs: paragraphReducer
  },
})