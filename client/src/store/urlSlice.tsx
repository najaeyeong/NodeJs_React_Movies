
import {createSlice}from '@reduxjs/toolkit'

//url 
const serverUrlSlice = createSlice({
    name:'serverUrl',
    initialState:{url:"http://localhost:3001"} ,
    reducers:{
      // dev:(state,action)=>{state.url = "http://localhost:3001"},
      // prod:(state,action)=>{state.url = `https://movietest2.herokuapp.com`}
      // https:(state,action)=>{state.url = `https://localhost:8080`}
    }
  })

  export default serverUrlSlice
  //