import { createSlice } from '@reduxjs/toolkit'

export const paragraphSlice = createSlice({
  name: 'paragraphs',
  initialState: {
    paragraphs: [],
  },
  reducers: {
    setAllParas: (state, action) => {
        state.paragraphs = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAllParas } = paragraphSlice.actions

export default paragraphSlice.reducer