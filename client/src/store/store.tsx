import {configureStore}from '@reduxjs/toolkit'
import searchDataSlice from './searchDateSlice';
import userIdSlice from './userIdSlice';
import serverUrlSlice from './urlSlice';


//slice 통합한 store
const store = configureStore({
    reducer:{
      search:searchDataSlice.reducer,
      userId:userIdSlice.reducer,
      serverUrl:serverUrlSlice.reducer
    }
  })

  export default store;
  //typescript 에서 사용시  state의 타입을 알기위해 타입도 같이 반환해주어야 한다. 
  export type RootState = ReturnType<typeof store.getState>
  export type AppDispatch = typeof store.dispatch

//store data 사용방법 

//<Provider store={store}>로 감싸준다 . page에서 사용할거면 index에  component에서 사용할거면 page에  

// const dispatch = useDispatch()
// dispatch({type:'searchDataSlice/search',data:2})
// dispatch(searchDataSlice.actions.update(2))
// const searchDate = useSelector(state=>{
//   return state.search.value;
// })


