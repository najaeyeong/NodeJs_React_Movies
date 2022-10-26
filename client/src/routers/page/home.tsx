/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import MenuBar from '../../component/MenuBar';
import Movie from "../../component/Movie";
import Movies from "../../component/Movies"
import Search from "../../component/Search"
import styles from "../css/Home.module.css";
//mui
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export function Home(){
    
    const [loading, setLoading] = useState<boolean>(true)
    const [movies,setMovies] = useState<any[]>([])
    const [movieCount,setMovieCount] = useState<number>(0)
    //비동기적 함수 async   기다리게 만드는 await     async 함수 반환값은 promise 
    const getMovies = async ()=>{
      const response = await fetch('https://yts.mx/api/v2/list_movies.json?minimum_rating=5.8&sort_by=year&limit=50&page=1')
      const json = await response.json()
      setMovies(json.data.movies)
      setMovieCount(json.data.movie_count)
      setLoading(false)
    }
    
    useEffect(()=>{
      window.scrollTo(0, 0)
      //getMovies()
      //console.log(movieCount)
    },[loading])



    return <>
        <MenuBar />
        <Search/>

      </>


}

export default Home;