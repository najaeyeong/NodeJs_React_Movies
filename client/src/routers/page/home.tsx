/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import MenuBar from '../../component/MenuBar';
import Movie from "../../component/Movie";
import Movies from "../../component/Movies"
import Search from "../../component/Search"
import styles from "../css/Home.module.css";
import Footer from '../../component/Footer';
import UserInfo from '../../component/UserInfo';
import axios from 'axios';

//mui
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

//redux store
import {Provider} from 'react-redux';
import store from '../../store/store'
import {useSelector,useDispatch} from "react-redux"
import {RootState} from '../../store/store'
import userIdSlice from '../../store/userIdSlice';


export function Home(){
    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const menu = useSelector<RootState,string>(state=>{return state.menu.menu})
    const userId = useSelector<RootState,string>(state=>{return state.userId.id})
    const dispatch = useDispatch()
    const [loading, setLoading] = useState<boolean>(true)
    const [movies,setMovies] = useState<any[]>([])
    const [movieCount,setMovieCount] = useState<number>(0)

    const getUserData = ()=>{
      axios.get(`${url}/api/accessToken`).then((res)=>{
        console.log(res.data)
        if(res.data.success){
          console.log(res)
          dispatch(userIdSlice.actions.login(res.data.data[0]))//login   store에 정보 변경 
        }else{
          if(res.data.err.name === 'TokenExpiredError'){//토큰기간 말료
            //refresh
            getAccessToken()
          }else if(res.data.err.name === 'JsonWebTokenError' ){ //토큰없음
            dispatch(userIdSlice.actions.logout())//logout  store에 정보 삭제 
          }
          console.log(res)
          //refresh 토큰 으로 확인 
          //setLogin(false)
        }
      }).catch((err)=>{
        console.log(err)
      })
    }
  
    const getAccessToken = ()=>{
      axios.get(`${url}/api/refreshToken`).then((res)=>{
        if(res.data.success){
          console.log(res)
          getUserData()
        }else{
          console.log(res)
          dispatch(userIdSlice.actions.logout())//logout store에 정보 삭제 
        }
      }).catch((err)=>{
        console.log(err)
        dispatch(userIdSlice.actions.logout())//logout store에 정보 삭제 
      })
    }
    
    useEffect(()=>{
      getUserData()
    })
    
    useEffect(()=>{
      window.scrollTo(0, 0)
      //getMovies()
      //console.log(movieCount)
    },[loading])



    return<Provider store={store}>
            <MenuBar />
            <>
              {(menu === "search")
                  ?<Search/>
                  :<>
                    {(menu==="userInfo")
                        ?<UserInfo/>
                        :<>not</>
                    }
                  </>
              }
            </>
            <Footer/>
          </Provider> 
}

export default Home;
//<Provider store={store}></Provider>
          {/* <Provider store={store}>
            <MenuBar />
            <Search/>
          </Provider> */}