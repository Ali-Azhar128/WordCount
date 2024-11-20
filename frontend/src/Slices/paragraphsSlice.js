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
      action.payload.map(item => {
        const newItem = {
          para: item.para,
          createdAt: item.createdAt,
          count: item.count,
        }
        state.paragraphs.push(newItem);
      });
      
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