
import {createSlice,PayloadAction}from '@reduxjs/toolkit'

//url 
const RegisterAgreeSlice = createSlice({
    name:'agreement',
    initialState:{personalinfo:false,
                  locationinfo:false,
                  receive:false},
    reducers:{
      personal:(state,action:PayloadAction<boolean>)=>{state.personalinfo = action.payload},
      location:(state,action:PayloadAction<boolean>)=>{state.locationinfo = action.payload},
      receive:(state,action:PayloadAction<boolean>)=>{state.receive = action.payload},
    },
  })


  export default RegisterAgreeSlice ;
