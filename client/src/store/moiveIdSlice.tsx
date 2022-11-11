import {createSlice, PayloadAction}from '@reduxjs/toolkit'

export type  userId = string|null  ;
//userID 관련 store slice
const movieIdSlice = createSlice({
    name:'movieId',
    initialState:{Id:null} as any,
    reducers:{
      setId:(state,action:PayloadAction<string|null>)=>{state.Id = action.payload},
    }
  })

  export default movieIdSlice;
  export const {setId}  = movieIdSlice.actions;