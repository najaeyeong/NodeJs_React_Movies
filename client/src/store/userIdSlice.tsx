import {createSlice, PayloadAction}from '@reduxjs/toolkit'

export type  userId = string|null  ;
//userID 관련 store slice
const userIdSlice = createSlice({
    name:'userId',
    initialState:{Id:null} as any,
    reducers:{
      login:(state,action:PayloadAction<string|null>)=>{state.Id = action.payload},
      logout:(state,action:PayloadAction<string|null>)=>{state.Id = action.payload}
    }
  })

  export default userIdSlice;
  export const {login,logout}  = userIdSlice.actions;