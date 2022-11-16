//react
import {useState,useEffect} from 'react'
import Axios from 'axios'

//dir
import Movies from "../component/Movies"
import RecommendMovies from "./RecommendMovies"
import BestMovies  from './BestMovies'

//mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

//redux store
import { useSelector,useDispatch} from 'react-redux';
import {RootState} from '../store/store'
import {update_genre,update_rate,update_year,update_sort,update_term,update_searched,update_page,reset } from '../store/searchDateSlice'



export function Search(){
    interface GenreList{
        genre:string
        ID:number
    }

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    //const url = "https://movietest2.herokuapp.com"


    const [getList,setGetList] = useState<boolean>(false)

    const [genreList,setGenreList]= useState<GenreList[]>([])
    const [yearList,setYearList] = useState<string[]>([])
    
    const [genre,setGenre] = useState<any>("All")
    const [rating,setRating] = useState<any>("All")
    const [year,setYear]= useState<any>("All")
    const [sort,setSort] = useState<any>("year")
    const [term,setTerm] = useState<any>('')
    
    const [GenreRef,setGenreRef] = useState(sessionStorage.getItem('genre'))//useSelector<RootState,string>(state=>{return state.search.genre})
    const [RatingRef,setRatingRef] = useState(sessionStorage.getItem('rating'))//useSelector<RootState,string>(state=>{return state.search.rate})
    const [YearRef,setYearRef]= useState(sessionStorage.getItem('year'))//useSelector<RootState,string>(state=>{return state.search.year})
    const [SortRef,setSortRef] = useState(sessionStorage.getItem('sort'))//useSelector<RootState,string>(state=>{return state.search.sort})
    const [TermRef,setTermRef] = useState(sessionStorage.getItem('term'))//useSelector<RootState,string>(state=>{return state.search.term})
    const [search,setSearch] = useState<boolean>(false)//useSelector<RootState,boolean>(state=>{return state.search.searched})



    const getGenreList= async()=>{
        await Axios.get(`${url}/api/movieinfo/genres`).then((res)=>{
            if(res.data.success){
                setGenreList(res.data.data)
            }else{
                console.log("err")
            }
        }).catch(()=>{
            console.log("genreList err")
        })
    }

    const getYearList = async ()=>{
        var list: {year:string}[] = []
        var newlist:string[] = []
        await Axios.get(`${url}/api/movieinfo/years`).then((res)=>{
            if(res.data.success){
                list = res.data.data
                //setYearList(res.data.data)
                for(var i = parseInt(list[list.length-1].year); i > (parseInt(list[0].year)-1); i--){
                    newlist.push(i.toString())
                }
            }else{
                console.log("err")
            }
        }).catch(()=>{
            console.log("yearList err")
        })
        setYearList(newlist)
    }


    const SubmitSearchData = ()=>{
        if(genre === "All"){ sessionStorage.removeItem('genre'); setGenreRef('')}else{sessionStorage.setItem('genre',genre);setGenreRef(genre) }/*{dispatch(update_genre(""))}else{dispatch(update_genre(genre))*/
        if(year === "All"){ sessionStorage.removeItem('year');setYearRef('')}else{sessionStorage.setItem('year',year);setYearRef(year) }/*{dispatch(update_year(""))}else{dispatch(update_year(year))}*/
        if(rating === "All"){ sessionStorage.removeItem('rating');setRatingRef('')}else{sessionStorage.setItem('rating',rating);setRatingRef(rating) }/*{dispatch(update_rate(""))}else{dispatch(update_rate(rating))}*/
        sessionStorage.setItem('sort',sort);
        setSortRef(sort)
        sessionStorage.setItem('term',term)
        setTermRef(term)
        setSearch(true)
        sessionStorage.removeItem('page')
        sessionStorage.removeItem('lastpagenumber')
        sessionStorage.removeItem('backlist')
        console.log(genre,year,rating,sort,term)
    }


    useEffect(()=>{
        getGenreList()
        getYearList()
        setGetList(true)
    },[])

    //초기값 세팅
    useEffect(()=>{
        if(sessionStorage.getItem('genre') !== null || sessionStorage.getItem('rating') !== null ||
        sessionStorage.getItem('year') !== null || sessionStorage.getItem('sort') !== null || sessionStorage.getItem('term') !== null){
            setSearch(true)
        }else{
            setSearch(false)
        }
        //장르
        if(sessionStorage.getItem('genre') === null){
            setGenre("All");
            setGenreRef("")
        }else{
            setGenre(sessionStorage.getItem('genre'));
            setGenreRef(sessionStorage.getItem('genre'));
        }
        //평점
        if(sessionStorage.getItem('rating') === null){
            setRating("All");
            setRatingRef('');
        }else{
            setRating(sessionStorage.getItem('rating'));
            setRatingRef(sessionStorage.getItem('rating'));
        }
        //년도
        if(sessionStorage.getItem('year') === null){
            setYear("All");
            setYearRef('');
        }else{
            setYear(sessionStorage.getItem('year'));
            setYearRef(sessionStorage.getItem('year'));
        }
        //정렬
        if(sessionStorage.getItem('sort') === null){
            setSort("year");
            setSortRef('')
        }else{
            setSort(sessionStorage.getItem('sort'));
            setSortRef(sessionStorage.getItem('sort'))
        }
        //검색어
        if(sessionStorage.getItem('term') === null){
            setTerm('')
            setTermRef('')
        }else{
            setTerm(sessionStorage.getItem('term'))
            setTermRef(sessionStorage.getItem('term'))
        }
    },[])

    useEffect(()=>{
        setGetList(true)
    },[genreList,yearList])


    return <Box>
        {(getList) ?<Box>
                    <Box sx={{mt:3,mb:5}} display="grid" gridTemplateColumns="repeat(6,1fr)"gridTemplateRows="10px,5px,10px,5px,10px,15px" gap={1} columnGap={4} >
                        <Box gridColumn="span 6">
                            <Paper/>
                        </Box>
                        <Box gridColumn="2/span 1">
                            Search
                        </Box>
                        <Box gridColumn="2/span 3">
                            <TextField fullWidth id="outlined-basic" label="Search" variant="outlined" value={term} onChange={(e)=>{setTerm( e.target.value)}}/>
                        </Box>
                        <Box gridColumn="5/span 1">

                            <IconButton onClick={()=>{SubmitSearchData()}}><SearchIcon color="primary"/>Search</IconButton>
                        </Box>
                        <Box gridColumn="2/span 1">
                            Genre
                        </Box>
                        <Box gridColumn="3/span 1">
                            Rate
                        </Box>
                        <Box gridColumn="4/span 1">
                            year
                        </Box>
                        <Box gridColumn="5/span 1">
                            Sort
                        </Box>
                        <Box gridColumn="2/span 1">
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="genre">Genre</InputLabel>
                                    <Select
                                    labelId="genre"
                                    id="genre"
                                    //defaultValue={genre}
                                    value={genre}
                                    label="Genre"
                                    onChange={(e)=>{setGenre(e.target.value)}}
                                    >
                                    <MenuItem value={"All"}>All</MenuItem>
                                    {genreList?.map((g)=>{
                                        return <MenuItem key={g.ID} value={`${g.genre}`}>{g.genre}</MenuItem>
                                    })}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box gridColumn="3/span 1">
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="Rate">Rate</InputLabel>
                                    <Select
                                    labelId="Rate"
                                    id="Rate"
                                    //defaultValue={rating}
                                    value={rating}
                                    label="Rate"
                                    onChange={(e)=>{setRating(e.target.value)}}
                                    >
                                    <MenuItem value={"All"}>All</MenuItem>
                                    <MenuItem value={"9"}>9+</MenuItem>
                                    <MenuItem value={"8"}>8+</MenuItem>
                                    <MenuItem value={"7"} selected>7+</MenuItem>
                                    <MenuItem value={"6"}>6+</MenuItem>
                                    <MenuItem value={"5"}>5+</MenuItem>
                                    <MenuItem value={"4"}>4+</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box gridColumn="4/span 1">
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="Year">Year</InputLabel>
                                    <Select
                                    labelId="Year"
                                    id="Year"
                                    //defaultValue={year}
                                    value={year}
                                    label="Year"
                                    onChange={(e)=>{setYear(e.target.value)}}
                                    >

                                        <MenuItem value={"All"}>All</MenuItem>    
                                        {yearList?.map((y)=>{
                                            return <MenuItem key={y} value={`${y}`}>{y}</MenuItem>  
                                        })}

                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box gridColumn="5/span 1">
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="Sort">Sort</InputLabel>
                                    <Select
                                    labelId="Sort"
                                    id="Sort"
                                    //defaultValue={sort}
                                    value={sort}
                                    label="Sord"
                                    onChange={(e)=>{setSort(e.target.value)}}
                                    >
                                        <MenuItem value={"&order_by desc"}>Lastest</MenuItem>
                                        <MenuItem value={"&order_by asc"}>Oldest</MenuItem>
                                        <MenuItem value={"rating"}>Rating</MenuItem>
                                        <MenuItem value={"title"}>Title</MenuItem>
                                        <MenuItem value={"seeds"}>Seeds</MenuItem>
                                        <MenuItem value={"peers"}>Peers</MenuItem>
                                        <MenuItem value={"year"}>Years</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                    </Box>
                   
                   :<>
                    </>
        }


        {(search)?<Box>
                    <Movies rating={RatingRef}
                            sort={SortRef}
                            genre={GenreRef}
                            term={TermRef}
                            year={YearRef}
                            />
                 </Box>
                :<Box>
                    <RecommendMovies/>
                    <BestMovies/>
                 </Box>}
    </Box>



}
export default Search; 