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

export function BestMovies(){
    interface Moive{
        movieID:number,
        image:string,
        title:string,
        summary:string,
        year:string,
        visitcount:number,
        count:number
    }

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    //const url = "https://movietest2.herokuapp.com"
    const [movies,setMovies] = useState<Moive[]>([])

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
        //   {
        //     breakpoint: 480,
        //     settings: {
        //       slidesToShow: 1,
        //       slidesToScroll: 1
        //     }
        //   }
        ]
      }

    const getBestMovies = async()=>{
        await Axios.get(`${url}/api/get/movies/best`).then((res)=>{
            if(res.data.success){
                setMovies(res.data.data)
            }else{
                alert("top Movie list error")
            }
        }).catch((err)=>{
            alert("BestMovie list error 관리자에 문의")
        })
    }

    useEffect(()=>{
        getBestMovies()
    })

    return <Box sx={{m:10, width:'auto',minWidth:'500px'}}>
        <Typography gutterBottom variant="h4" component="div">
            Top Movies
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
}

export default BestMovies;