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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';


export function Search(){
    interface GenreList{
        genre:string
        ID:number
    }
    const [search,setSearch] = useState<boolean>(false)

    const [genreList,setGenreList]= useState<GenreList[]>([])

    const [genre,setGenre] = useState<string>('')
    const [rating,setRating] = useState<string>('')
    const [year,setYear]= useState<string>('')
    const [sort,setSort] = useState<string>('')
    const [term,setTerm] = useState<string>('')
    const [GenreRef,setGenreRef] = useState<string>('')
    const [RatingRef,setRatingRef] =useState<string>('')
    const [YearRef,setYearRef] =useState<string>('')
    const [SortRef,setSortRef] =useState<string>('')
    const [TermRef,setTermRef] =useState<string>('')

    const getGenreList= async()=>{
        Axios.get(`http://localhost:3001/api/movieinfo/genres`).then((res)=>{
            if(res.data.success){
                setGenreList(res.data.data)
            }else{
                console.log("err")
            }
        }).catch(()=>{
            console.log("err")
        })
    }

    const SubmitSearchData = ()=>{
        if(genre === "All"){ setGenreRef("")}else{setGenreRef(genre)}
        if(year === "All"){setYearRef("")}else{setYearRef(year)}
        if(sort === "All"){setSortRef("")}else{setSortRef(sort)}
        if(rating === "All"){setRatingRef("")}else{setRatingRef(rating)}
        setTermRef(term)
        setSearch(true)
    }


    useEffect(()=>{
        getGenreList()
        
    },[])


    return <>

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
                        {/* <MenuItem value={"Drama"}>Drama</MenuItem>
                        <MenuItem value={"Action"}>Action</MenuItem>
                        <MenuItem value={"War"}>War</MenuItem>
                        <MenuItem value={"Western"}>Western</MenuItem>
                        <MenuItem value={"Talk-Show"}>Talk-Show</MenuItem>
                        <MenuItem value={"Game-Show"}>Game-Show</MenuItem>
                        <MenuItem value={"Film-Noir"}>Film-Noir</MenuItem> */}
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
                        <MenuItem value={"2022"}>2022</MenuItem>
                        <MenuItem value={"2021"}>2021</MenuItem>
                        <MenuItem value={"2020"}>2020</MenuItem>
                        <MenuItem value={"2019"}>2019</MenuItem>
                        <MenuItem value={"2018"}>2018</MenuItem>
                        <MenuItem value={"2017"}>2017</MenuItem>
                        <MenuItem value={"2016"}>2016</MenuItem>
                        <MenuItem value={"2015"}>2015</MenuItem>
                        <MenuItem value={"2014"}>2014</MenuItem>
                        <MenuItem value={"2013"}>2013</MenuItem>
                        <MenuItem value={"2012"}>2012</MenuItem>
                        <MenuItem value={"2011"}>2011</MenuItem>
                        <MenuItem value={"2010"}>2010</MenuItem>
                        <MenuItem value={"2009"}>2009</MenuItem>

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
                        <MenuItem value={"All"}>All</MenuItem>
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

        {(search)?<>
                    <Movies rating={RatingRef}
                            sort={SortRef}
                            genre={GenreRef}
                            term={TermRef}
                            year={YearRef}
                            />
                 </>
                :<>

                 </>}
    </>



}
export default Search; 