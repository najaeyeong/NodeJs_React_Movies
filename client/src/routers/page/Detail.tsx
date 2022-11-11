
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios'
import { Link} from "react-router-dom"
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
import {useSelector} from "react-redux"
import {RootState} from '../../store/store'





export function Detail(){

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
  //const url = "https://movietest2.herokuapp.com"
   // const id = useParams().id

    const {id} = useParams()
    const [movie,setMovie] = useState<any>()
    const [loading,setLoading] =useState<boolean>(true)
    const [movieID,setMovieID] = useState<string>('')
    const [visitCount, setVisitCount] = useState<number>(-1)






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
                                <Box>             
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