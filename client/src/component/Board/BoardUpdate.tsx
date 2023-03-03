
import axios from "axios"
import { useCallback, useState } from "react";
//mui
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, IconButton, Paper, TextField } from "@mui/material"

//redux store
import { useSelector} from 'react-redux';
import {RootState} from '../../store/store'
//dir
import AcceptFile from "../Dropzone/AcceptFile";
import ColorButton from "../Button/ColorButton";



interface BoardUpdateProps {
    number:number
    title:string 
    user:string 
    summary:string 
    Files:file[] //첨부된 파일 목록
    update:any  //업데이트창 상태변수
    setUpdate:any
}

interface file {
    file_origin_name:string
    file_name:string
    file_path:string
    file_size:number
}

export function BoardUpdate(props:BoardUpdateProps){
    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const userID = useSelector<RootState,string>(state=>{return state.userId.id})
    const [post_number,setPost_number] = useState<number>(props.number)
    const [newTitle,setNewTitle] = useState<string>(props.title)
    const [newSummary,setNewSummary] = useState<string>(props.summary)
    const [newFiles,setNewFiles] = useState<File[]>([])  //새로 추가한 파일 목록
    const [attachedFiles,setAttachedFiles] = useState<file[]>(props.Files) 
    const [deleteFileList,setDeleteFileList] = useState<file[]>([]) //삭제할 파일 목록

//정보 수정 
    const putBoardDetail = async ()=>{
        if(userID === null)return alert("먼저 로그인을 하세요.")
        if(newTitle==='')return alert("제목을 입력하세요")
        if(newSummary==='')return alert("내용을 입력하세요")

        const formdata = new FormData;
        for(let i = 0; i < newFiles.length;  i++){
          formdata.append("newFiles",newFiles[i])
        }
        formdata.append("post_number",post_number.toLocaleString())
        formdata.append("newTitle",newTitle)
        formdata.append("newSummary",newSummary)

        await axios.put(`${url}/api/put/details`,formdata).then((res)=>{
            if(res.data.success){
                deleteDetailFilse(deleteFileList)//파일삭제리스트의 파일들 삭제  
                console.log("update success");
                props.setUpdate(!props.update)
            }else{
                alert("update 실패")
            }
        }).catch((err)=>{
            console.log(err);
        })
    }

//origin file list 
    const getFileList = (Files:file[])=>{
        const filelist = <>{attachedFiles.map((file)=>{return <Box>
            <Box sx={{ml:1 , display:"inline"}} key={file.file_name} component="p" > {file.file_origin_name} - {file.file_size} byte</Box>
            <IconButton >
            <CancelIcon onClick={()=>{
                let list1 = attachedFiles.filter((f)=>{return f.file_origin_name !== file.file_origin_name});
                setAttachedFiles(list1);
                setDeleteFileList([file,...deleteFileList])
                }} />
            </IconButton>
            </Box>})} </>
        return filelist
    }
//new file list
    const getNewFileList = ()=>{
        const FileList = <> {newFiles.map((file)=>{return <Box><Box component="p" sx={{ml:1 ,display:"inline"}} key={file.name}>{file.name} - {file.size} bytes</Box>
            <IconButton >
                <CancelIcon onClick={()=>{
                    let list = newFiles.filter((f)=>{return f.name !== file.name});
                    setNewFiles(list);
                    }} />
            </IconButton>
            </Box>})}
            </>
        return FileList
    } 
//delete origin files
    const deleteDetailFilse = async (deleteFileList:file[])=>{

        const data ={
            post_number :props.number,
            deleteFileList:deleteFileList
        }
        await axios.delete(`${url}/api/delete/details/files`,{data}).then((res)=>{
            if(res.data.success){
                console.log("success");
            }
        }).catch((err)=>{
            console.log("delete Detail Filse error");
        })
    }

    const handleChangeNewTitle = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setNewTitle(e.target.value)
    }
    const handleChangeNewSummary = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setNewSummary(e.target.value)
    }

    const onDrop = useCallback((acceptedFiles:File[]) => {
      setNewFiles((prevState)=>[...prevState,...acceptedFiles])
    }, []);


      
    return<>
    Update
    <Paper sx={{ mt:10, width: '100%',height:'100%',minHeight:500, minWidth:500 }}>
            <Box component="form" sx={{display: 'flex',flexDirection: 'column',alignItems:"center" }}>
                <Box sx={{width:'90%', mt:5}}>
                    <TextField defaultValue={props.title} onChange={handleChangeNewTitle} fullWidth id="filled-basic" label="Title" variant="filled"/>
                </Box>

                <AcceptFile  onDrop={onDrop} accept={"image/*,.pdf,.txt,.hwp,.xlsm,.xls"} />
                <Box sx={{width:'90%'}}>
                    {getFileList(attachedFiles)}
                    {getNewFileList()}
                </Box>
                <Box sx={{width:'90%'}}>
                    <TextField defaultValue={props.summary} onChange={handleChangeNewSummary} fullWidth id="filled-basic" label="Summary" variant="filled" multiline minRows={20} maxRows={20}/>
                </Box>

                <Box sx={{width:'90%', display: 'flex',  flexDirection: 'row-reverse'}}>
                    <Box sx={{m:1}}>
                        <ColorButton variant="contained" startIcon={<CancelIcon/>} onClick={()=>{props.setUpdate(!props.update)}}>
                            Cancel
                        </ColorButton>
                    </Box>
                    <Box sx={{m:1}}>
                        <Button variant="contained" startIcon={<SaveIcon/>} onClick={putBoardDetail}>
                            Save
                        </Button>
                    </Box>
                </Box>


            </Box>
        </Paper>
    </>
}
export default BoardUpdate