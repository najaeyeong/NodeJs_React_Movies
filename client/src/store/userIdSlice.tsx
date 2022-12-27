import {createSlice, PayloadAction}from '@reduxjs/toolkit'
import axios from 'axios';

export type  userId = string|null  ;
//userID 관련 store slice
const userIdSlice = createSlice({
    name:'userId',
    initialState:{id:null,
                  name:null,
                  email:null,
                  age:null,
                  phonenumber:null
     } as any,
    reducers:{
      login:(state)=>{
        axios.get(``).then((res)=>{
          if(res.data.success){
            state.id = res.data.data[0].id
            state.name = res.data.data[0].name
            state.email = res.data.data[0].email
            state.age = res.data.data[0].age
            state.phonenumber = res.data.data[0].phonenumber
          }else{
            state.id = null
            state.name = null
            state.email = null
            state.age = null
            state.phonenumber = null
          }
        }).catch((err)=>{
          state.id = null
          state.name = null
          state.email = null
          state.age = null
          state.phonenumber = null
          console.log(err)
        })
        },

      logout:(state)=>{
        state.id = null
        state.name = null
        state.email = null
        state.age = null
        state.phonenumber = null
      }
    }
  })

  export default userIdSlice;
  export const {login,logout}  = userIdSlice.actions;