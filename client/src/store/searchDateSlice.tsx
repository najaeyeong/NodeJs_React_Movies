
import { StaticDatePicker } from '@mui/lab';
import {createSlice,PayloadAction}from '@reduxjs/toolkit'

const searchDataSlice = createSlice({
    name:'searchDataSlice',
    initialState:{genre:"",
                  rate:"",
                  year:"",
                  sort:"",
                  term:"",
                  searched:false,
                  page:1,
                  lastpagenumber:10, //page 목록중 그려지는 마지막 번호 10 20 30 40 50... 
                } ,
    reducers:{
      update_genre:(state,action:PayloadAction<string>)=>{
        state.genre=action.payload;
      },
      update_rate:(state,action:PayloadAction<string>)=>{
        state.rate = action.payload;
      },
      update_year:(state,action:PayloadAction<string>)=>{
        state.year = action.payload;
      },
      update_sort:(state,action:PayloadAction<string>)=>{
        state.sort = action.payload;
      },
      update_term:(state,action:PayloadAction<string>)=>{
        state.term = action.payload;
      },
      update_searched:(state,action:PayloadAction<boolean>)=>{
        state.searched = action.payload;
      },
      update_page:(state,action:PayloadAction<number>)=>{
        state.page = action.payload;
      },
      update_lastpagenumber:(state,action:PayloadAction<number>)=>{
        state.lastpagenumber = action.payload;
      },
      reset:(state,action)=>{
        state.genre='';
        state.rate = '';
        state.year = '';
        state.sort = '';
        state.term = '';
        state.searched = false;
        state.page = 1;
        state.lastpagenumber = 10;
      }
    }
  })

  export default searchDataSlice;
  export const {update_genre,update_rate,update_year,update_sort,update_term,update_searched,update_page,update_lastpagenumber,reset }  = searchDataSlice.actions;