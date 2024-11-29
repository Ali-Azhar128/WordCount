import { createSlice } from '@reduxjs/toolkit'

export const paragraphSlice = createSlice({
  name: 'paragraphs',
  initialState: {
    paragraphs: [],
    pageNumber: 1,
    userId: '',
    flaggedItem: false,
    paragraphId: ''
  },
  reducers: {
    setAllParas: (state, action) => {
      state.paragraphs = [];
      
      // Extract para property from each object and add to state
      console.log(action.payload.docs, 'action.payload')
      action.payload.map(item => {
        const newItem = {
          para: item.paragraph,
          createdAt: item.createdAt,
          count: item.count,
          pdfLink: item.pdfLink,
          language: item.language,
          id: item._id,
          isFlagged: item.isFlagged,
          createdBy: item.createdBy,
          isNotified: item.isNotified
        }
        console.log(newItem, 'newItem')
        state.paragraphs.push(newItem);
      });
      
      console.log(state.paragraphs, 'state.paragraphs')
    },

    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },

    setUserIdToSendNotificationTo: (state, action) => {
      state.userId = action.payload.createdBy
      state.paragraphId = action.payload.id
      console.log(action.payload, 'payload of user id')
    },

    setFlaggedItem: (state, action) => {
      state.flaggedItem = action.payload
    },

    setParagraphId: (state, action) => {
      console.log(action.payload, 'payload')
      state.paragraphId = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setAllParas, setPageNumber, setUserIdToSendNotificationTo, setFlaggedItem,setParagraphId } = paragraphSlice.actions

export default paragraphSlice.reducer