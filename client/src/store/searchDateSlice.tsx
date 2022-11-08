
import {createSlice}from '@reduxjs/toolkit'

const searchDataSlice = createSlice({
    name:'searchDataSlice',
    initialState:{genre:"",
                  rate:"",
                  year:"",
                  sort:"",
                  term:""
                },
    reducers:{
      update:(state,action)=>{
        state.genre=action.payload.genre;
        state.rate = action.payload.rate;
        state.year = action.payload.year;
        state.sort = action.payload.sort;
        state.term = action.payload.term;
      }
    }
  })

  export default searchDataSlice;