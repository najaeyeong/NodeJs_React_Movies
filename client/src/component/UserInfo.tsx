import {useEffect, useState} from 'react'
import Axios from 'axios'

//mui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

//redux store
import { useSelector,useDispatch} from 'react-redux';
import {RootState} from '../store/store'
import axios from 'axios';



export function UserInfo(){

    interface UserInfo{id:string,psword:string,name:string}
    interface UserGenre{genre:string}
    interface UserLanguage{language:string,count:number}
    interface UserYear{year:string}
    interface UserMovies{movieID:number,image:string,title:string,summary:string,language:string,rate:string,year:string}

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const [userID,setUserID] = useState(sessionStorage.getItem('user_id'))
    const [userInfo, setUserInfo] = useState<UserInfo[]>([])
    const [userGenre,setUserGenre] = useState<UserGenre[]>([])
    const [userLanguage,setUserLanguage] = useState<UserLanguage[]>([])
    const [userYear,setUserYear] = useState<UserYear[]>([])
    const [userMovies,setUserMovie] = useState<UserMovies[]>([])
    
    
    const getUserInfo = async()=>{
        await axios.post(`${url}/api/get/user/info`,{userID:userID}).then((res)=>{
            if(res.data.success){
                setUserInfo(res.data.data)
            }else{

            }
        }).catch((err)=>{

        })
    }

    const getUserGenre = async()=>{
        await axios.post(`${url}/api/movieinfo/user/genre`,{userID:userID}).then((res)=>{
            if(res.data.success){
                setUserGenre(res.data.data)
            }else{

            }
        }).catch((err)=>{
            
        })
    }

    const getUserLanguage = async()=>{
        await axios.post(`${url}/api/get/user/language`,{userID:userID}).then((res)=>{
            if(res.data.success){
                setUserLanguage(res.data.data)
            }else{

            }
        }).catch((err)=>{
            
        })
    }

    const getUserlikeMoives = async()=>{
        await axios.post(`${url}/api/get/user/movies`,{userID:userID}).then((res)=>{
            if(res.data.success){
                setUserMovie(res.data.data)
            }else{

            }
        }).catch((err)=>{
            
        })
    }

    const getUserYear = async()=>{
        await axios.post(`${url}/api/get/user/year`,{userID:userID}).then((res)=>{
            if(res.data.success){
                setUserYear(res.data.data)
            }else{

            }
        }).catch((err)=>{
            
        })
    }

    useEffect(()=>{
        getUserInfo()
        getUserGenre()
        getUserLanguage()
        getUserlikeMoives()
        getUserYear()
    },[])

    useEffect(()=>{
        setUserID(sessionStorage.getItem('user_id'))
    },[sessionStorage.getItem('user_id')])

    useEffect(()=>{
        console.log(  {userGenre},{userYear},{userLanguage},{userInfo},{userMovies})
    },[userMovies])


    return  <Box>
                <Grid container spacing={3}  direction="row" justifyContent="flex-start" alignItems="stretch">
                    <Grid item xs>
                        <Box></Box>
                    </Grid>
                    <Grid item xs={8}>
                            <>

                            </>
                    </Grid>
                    <Grid item xs>
                        <Box></Box>
                    </Grid>
                </Grid>
            </Box>
}

export default UserInfo;