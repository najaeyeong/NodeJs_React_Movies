import {createSlice, PayloadAction}from '@reduxjs/toolkit'


//userID 관련 store slice
const userIdSlice = createSlice({
    name:'userId',
    initialState:{Id:'.'},
    reducers:{
      login:(state,action:PayloadAction<string>)=>{state.Id = action.payload},
      logout:(state,action:PayloadAction<string>)=>{state.Id = action.payload}
    }
  })

  export default userIdSlice;
  export const {login,logout}  = userIdSlice.actions;