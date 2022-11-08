
import {createSlice}from '@reduxjs/toolkit'

//url 
const serverUrlSlice = createSlice({
    name:'serverUrl',
    initialState:{url:`https://movietest2.herokuapp.com`},
    reducers:{
      dev:(state,action)=>{state.url = "http://localhost3001"},
      prod:(state,action)=>{state.url = `https://movietest2.herokuapp.com`}
    }
  })

  export default serverUrlSlice