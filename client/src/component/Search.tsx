//react
import {useState,useEffect} from 'react'
import Axios from 'axios'

//dir
import Movies from "../component/Movies"

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



export function Search(){
    interface GenreList{
        genre:string
        ID:number
    }
    const [search,setSearch] = useState<boolean>(false)
    const [getList,setGetList] = useState<boolean>(false)

    const [genreList,setGenreList]= useState<GenreList[]>([])
    const [yearList,setYearList] = useState<string[]>([])
    
    const [genre,setGenre] = useState<string>("All")
    const [rating,setRating] = useState<string>("All")
    const [year,setYear]= useState<string>("All")
    const [sort,setSort] = useState<string>("year")
    const [term,setTerm] = useState<string>('')
    const [GenreRef,setGenreRef] = useState<string>('')
    const [RatingRef,setRatingRef] =useState<string>('')
    const [YearRef,setYearRef] =useState<string>('')
    const [SortRef,setSortRef] =useState<string>('')
    const [TermRef,setTermRef] =useState<string>('')

    const getGenreList= async()=>{
        await Axios.get(`http://localhost:3001/api/movieinfo/genres`).then((res)=>{
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
        await Axios.get(`http://localhost:3001/api/movieinfo/years`).then((res)=>{
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
        if(genre === "All"){ setGenreRef("")}else{setGenreRef(genre)}
        if(year === "All"){setYearRef("")}else{setYearRef(year)}
        if(rating === "All"){setRatingRef("")}else{setRatingRef(rating)}
        setSortRef(sort)
        setTermRef(term)
        setSearch(true)
    }

    useEffect(()=>{
        getGenreList()
        getYearList()
        setGetList(true)
    },[])

    useEffect(()=>{
        setGetList(true)
    },[genreList,yearList])


    return <>
        {(getList) ?<>
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
                                    value={rating}
                                    label="Rate"
                                    onChange={(e)=>{setRating(e.target.value)}}
                                    >
                                    <MenuItem value={"All"}>All</MenuItem>
                                    <MenuItem value={"9"}>9+</MenuItem>
                                    <MenuItem value={"8"}>8+</MenuItem>
                                    <MenuItem value={"7"}>7+</MenuItem>
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
                                    value={sort}
                                    label="Sord"
                                    onChange={(e)=>{setSort(e.target.value)}}
                                    >
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
                    </>
                   
                   :<>
                    </>
        }


        {(search)?<>
                    <Movies rating={RatingRef}
                            sort={SortRef}
                            genre={GenreRef}
                            term={TermRef}
                            year={YearRef}
                            />
                 </>
                :<>
                    인기 추천 
                 </>}
    </>



}
export default Search; 