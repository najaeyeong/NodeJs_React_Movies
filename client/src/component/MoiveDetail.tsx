
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios'
import { Link} from "react-router-dom"

import styles from "../component/css/Movie.module.css"
import styles1 from "../routers/css/Home.module.css";

import { MovieRate } from "../component/MovieRate";

//mui
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';

//redux store
import {useSelector} from "react-redux"
import {RootState} from '../store/store'



export function MovieDetail(props:{id:string}){

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
  //const url = "https://movietest2.herokuapp.com"
   // const id = useParams().id

    const id = props.id
    const [movie,setMovie] = useState<any>()
    const [loading,setLoading] =useState<boolean>(true)
     const [movieID,setMovieID] = useState<string>('')
    const [visitCount, setVisitCount] = useState<number>(-1)
  

    const getMovieDate = async () => {
      const response = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
      const json = await response.json()
      setMovie(json.data.movie)
      setLoading(false)
    }

    const updateMovieInfo = async () => {
      await Axios.post(`${url}/api/movieinfo/update`, {
        movieID:movie.id,
        image:movie.medium_cover_image,
        title:movie.title,
        year:movie.year,
        runtime:movie.runtime,
        rate:movie.rating,
        language:movie.language,
        summary:sessionStorage.getItem('movie_summary'),
        genres:movie.genres}
        ).then((res)=>{
          if(res.data.success){
            setVisitCount(res.data.data)
          }
      }).catch(()=>{
        alert('InfoUpdate error 관리자에 문의')
      })

    }



    useEffect(()=>{
      window.scrollTo(0, 0)
      getMovieDate()
      sessionStorage.setItem("backlist","y")
      console.log(sessionStorage.getItem('backlist'))
    //   if(id !== undefined){
    //     setMovieID(id)
    //   }
    },[])

    useEffect(()=>{
      
      if(movie !== undefined){
        updateMovieInfo()
      }
    },[movie])

      return(
      <>

          {loading ? 
                    <>
                      <div className={styles1.loader}>
                        <Box  sx={{ display: 'block'}}>
                          <CircularProgress />
                        </Box>
                        <Box component = "span"sx={{display:'block'}}>Loading...</Box>
                      </div>
                    </>
          :( 
            <> 
             <br></br>
             <br></br>
             <div key={movie.id} className={styles.movie}>
                 <img src={movie.medium_cover_image} alt={movie.title} className={styles.movie_detail_img}></img>
                 <div>
                   <h2 className={styles.movie__title}>
                     {movie.title}    
                   </h2>
                   <br></br>
                   <h4>
                     year : {movie.year} 
                   </h4>
                   <h4>
                      rate : {movie.rating} 
                   </h4>
                   <h4>
                   runtime : {movie.runtime}min 
                   </h4>
                   <h4>
                     language : {movie.language}
                   </h4>
                   <h3>genres</h3>
                   <ul className={styles.movie__genres}>  
                   {movie.genres && movie.genres.map( (g:string) =>  <li key={g}>{g}</li> )}
                   </ul>
                   <h3>summary</h3>
                   <p>{sessionStorage.getItem('movie_summary')}</p>
                    <Box sx={{display:"flex" ,flexDirection:'row',  alignItems: 'center' , alignSelf:'flex-start'}}>
                      <Box width="30%">
                          <MovieRate movieID={movie.id} visitCount={visitCount}/>
                      </Box>
                      <Box width="70%"sx={{fontWeight:'bold', ml:5}}>
                          <VisibilityTwoToneIcon  />visited: {visitCount}  
                      </Box>
                      <Box sx={{alignSelf: 'flex-end'}}>
                            <Link to={`/home/movie/`}>
                              <KeyboardReturnRoundedIcon sx={{ fontSize: 60,alignSelf: 'flex-end'}}/>
                            </Link> 
                      </Box>
                    </Box>
                 </div>

             </div>
             
            

             </> )}
      </>
      )
}

export default MovieDetail; 