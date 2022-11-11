/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import Movie from "../component/Movie";
import styles from "../routers/css/Home.module.css"
//mui
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';

//redux store
import { useSelector,useDispatch} from 'react-redux';
import {RootState} from '../store/store'
import searchDataSlice, {update_page,update_lastpagenumber  } from '../store/searchDateSlice'


interface MoviesProps{
    rating:string
    sort:string
    genre:string
    term:string
    year:string
}
export function Movies(props:MoviesProps){
    
    const [loading, setLoading] = useState<boolean>(true) //영화리스트 받아오기
    const [searched,setSearched] = useState<boolean>(false)  //페이지리스트 받아오기 
    const [movies,setMovies] = useState<any[]>([])
    const [movieCount,setMovieCount] = useState<number>(0)  //영화 갯수 
    const [pageCount,setPageCount] = useState<number>(0)    // 검색결과를 페이지로 나누웠을때 나오는 마지막 페이지 숫자 
    //const [lastNumber,setLastNumber] = useState<number>(10) //페이지리스트의 마지막에 올 숫자  
    const [pageList,setPageList] = useState<number[]>([])  //그러져야할 페이지 숫자 리스트  1~10 , 11~20 ... 
    //const [page,setPage] = useState<number>(1)
    const lastNumber = useSelector<RootState,number>(state=>{return state.search.lastpagenumber})
    const page = useSelector<RootState,number>(state=>{return state.search.page})
    const dispatch = useDispatch()

    





    //비동기적 함수 async   기다리게 만드는 await     async 함수 반환값은 promise 
    const getMovies = async ()=>{
      
      const response = await fetch(
        `https://yts.mx/api/v2/list_movies.json?minimum_rating=${props.rating}&limit=50&page=${page}&genre=${props.genre}&query_term=${props.term} ${props.year}&sort_by=${props.sort}`)
      const json = await response.json()
      setMovies(json.data.movies)
      setMovieCount(json.data.movie_count)
      setPageCount(json.data.movie_count/50)
      setLoading(false)
      setSearched(true)
    }

    //페이지 숫자 리스트를 만드는 함수 
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
    },[loading, page])


    useEffect(()=>{
      setSearched(false)
      setLoading(true)
      //setPage(1)
      //dispatch(update_page(1))
      if(page === 1){
        //setLastNumber(10)
        dispatch(update_lastpagenumber(10))
      }
    },[props.rating, props.sort, props.year, props.genre, props.term])

    useEffect(()=>{
      //setPage(lastNumber-9)
      dispatch(update_page(lastNumber-9))
      NextPageList()
    },[lastNumber])

    useEffect(()=>{
      setSearched(true)
    },[pageList])


//setPage(n);
    return (//이유는 모르겟지만 typescript 에선 map 사용시  &&  사용하면 any type 에러 사라짐 
      <>
        {searched?<>
            <Grid container spacing={3} direction="row"
                                        justifyContent="center"
                                        alignItems="center">
            <Grid item xs={1}></Grid>
              <Grid item xs>총 {movieCount}개</Grid>
              <Grid item xs={6}>
                <ButtonGroup>
                    {(lastNumber>10)?<>
                                        <Button onClick={()=>{dispatch(update_lastpagenumber(lastNumber-10));setLoading(true)
                                                        }}>Pre</Button>
                                    </>
                                    :<></>}
                    {pageList.map(n=>{
                      if(n===page){
                        return<Button variant="contained" key={n} disabled>{n}</Button>
                      }else{
                        return<Button variant="contained" key={n} onClick={()=>{dispatch(update_page(n));setLoading(true);}}>{n}</Button>
                      }
                    })}
                    {(lastNumber>pageCount)?<>
                                            </>
                                            :<>
                                            <Button onClick={()=>{dispatch(update_lastpagenumber(lastNumber+10));setLoading(true)
                                                            }}>Next</Button>
                                            </>}
                </ButtonGroup>
              </Grid>
              <Grid item xs></Grid>
            </Grid>

                  </>
                 :<>
                 Search....
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
                                      
                                      {movies.map(m =><div key={m.id}>
                                              <Movie 
                                              m_id ={m.id}
                                              m_image ={m.medium_cover_image}
                                              m_title ={m.title}
                                              m_summary ={m.summary}
                                              m_genres ={m.genres}
                                              m_year = {m.year}
                                              />
                                            </div>
                                      )}
                                    </>
              }
            </div>)
            
          }
        </div>


        {searched?<>
                    <Box display="grid" gridTemplateColumns="repeat(12,1fr)" columnGap={1}>
                        <Box gridColumn="2/span 1" >
                        </Box>
                        <Box gridColumn="5/span 5">
                            <ButtonGroup>
                                {(lastNumber>10)?<>
                                                    <Button onClick={()=>{(update_lastpagenumber(lastNumber-10));setLoading(true);}}>Pre</Button>
                                                </>
                                                :<></>}

                                {pageList.map(n=>{
                                                  if(n===page){
                                                    return<Button key={n} disabled>{n}</Button>
                                                  }else{
                                                    return<Button key={n} onClick={()=>{dispatch(update_page(n));setLoading(true);}}>{n}</Button>
                                                  }
                                })}

                                {(lastNumber>pageCount)?<>
                                                        </>
                                                       :<>
                                                       <Button onClick={()=>{(update_lastpagenumber(lastNumber+10));setLoading(true);}}>Next</Button>
                                                        </>}
                            </ButtonGroup>
                        </Box>
                    </Box>
                    <br/>
                    <br/>
                    <br/>
                  </>
                 
                 :<>
                  </>
        }




      </>
    );


}

export default Movies;