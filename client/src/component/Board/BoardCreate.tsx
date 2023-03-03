import  {useCallback, useEffect, useState}from 'react';
import axios from 'axios';

//mui
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Fab, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

//DIR
import AcceptFile from '../Dropzone/AcceptFile'
import ColorButton from "../Button/ColorButton";
//redux store
import { useSelector} from 'react-redux';
import {RootState} from '../../store/store'

//fortAweSomeIcon
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'


interface BoardCreateProps {
  create:any,
  setCreate:any
}

export function BoardCreate(props:BoardCreateProps){
    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const userID = useSelector<RootState,string>(state=>{return state.userId.id})
    const [title,setTitle] = useState<string>('')
    const [summary,setSummary] = useState<string>('')
    const [Files,setFiles] = useState<File[]>([])

    const handleChangeTitle = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setTitle(e.target.value)
    }
    const handleChangeSummary = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setSummary(e.target.value)
    }

    const onDrop = useCallback((acceptedFiles:File[]) => {
      setFiles((prevState)=>[...prevState,...acceptedFiles])
    }, []);

    const getFileList = ()=>{
      const FileList = <> {Files.map((file)=>{return <Box><Box component="p" sx={{display:"inline"}} key={file.name}>{file.name} - {file.size} bytes</Box>
          <IconButton >
              <CancelIcon onClick={()=>{
                  let list = Files.filter((f)=>{return f.name !== file.name});
                  setFiles(list);
                  }} />
          </IconButton>
          </Box>})}
          </>
      return FileList
    } 

    const save = async ()=>{
      if(userID === null)return alert("먼저 로그인 하세요")
      if(title === '')return alert("제목을 입력하세요.")
      if(summary === '')return alert("내용을 입력하세요.")
      const formdata = new FormData;
      for(let i = 0; i < Files.length;  i++){
        formdata.append("files",Files[i])
      }
      formdata.append("userID",userID)
      formdata.append("title",title)
      formdata.append("summary",summary)
      const config = {
        header: { "content-type": "multipart/form-data" },
      };
      await axios.post(`${url}/api/post/board/details`,formdata).then(async(res)=>{
        if(res.data.success){
          alert("upload success")
          setTitle('')
          setFiles([])
          setSummary('')
          props.setCreate(!props.create)
        }else{
          console.log("게시글 업로드 failed");
        }
        
      }).catch((err)=>{
        console.log("게시글 업로드 error");
      })
    }
//뒤로가기 막기 
    useEffect(() => {
      const preventGoBack = () => {
        // change start
        window.history.pushState(null, '', window.location.href);
        // change end
        console.log('prevent go back!');
      };
      
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', preventGoBack);
      
      return () => window.removeEventListener('popstate', preventGoBack);
    }, []);

    return<>
        <Paper sx={{ mt:10, width: '100%',height:'100%',minHeight:500, minWidth:500 }}>
            <Box component="form" sx={{display: 'flex',flexDirection: 'column',alignItems:"center" }}>
                <Box sx={{width:'90%', mt:5}}>
                    <TextField onChange={handleChangeTitle} fullWidth id="filled-basic" label="Title" variant="filled"/>
                </Box>

                <AcceptFile  onDrop={onDrop} accept={"image/*,.pdf,.txt,.hwp,.xlsm,.xls"} />
                <Box sx={{width:'90%'}}>
                  {getFileList()}
                </Box>
                <Box sx={{width:'90%'}}>
                    <TextField onChange={handleChangeSummary} fullWidth id="filled-basic" label="Summary" variant="filled" multiline minRows={20} maxRows={20}/>
                </Box>

                <Box sx={{width:'90%', display: 'flex',  flexDirection: 'row-reverse'}}>
                    <Box sx={{m:1}}>
                        <ColorButton variant="contained" startIcon={<CancelIcon/>} onClick={()=>{props.setCreate(!props.create)}}>
                            Cancel
                        </ColorButton>
                    </Box>
                    <Box sx={{m:1}}>
                        <Button variant="contained" startIcon={<SaveIcon/>} onClick={save}>
                            Save
                        </Button>
                    </Box>
                </Box>


            </Box>
        </Paper>
          </>
}
export default BoardCreate

