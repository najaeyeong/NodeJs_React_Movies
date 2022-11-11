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
import { Grid } from '@mui/material'


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
    
    const [genre,setGenre] = useState<string>("All")
    const [rating,setRating] = useState<string>("All")
    const [year,setYear]= useState<string>("All")
    const [sort,setSort] = useState<string>("year")
    const [term,setTerm] = useState<string>('')
    // const [search,setSearch] = useState<boolean>(false)   
    // const [GenreRef,setGenreRef] = useState<string>('')
    // const [RatingRef,setRatingRef] =useState<string>('')
    // const [YearRef,setYearRef] =useState<string>('')
    // const [SortRef,setSortRef] =useState<string>('')
    // const [TermRef,setTermRef] =useState<string>('')
    
    const GenreRef = useSelector<RootState,string>(state=>{return state.search.genre})
    const RatingRef = useSelector<RootState,string>(state=>{return state.search.rate})
    const YearRef = useSelector<RootState,string>(state=>{return state.search.year})
    const SortRef = useSelector<RootState,string>(state=>{return state.search.sort})
    const TermRef = useSelector<RootState,string>(state=>{return state.search.term})
    const search = useSelector<RootState,boolean>(state=>{return state.search.searched})

    const dispatch= useDispatch();

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
        if(genre === "All"){dispatch(update_genre(""))}else{dispatch(update_genre(genre))}
        if(year === "All"){dispatch(update_year(""))}else{dispatch(update_year(year))}
        if(rating === "All"){dispatch(update_rate(""))}else{dispatch(update_rate(rating))}
        dispatch(update_sort(sort));
        dispatch(update_term(term));
        dispatch(update_searched(true));
        dispatch(update_page(1));
        // setSortRef(sort)
        // setTermRef(term)
        // setSearch(true)
    }


    useEffect(()=>{
        getGenreList()
        getYearList()
        setGetList(true)
    },[])

    useEffect(()=>{
        if(GenreRef !=="" || RatingRef !=="" || YearRef!=="" || SortRef!=="" || TermRef !== ""){
            if(GenreRef === ''){setGenre("All");}else{setGenre(GenreRef);}
            if(RatingRef === ''){setRating("All");}else{setRating(RatingRef);}
            if(YearRef === ''){setYear("All");}else{setYear(YearRef);}
            if(SortRef === ''){setSort("year");}else{setSort(SortRef);}
            setTerm(TermRef);
        }else{
            setGenre(GenreRef);
            setRating(RatingRef);
            setYear(YearRef);
            setSort("year");
            setTerm(TermRef);
        }
    },[GenreRef ,RatingRef ,YearRef, SortRef, TermRef,search])

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