import axios from 'axios'
import  {useEffect, useState}from 'react';
import JSFileDownload from 'js-file-download' 
//dir
import BoardComment from "./BoardComment"
import BoardUpdate from './BoardUpdate';
//mui
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton } from '@mui/material';
//redux store
import { useSelector} from 'react-redux';
import {RootState} from '../../store/store'





interface BoardDetailProps {
    number:number
    detail:any
    setDetail:any
}

interface file {
    file_origin_name:string
    file_name:string
    file_path:string
    file_size:number
}

export function BoardDetail(props:BoardDetailProps){
    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const userID = useSelector<RootState,string>(state=>{return state.userId.id})
//받아온 게시글 정보
    const [title,setTitle] = useState<string>('')
    const [summary,setSummary] = useState<string>('')
    const [user,setUser] = useState<string>('')
    const [date,setDate] = useState()
    const [visited,setVisited] = useState<number>()
    const [updated,setUpdated] = useState<string>('')
    const [updatedDate,setUpdatedDate] = useState()
    const [Files,setFiles] = useState<file[]>([])

//게시글 수정 
    const [update,setUpdate] = useState<boolean>(false)

//게시글 상세 데이터 갖어오기
    const getBoardSummary = async ()=>{
        axios.post(`${url}/api/get/board/details`,{number:props.number}).then((res)=>{
            if(res.data.success){
                setTitle(res.data.data[0].title)
                setSummary(res.data.data[0].summary)
                setUser(res.data.data[0].user)
                setDate(res.data.data[0].date)
                setUpdated(res.data.data[0].updated)
                setUpdatedDate(res.data.data[0].updated_date)
                setVisited(res.data.data[0].visited + 1)
                console.log("get summary success");
            }else{
                console.log("get summary failed");
            }
        }).catch((err)=>{
            console.log("get Board Summary error" );
        })
    }
//게시글 첨부파일 목록 불러오기
    const getDetailFiles = async ()=>{
        await axios.post(`${url}/api/get/board/details/files`,{number:props.number}).then((res)=>{
            if(res.data.success){
                setFiles(res.data.data)
                console.log("get detail files success");
            }
        }).catch((err)=>{
            console.log("get Detail Files error");
        })
    }
//file list 
const getFileList = (Files:file[])=>{
    const filelist = <>{Files.map((file)=>{return <Box>
        <Box sx={{ml:1 , display:"inline"}} key={file.file_name} component="p" > {file.file_origin_name} - {file.file_size} byte</Box>
        <IconButton >
          <DownloadIcon onClick={(e)=>{ downloadsFile(e,file.file_origin_name,file.file_name,file.file_path)}} />
        </IconButton>
        </Box>})} </>
    return filelist
}
//downloads
const downloadsFile = async (e:any,file_origin_name:string,file_name:string,file_path:string)=>{
    e.preventDefault()
    const data = {
        file_name:file_name,
        file_path:file_path
    }
    //
    await axios({
        method: 'post',
        url: `${url}/api/post/board/file/downloads`,
        responseType: 'blob',
        data: data
      }).then((res)=>{
        JSFileDownload(res.data,file_origin_name)
        console.log(res);
    })
}
//게시글 조회수 수정
    const addBoardVisited = async ()=>{
        axios.put(`${url}/api/put/board/details/visited`,{number:props.number}).then((res)=>{
            if(res.data.success){
                console.log("add visited success");
            }else{
                console.log("add visited failed");
            }
        }).catch((err)=>{
            console.log("add Board Visited");
        })
    }
// 게시글 수정 
    const handleChangeUpdate = (event:unknown)=>{
        setUpdate(!update)
    }

//시작시 한번
    useEffect(()=>{
        getBoardSummary()
        addBoardVisited()
        getDetailFiles()
    },[update])


    return<>
    {update
        ?<BoardUpdate number={props.number} title={title} user={user} summary={summary} Files={Files} update={update} setUpdate={setUpdate}/>
        :<>

    {/* 게시글 정보 및 내용 */}
        DETAIL 
        <Paper sx={{ mt:10, width: '100%',minHeight:500, minWidth:500 }}>
            <Box sx={{m:2}}>제목:{title}</Box>
            <Box sx={{m:1}}>작성자:{user}</Box>
            <Box sx={{m:1}}>입력날짜:{date}</Box>
            <Box sx={{m:1}}>{(updated === "N")?"":`수정날짜:${updatedDate}` }</Box>
            <Box sx={{m:1}}>조회수:{visited}</Box>
            <Box sx={{m:1}}>내용:{summary}</Box>
        </Paper>
    {/* 첨부된 파일 목록 */}
        <Box sx={{mt:2}}>첨부파일</Box>
        <Paper sx={{ mt:1, width: '100%',minHeight:100, minWidth:500 }}>
            {getFileList(Files)}
        </Paper >
    {/* 수정, 목록 버튼 */}
        <Box sx={{width:'100%', display: 'flex',  flexDirection: 'row-reverse'}}>
            {(userID === user)
                ?<>
                    <Box sx={{m:1}}>
                        <Button onClick={handleChangeUpdate}>UPDATE</Button>
                        <Button onClick={()=>{props.setDetail(!props.detail)}}>BACK</Button>
                    </Box>
                </>
                :<>
                    <Box sx={{m:1}}>
                        <Button onClick={()=>{props.setDetail(!props.detail)}}>BACK</Button>
                    </Box>
                </>
            }
        </Box>
    {/* 게시글의 댓글 */}
        Comment
        <Paper>
            <BoardComment/>
        </Paper>
        
        </>
    }
    </>
}
export default BoardDetail