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

//암복화
import Crypto from '../../config/Crypto';

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

    const getUserData = async ()=>{
      axios.get(`${url}/api/accessToken`).then((res)=>{
        const key = res.data.key // 비대칭암호화된 대칭키
        const Data = res.data.data //대칭 암호화된 json정보
        const ClientPrivatekey = process.env.REACT_APP_ClientPrivateKey //비대칭 개인키
        const decodedKey = Crypto.decodeRSA(ClientPrivatekey,key) //개인키로 복호화된 대칭키
        const decode = Crypto.decodeAES256(decodedKey,Data) //대칭키로 복호화된 json정보
        const decodedData = JSON.parse(decode)//json정보 복구
        try {
          if(decodedData.success){
            dispatch(userIdSlice.actions.login(decodedData.data[0]))//login   store에 정보 변경 
          }else{
            if(decodedData.err.name === 'TokenExpiredError'){//토큰기간 말료
              //refresh
              getAccessToken()
            }else if(decodedData.err.name === 'JsonWebTokenError' ){ //토큰없음
              dispatch(userIdSlice.actions.logout())//logout  store에 정보 삭제 
            }
  
            //refresh 토큰 으로 확인 
            //setLogin(false)
          }
        } catch (error) {
          console.log(error);
          console.log("복호화 error")
        }
      }).catch((err)=>{
        console.log(err)
        console.log("user data get error ");
      })
    }
  
    const getAccessToken = ()=>{
      axios.get(`${url}/api/refreshToken`).then((res)=>{
        if(res.data.success){
          getUserData()
        }else{
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