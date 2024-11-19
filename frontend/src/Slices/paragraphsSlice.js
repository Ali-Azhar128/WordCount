import { createSlice } from '@reduxjs/toolkit'

export const paragraphSlice = createSlice({
  name: 'paragraphs',
  initialState: {
    paragraphs: [],
    pageNumber: 1,
  },
  reducers: {
    setAllParas: (state, action) => {
      // Clear the existing array first
      state.paragraphs = [];
      
      // Extract para property from each object and add to state
      console.log(action.payload, 'action.payload')
      state.paragraphs = action.payload.map(item => item.para);
      
      console.log(state.paragraphs, 'state.paragraphs')
    },

    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAllParas, setPageNumber } = paragraphSlice.actions

export default paragraphSlice.reducer