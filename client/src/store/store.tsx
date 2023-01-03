import {configureStore,combineReducers,getDefaultMiddleware }from '@reduxjs/toolkit'
import { 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER } from "redux-persist";

//import storageSession from "redux-persist/lib/storage/session";  // sessionStorage
import storage from 'redux-persist/lib/storage'; // localstorage

import searchDataSlice from './searchDateSlice';
import userIdSlice from './userIdSlice';
import serverUrlSlice from './urlSlice';
import menuSlice from './menuSlice';


//slice의 reducer들 통합 
const rootReducer = combineReducers({
  search:searchDataSlice.reducer,
  userId:userIdSlice.reducer,
  serverUrl:serverUrlSlice.reducer,
  menu:menuSlice.reducer
});

const persistConfig: any = {
  key: "root",
  storage, // 사용할 스토리지를 정의해요.
  whitelist: ["search","menu","userId"], //브라우저 새로고침 후에도  유지 할 데이터를 정의해요  state들은 원래 새로고침하면 초기상태로 돌아감 
  //blacklist: ["userId"] // 제외 할 데이터를 정의해요
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

//slice 통합한 store
export const store = configureStore({ 
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ 
    serializableCheck: {
       ignoreActions: true //FLUSH,REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 무시함 
    }
  }),
});

  export default store;
  //typescript 에서 사용시  state의 타입을 알기위해 타입도 같이 반환해주어야 한다. 
  export type RootState = ReturnType<typeof store.getState>
  export type AppDispatch = typeof store.dispatch

//store data 사용방법 

//<Provider store={store}>로 감싸준다 . page에서 사용할거면 index에  component에서 사용할거면 page에  
//<PersistGate loading={null} persistor={persistor}>  새로고침해도 redux store 수정안되게 할려면 


// const dispatch = useDispatch()
// dispatch({type:'searchDataSlice/search',data:2})
// dispatch(searchDataSlice.actions.update(2))
// const searchDate = useSelector(state=>{
//   return state.search.value;
// })




// sessionStorage 에서는 탭마다   redux는 브라우저 마다  같은 브라우저 내의 탭에서는 모두 바뀜 , 로그인시 한 브라우저 내에서 동시 접속 불가능 