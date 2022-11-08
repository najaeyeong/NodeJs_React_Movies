import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {Provider,useSelector,useDispatch} from 'react-redux';

import {createStore} from 'redux';
import {createSlice,configureStore}from '@reduxjs/toolkit'

//redux toolkit 으로 store  slice 
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

//userID 관련 store slice
const userIdSlice = createSlice({
  name:'userId',
  initialState:{Id:null},
  reducers:{
    login:(state,action)=>{state.Id = action.payload.id},
    logout:(state,action)=>{state.Id = null}
  }
})

//url 
const serverUrlSlice = createSlice({
  name:'serverUrl',
  initialState:{url:`https://movietest2.herokuapp.com`},
  reducers:{
    dev:(state,action)=>{state.url = "http://localhost3001"},
    prod:(state,action)=>{state.url = `https://movietest2.herokuapp.com`}
  }
})

//slice 통합한 store
const store = configureStore({
  reducer:{
    search:searchDataSlice.reducer,
    userId:userIdSlice.reducer,
    serverUrl:serverUrlSlice.reducer
  }
})

//store data 사용방법 
// const dispatch = useDispatch()
// dispatch({type:'searchDataSlice/search',data:2})
// dispatch(searchDataSlice.actions.update(2))
// const searchDate = useSelector(state=>{
//   return state.search.value;
// })

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  //<React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  //</React.StrictMode>
);

