import {createSlice, PayloadAction}from '@reduxjs/toolkit'
import axios from 'axios';
//redux store
import { useSelector} from 'react-redux';
import {RootState} from '../store/store'
//const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})

export type  userId = string|null  ;
interface userInfo{
  id:string,
  name:string,
  age:number,
  email:string,
  phonenumber:string
}
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
      login:(state,action:PayloadAction<userInfo>)=>{
            state.id = action.payload.id
            state.name = action.payload.name
            state.email = action.payload.email
            state.age = action.payload.age
            state.phonenumber = action.payload.phonenumber
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