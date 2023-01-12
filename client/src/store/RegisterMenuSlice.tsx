import {createSlice,PayloadAction}from '@reduxjs/toolkit'

const  RegisterMenuSlice = createSlice({
    name:'registermenu',
    initialState:{menu:"agreement"},
    reducers:{
      agreement:(state)=>{state.menu = "agreement"},
      inputInfo:(state)=>{state.menu = "inputInfo"},
      finish:(state)=>{state.menu = "finish"},
  }})

  export default RegisterMenuSlice ;