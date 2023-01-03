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


//redux store
import { useSelector} from 'react-redux';
import {RootState} from '../store/store'

export function LanguageMovies(){
    interface Moive{
        movieID:number,
        image:string,
        title:string,
        summary:string,
        year:string,
        visitcount:number,
        count:number //like 갯수
    }
    interface UserLanguage{
        language:string,
        count:number
    }

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const userID = useSelector<RootState,string>(state=>{return state.userId.id})

    const [movies,setMovies] = useState<Moive[]>([])
    //const [userID] = useState(sessionStorage.getItem('user_id'))
    const [userLanguage,setUserLanguage] = useState<UserLanguage[]>([])
    const [userData,setUserData] = useState<boolean>(true) // user 데이터가 충분하지 않을 때 추천 안함 

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 2,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 2,
                  infinite: true,
                  dots: true
                }
            },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 2,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
        //   {
        //     breakpoint: 480,
        //     settings: {
        //       slidesToShow: 1,
        //       slidesToScroll: 1
        //     }
        //   }
        ]
      }
    
    const getUserLanguage = async ()=>{
        await Axios.post(`${url}/api/get/user/language`,{userID:userID}).then((res)=>{
            if(res.data.success){
                setUserLanguage(res.data.data)
            }else{
                //alert("user language list false")
                setUserData(false)
            }
        }).catch((err)=>{
            alert("user language list error")
        })
    }

    const getLanguageMovies = async()=>{
        await Axios.post(`${url}/api/get/movies/user/language`,{userID:userID}).then((res)=>{
            if(res.data.success){
                setMovies(res.data.data)
            }else{
                //alert("LanguageMovies  list false")
                setUserData(false)
            }
        }).catch((err)=>{
            alert("LanguageMovies list error 관리자에 문의")
        })
    }

    useEffect(()=>{
        getUserLanguage()
        getLanguageMovies()
    },[])

    return <>
        {(userData)
            ?<>
                <Box sx={{m:10, width:'auto',minWidth:'500px'}}>
                    <Typography gutterBottom variant="h4" component="div">
                    {(userLanguage[0])?<>Language Movie ({userLanguage[0].language})</>:<>Language</>}
                    </Typography>
                    <Slider {...settings}>
                        {movies.map((m)=>{
                            return<Box key={m.movieID} sx={{ maxWidth: 400 ,minWidth:150}} > 
                                <Card  sx={{ maxWidth: 345, }}>
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
                                        <CardContent sx={{height:120}}>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {m.title}({m.year})
                                            </Typography>
                                            <Typography gutterBottom component="div">
                                                <VisibilityIcon sx={{ fontSize: 15, ml:1}}/>{m.visitcount} 
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Box>
                        })}
                    </Slider>
                </Box>
            </>
            :<></>
        }
        </>
    
    
    
}

export default LanguageMovies;