import React, { useEffect, useState } from 'react';
import { Link} from "react-router-dom"
import Axios from 'axios'
//슬라이드효과
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

//mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

//mui icon
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

//redux store
import { useSelector} from 'react-redux';
import {RootState} from '../store/store'
import { addListener } from 'process';
import { forEachTrailingCommentRange } from 'typescript/lib/tsserverlibrary';
import { isVariableDeclaration } from 'typescript';

export function RecommendMovies(){
    interface Movie{
        movieID:number,
        image:string,
        title:string,
        summary:string,
        year:string,
        visitcount:number,
        count:number
    }
    interface genre{genre:string,count:number}
    interface userLikeMovies{movieID:any}

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    //const url = "https://movietest2.herokuapp.com"
    const [genre,setGenre] = useState<genre[]>([]) // user가 선호하는 장르 2개 
    const [genreMovies1,setGenreMovies1] = useState<any[]>([]) //장르별 영화들1
    const [genreMovies2,setGenreMovies2] = useState<any[]>([]) //장르별 영화들2
    const [userLikeMovies,setUserLikeMovies] = useState<userLikeMovies[]>([])// 유저가 좋아한 영화들
    const [userLikeData,setUserLikeData] = useState<boolean>()
    const [finishSet,setFinishSet] = useState<boolean>(false)
    const [UserId ,setUserId] = useState(sessionStorage.getItem("user_id"))
    //const UserId =  useSelector<RootState,string>(state=>{return state.userId.Id})
    const [movies,setMovies] = useState<any[]>([])
    // useEffect(()=>{
    //   setUserId(sessionStorage.getItem("user_id"))
    // },[sessionStorage.getItem("user_id")])
    var list:any[];
    var newMovieList:any[];
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  infinite: true,
                  dots: true
                }
            },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      }

    const getBestMovies = async()=>{
        await Axios.get(`${url}/api/get/movies/best`).then((res)=>{
            if(res.data.success){
                setMovies(res.data.data)
            }else{
                //alert("top Movie list error")
            }
        }).catch((err)=>{
            //alert("BestMovie list error 관리자에 문의")
        })
    }

    const getUserGenre = async ()=>{ // 유저 선호 장르 2개 
      await Axios.post(`${url}/api/movieinfo/user/genre`,{userID:UserId}).then((res)=>{
        if(res.data.success){
          setGenre(res.data.data)
        }else{
          alert("recommend movie list error")
        }
      }).catch((err)=>{
        alert("recommned error 관리자에 문의")
      })
    }

    const getUserlikeMoives = async ()=>{ //유저가 좋아하는 영화id목록
      await Axios.post(`${url}/api/get/movies/user_rate`,{userID:UserId}).then((res)=>{
        if(res.data.success){
          setUserLikeMovies(res.data.data)
        }else{
          alert("userlikemovies error")
        }
      }).catch((err)=>{
        alert("userlikemovies 관리자에 문의")
      })
    }

    //장르별 영화 목록
    const getGenreMoives = async (genre:string,setGenreMovies:React.Dispatch<React.SetStateAction<Movie[]>>)=>{
      const response = await fetch(`https://yts.mx/api/v2/list_movies.json?minimum_rating=6&genre=${genre}&sort_by=rating&limit=50`)
      const json = await response.json()
      setGenreMovies(json.data.movies)
    }

    const getRecommendMovies = async()=>{//장르2개,좋아요영화ID목록, 장르별영화목록 => 추천영화10개 
      if(userLikeData !== false){
        if(genreMovies2.length !== 0){
          const list1 = [{movieID:111}]
          console.log(list1.includes({movieID:1110}))
          console.log(userLikeMovies.includes({movieID:36834}))
          for(var i = 0; i < genreMovies1.length; i++){
            var result = false
            for(var j = 0; j < userLikeMovies.length; j++){
              if(genreMovies1[i].id === userLikeMovies[j].movieID){
                result = true
              }
            }
            if(!result){
              newMovieList.push(genreMovies1[i])
              console.log(newMovieList)
            }
          }
          //console.log(genreMovies1.filter(m => (userLikeMovies.includes({movieID:Number(m.id)}))),"con")
          console.log(newMovieList)
          setMovies(newMovieList)
          setFinishSet(true)

        }else{
          setMovies(genreMovies1.filter(m => (!userLikeMovies.includes({movieID:m.movieID}))))
          setFinishSet(true)
        }
      }

    }

    useEffect(()=>{
        //getBestMovies()
        getUserlikeMoives() // 유저가 좋아하는 영화 목록
        getUserGenre() // 유저가 좋아하는 장르 2개 
    },[])

    useEffect(()=>{
      if(genre.length === 2){
        getGenreMoives(genre[0].genre,setGenreMovies1) //장르별 영화목록 (평점순)
        getGenreMoives(genre[1].genre,setGenreMovies2)
        setUserLikeData(true)
      }else if(genre.length === 1){
        getGenreMoives(genre[0].genre,setGenreMovies1)
        setUserLikeData(true)
      }else{
        setUserLikeData(false) // 유저 활동 데이터가 없다.
      }
    },[genre,userLikeMovies])

    useEffect(()=>{
      getRecommendMovies()
      console.log(genre,userLikeMovies,genreMovies1,genreMovies2)
      console.log(movies,'movies', userLikeData)
    },[genreMovies1,genreMovies2])



    return <>
    {/* {(UserId === null || userLikeData === false)? <></>
                      : <Box sx={{m:10,width:'auto',minWidth:'500px'}}>
                          <Typography gutterBottom variant="h4" component="div">
                            Recommend Movies ({UserId})
                          </Typography>
                          <Slider {...settings}>
                              {movies.map((m)=>{
                                  return<Box key={m.movieID} sx={{ maxWidth: 400 ,minWidth:150}} > 
                                      <Card  sx={{ maxWidth: 345 }}>
                                          <CardActionArea component={Link} 
                                                          to={`/home/movie/${m.movieID}`} 
                                                          onClick={()=>{sessionStorage.removeItem('movie_summary'); 
                                                                      sessionStorage.setItem('movie_summary',m.summary)}}>
                                              <CardMedia 
                                                  component="img"
                                                  height="300"
                                                  image={m.image}
                                                  alt={m.title}
                                                  />
                                              <CardContent sx={{height:120}} >
                                                  <Typography gutterBottom variant="h6" component="div">
                                                      {m.title}({m.year})
                                                  </Typography>
                                                  <Typography gutterBottom component="div">
                                                      <ThumbUpIcon sx={{ fontSize: 15, ml:1}}/>{m.count}
                                                      <VisibilityIcon sx={{ fontSize: 15, ml:1}}/>{m.visitcount} 
                                                  </Typography>
                                              </CardContent>
                                          </CardActionArea>
                                      </Card>
                                  </Box>
                              })}
                          </Slider>
                      </Box>
                            
            }  */}
          </>
}

export default RecommendMovies;