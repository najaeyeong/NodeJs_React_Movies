/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import Movie from "../component/Movie";
import styles from "../routers/css/Home.module.css"
//mui
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

interface MoviesProps{
    rating:string
    sort:string
    genre:string
    term:string
    year:string
}
export function Movies(props:MoviesProps){
    
    const [loading, setLoading] = useState<boolean>(true)
    const [searched,setSearched] = useState<boolean>(true)
    const [movies,setMovies] = useState<any[]>([])
    const [movieCount,setMovieCount] = useState<number>(0)
    const [pageCount,setPageCount] = useState<number>(0)
    const [lastNumber,setLastNumber] = useState<number>(10)
    const [pageList,setPageList] = useState<number[]>([])
    const [page,setPage] = useState<number>(1)

    //props
    const [rating,setRating] =useState(props.rating)
    const [sort,setSort] = useState(props.sort)
    const [year,setYear] = useState(props.year)
    const [term,setTerm] = useState(props.term)
    const [genre,setGenre] = useState(props.genre)






    //비동기적 함수 async   기다리게 만드는 await     async 함수 반환값은 promise 
    const getMovies = async ()=>{
      
      const response = await fetch(
        `https://yts.mx/api/v2/list_movies.json?minimum_rating=${props.rating}&sort_by=${props.sort}&limit=50&page=${page}&genre=${props.genre}&query_term=${props.term} ${props.year}`)
      const json = await response.json()
      setMovies(json.data.movies)
      setMovieCount(json.data.movie_count)
      setPageCount(json.data.movie_count/50)
      setLoading(false)
    }


    const NextPageList = ()=>{
        if(lastNumber  > pageCount){
            var m = []
            for(var i = (lastNumber - 9) ; i < pageCount+1; i++){
                m.push(i)
            }
            setPageList(m)
        }else{  
            var m=[]
            for(var i = (lastNumber -9) ; i < (lastNumber + 1); i++){
                m.push(i)
            }
            setPageList(m) 
        } 
    }
    
    useEffect(()=>{
      window.scrollTo(0, 0)
      getMovies()
      NextPageList()
    },[loading,page,props.rating,props.sort,props.year,props.genre,props.term])

    useEffect(()=>{
        setPage(lastNumber-9)
    },[lastNumber])



    return (//이유는 모르겟지만 typescript 에선 map 사용시  &&  사용하면 any type 에러 사라짐 
      <>
        {searched?<>
                    <Box display="grid" gridTemplateColumns="repeat(12,1fr)" columnGap={1}>
                        <Box gridColumn="2/span 1" >
                            {movieCount}개
                        </Box>
                        <Box gridColumn="4/span 5">
                            <ButtonGroup>
                                {(lastNumber>10)?<>
                                                    <Button onClick={()=>{setLastNumber(lastNumber-10);setLoading(true);}}>Pre</Button>
                                                </>
                                                :<></>}
                                {pageList.map(n=>{
                                    return<Button onClick={()=>{setPage(n);setLoading(true);}}>{n}</Button>
                                })}
                                {(lastNumber>pageCount)?<>
                                                        </>
                                                       :<>
                                                       <Button onClick={()=>{setLastNumber(lastNumber+10);setLoading(true);}}>Next</Button>
                                                        </>}
                            </ButtonGroup>
                        </Box>
                    </Box>
                  </>
                 :<>
                  </>
        }
                
                
        <div className={styles.container}>        
          {loading ? <>
                      <div className={styles.loader}>
                        <Box  sx={{ display: 'block'}}>
                        <CircularProgress />
                        </Box>
                        <Box component = "span"sx={{display:'block'}}>Loading...</Box>
                      </div>
                    </>
          : (<div className={styles.movies}>
              
              {movies === undefined ? <><div>검색결과가 없습니다.</div></>
                                    :<>
                                      
                                      {movies.map(m =><>
                                              <Movie     
                                              m_id ={m.id}
                                              m_image ={m.medium_cover_image}
                                              m_title ={m.title}
                                              m_summary ={m.summary}
                                              m_genres ={m.genres}
                                              m_year = {m.year}
                                              />
                                            </>
                                      )}
                                    </>
              }
            </div>)
            
          }
        </div>
      </>
    );


}

export default Movies;