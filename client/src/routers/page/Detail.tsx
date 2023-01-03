
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'
import { Link} from "react-router-dom"

//dir
import MenuBar from '../../component/MenuBar';
import styles from "../../component/css/Movie.module.css"
import styles1 from "../css/Home.module.css";
import MovieReviewList from "../../component/MovieReviewList";
import { MovieRate } from "../../component/MovieRate";
import MovieDetail from "../../component/MoiveDetail";
import Footer from "../../component/Footer";

//mui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';

//redux store
import {useSelector,useDispatch} from "react-redux"
import {RootState} from '../../store/store'
import userIdSlice from '../../store/userIdSlice';





export function Detail(){

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
  //const url = "https://movietest2.herokuapp.com"
   // const id = useParams().id
    const dispatch = useDispatch()

    const {id} = useParams()
    const [movie,setMovie] = useState<any>()
    const [loading,setLoading] =useState<boolean>(true)
    const [movieID,setMovieID] = useState<string>('')
    const [visitCount, setVisitCount] = useState<number>(-1)


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
      //getMovieDate()

      if(id !== undefined){
        setMovieID(id)
      }
      setLoading(false)
    },[])



      return(
      <>
        {/* <MenuBar/>
       
             {(loading)?
                        <></>
                      :<>
                      <MovieDetail id={movieID}/>
                      <MovieReviewList id={movieID}/>
                      </>
              } */}

          <Box>
            <Grid container  spacing={3} direction="column" justifyContent="flex-start" alignItems="stretch">
                <Grid item xs>
                    <Box><MenuBar/></Box>
                </Grid>
                <Grid item xs={8}>
                    <Box>
                        <Grid container spacing={3}  direction="row" justifyContent="flex-start" alignItems="stretch">
                            <Grid item xs>
                                <Box></Box>
                            </Grid>
                            <Grid item xs={8}>
                                <Box >             
                                  {(loading)?
                                            <></>
                                          :<>
                                          <MovieDetail id={movieID}/>
                                          <MovieReviewList id={movieID}/>
                                          </>
                                   }
                                </Box>
                            </Grid>
                            <Grid item xs>
                                <Box></Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs="auto">
                    <Box>
                        <Footer/>
                    </Box>
                </Grid>
            </Grid>
    
          </Box>
      </>
      )
}

export default Detail; 