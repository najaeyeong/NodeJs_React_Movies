import  {useEffect, useState}from 'react';
import axios from 'axios';

//mui
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CreateIcon from '@mui/icons-material/Create';
import IconButton from '@mui/material/IconButton';
import Box from "@mui/material/Box";
import SearchIcon from '@mui/icons-material/Search';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControl, InputLabel, MenuItem, TextField } from '@mui/material';

//redux store
import { useSelector} from 'react-redux';
import {RootState} from '../../store/store'
import BoardDetail from './BoardDetail';
import BoardCreate from './BoardCreate';


interface Column {
    id: 'Number' | 'Title' | 'UserId' | 'Date' | 'Visited' ;
    label: string;
    minWidth?: number;
    align?: 'right'| 'center';
    format?: (value: number) => string;
  }

const columns : Column[] = [
    {id:'Number', label:'Number' ,align:"center", minWidth:50},
    {id:'Title', label:'Title' ,align:"center", minWidth:300},
    {id:'UserId', label:'User Id' ,align:"center", minWidth:100},
    {id:'Date', label:'Date' ,align:"center", minWidth:100},
    {id:'Visited', label:'Visited' ,align:"center", minWidth:50},
]

interface Data {
    Number:number,
    Title:string,
    UserId:string,
    Date:Date,
    Visited:number
}

let rows : Data[] = [

    
    ]



export function Board(){
    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const [page,setPage] = useState<number>(0) //현재 페이지 번호
    const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지에 표현할 글 갯수
    const [create,setCreate] = useState<boolean>(false) // 글작성 페이지 오픈
    const [detail,setDetail] = useState<boolean>(false) // 글내용 페이지 오픈
    const [number,setNumber] = useState<number>() // 현재 클릭한 글 번호
    const [selectedOption,setSelectedOption] = useState<string>('title') // 제목 ,글쓴이 옵션
    const [searchKeyword,setSearchKeyword] = useState<string>('') // 검색어 
    const [count,setCount] = useState<number>(0)
    const [Rows,setRows] = useState<Data[]>(rows)
    const getBoardList =  async(page:number,rowperpage:number)=>{
        const data = {
            page:page,
            rowsPerPage:rowperpage,
            searchKeyword:searchKeyword,
            selectedOption:selectedOption
        }
        await axios.post(`${url}/api/get/board`,data).then((res)=>{
            rows=[]
            if(res.data.success){
                const list = res.data.data
                for(let i = 0; i < list.length; i++){
                    rows.push({    
                        Number:list[i].number,
                        Title:list[i].title,
                        UserId:list[i].user,
                        Date:list[i].date,
                        Visited:list[i].visited
                    })
                }
                setCount(res.data.data2[0].count)
                console.log(rows,res.data.data2[0].count,count);
            }
        }).catch((error)=>{
            console.log("get Board list error",error);
        })
        setRows(rows)
    }

    const handleChangePage = (event:unknown,newPage:number)=>{
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    const handleChangeCreate = (event:unknown)=>{
        setCreate(!create)
    }
    const handleChangeSelectOption = (event:SelectChangeEvent<string>)=>{
        setSelectedOption(event.target.value)
    }
    const handleChangeKeyword = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchKeyword(event.target.value)
    }

    useEffect( ()=>{
        getBoardList(page,rowsPerPage)
    },[page,rowsPerPage])

    return <>
    {create 
        ?<><BoardCreate/></> 
        :<>
            {detail 
                ?<><BoardDetail/></>
                :<>

                <Box component={'form'} sx={{mt:10,mb:1,mr:1,display: 'flex', flexDirection: 'row', justifyContent: 'flex-end',minWidth:800}}>
                    <Box id="select_option" sx={{mr:1,minWidth:100}}>
                        <Select
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue={selectedOption}
                        label="Option"
                        onChange={handleChangeSelectOption}
                        >
                            <MenuItem value={'title'}>Title</MenuItem>
                            <MenuItem value={'user'}>UserId</MenuItem>
                        </Select>
                    </Box>
                    <Box id="search_keyword" sx={{mr:1}}>
                        <TextField id="outlined-basic" label="Search" variant="outlined" 
                            onChange={handleChangeKeyword}/>
                    </Box>
                    <Box id="search_button">
                        <IconButton onClick={()=>{getBoardList(0,10)}}>
                            <SearchIcon fontSize="large"/>
                        </IconButton>
                    </Box>
                </Box>

                <Paper sx={{  width: '100%',minWidth:800 }}>
                <TableContainer sx={{ maxHeight: 500 ,minHeight:500}}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        <TableCell align="center" colSpan={3}>
                            Main
                        </TableCell>
                        <TableCell align="center" colSpan={2}>
                            Details
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ top: 57, minWidth: column.minWidth }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Rows
                        .map((row) => {
                            return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.Number}>
                                {columns.map((column) => {
                                const value = row[column.id].toLocaleString();
                                return (
                                    <TableCell key={column.id} align={column.align} onClick={()=>{}}>
                                    {value}
                                    </TableCell>
                                );
                                })}
                            </TableRow>
                            );
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </Paper>
                <Box sx={{display: 'flex',  flexDirection: 'row-reverse',minWidth:800}}>
                    <Box sx={{m:1}}>
                        <IconButton onClick={handleChangeCreate}><CreateIcon/>Create</IconButton>
                    </Box>
                </Box>
                </>}
        </>}
    </>
}

export default Board