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
  email:string,
  gender:string,
  birthdate:string,
  phonenumber:string,
  registrationDate:Date
}
//userID 관련 store slice
const userIdSlice = createSlice({
    name:'userId',
    initialState:{id:null,
                  name:null,
                  email:null,
                  gender:null,
                  birthdate:null,
                  phonenumber:null,
                  registrationDate:null
     } as any,
    reducers:{
      login:(state,action:PayloadAction<userInfo>)=>{
            state.id = action.payload.id
            state.name = action.payload.name
            state.email = action.payload.email
            state.gender = action.payload.gender
            state.birthdate = action.payload.birthdate
            state.phonenumber = action.payload.phonenumber
            state.registrationDate = action.payload.registrationDate
          },
      logout:(state)=>{
        state.id = null
        state.name = null
        state.email = null
        state.gender=null
        state.birthdate=null
        state.phonenumber = null
        state.registrationDate=null
      }
    }
  })

  export default userIdSlice;
  export const {login,logout}  = userIdSlice.actions;

  //홈화면에서 받아옴 