import {useState } from "react";
import styles from '../routers/css/ReviewForm.module.css'
import Axios from 'axios'

//mui
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create'; 
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';


interface MovieReviewProps{
    movieID:any,reviewID:any,userID:string|null,movieReview:string,date:Date,updated:string
}


export function MovieReview(props:MovieReviewProps){
    const [movieID,setMovieID] = useState(props.movieID)
    const [userID,setUserID] = useState(props.userID)
    const [reviewID,setReviewID] = useState(props.reviewID)
    const [movieReview,setMovieReview] = useState(props.movieReview)
    const [date,setDate]=useState(props.date)
    const [update_textbox,setUpdate_textbox] = useState(false)
    const [loginID,setLoginID]= useState(sessionStorage.getItem("user_id"))
    const [newReview, setNewReview] = useState('')
    const [IsDeleted,setIsDeleted] = useState<boolean>(false)
    const [updated,setUpdated] = useState<string>(props.updated) //수정여부


    const deleteReview = (ID:number):any => {
        Axios.delete(`http://localhost:3001/api/delete/${ID}`)
        .then((res)=>{alert(res.data.message)})
        .catch(()=>{alert('delete error 관리자에 문의')})
        // const newMovieList=movieReviewList.filter((val)=>{return val.ID !== ID});
        // setMovieReviewList(newMovieList)
    }

    const updateReview = (ID:number,newReview:string):any=> { 
      if(!newReview)return alert('리뷰를 입력하세요')
      Axios.put(`http://localhost:3001/api/update`,{ID:ID,newReview:newReview})
      .then((res)=>{
        if(res.data.success){
        //   const newList = movieReviewList.map(val=>{if(val.ID === ID){val.movieReview = newReview} return val})
        //   setMovieReviewList(newList)
            setMovieReview(newReview)
            setNewReview('')
            setUpdated('y')
            alert(res.data.message)
        }
      }).catch(()=>{
        setNewReview('')
        alert('update error 관리자에 문의')
      })
    }
    // <div key={reviewID} className={styles.card}>
    // <p>{userID} </p>
    // <p>{date.toLocaleString()}</p>

    // <TextField
    // id="outlined-multiline-static"
    // label="Multiline"
    // multiline
    // rows={4}
    // defaultValue="Default Value"
    // />
    // <input type='text' placeholder="review update" onChange={(e)=>{
    //     setNewReview(e.target.value)}}></input>

    return <>
        {(!IsDeleted)? 

                    <Card sx={{ minWidth: 600, minHeight:150, boxShadow: 1, ml:15,mr:15,mb:2,mt:2  }}>
                        <Typography component="div" key={reviewID}>
                            <Box sx={{ textAlign:'left', fontWeight: 'bold', fontSize: 20, ml:3,mb:1,mt:3 }}><AccountCircleIcon sx={{fontSize: 20}}/> <Box sx={{mt:0,display: 'inline'}}>{userID}</Box></Box>
                            <Box sx={{ textAlign:'left', fontWeight: 'light',fontSize: 13, ml: 3 ,mb:2}}><QueryBuilderIcon sx={{ fontSize: 13,mr:0.5 }} />{date.toLocaleString()} </Box>
                            {(updated === 'y')?<Box sx={{ textAlign:'left', fontWeight: 'light',fontSize: 9, ml: 3 }}>(수정됨)</Box> : <></>}
                            {(update_textbox)? <></>
                            :
                                <Box sx={{ textAlign:'left', fontWeight: 'Medium',fontSize:16,  ml:3,mr:3 ,mb:3, minWidth:400,wordWrap: "break-word" } }>{movieReview}</Box>
                            }
                        </Typography>
                        
                        {(userID === loginID ) ?  
                            <>
                            {(update_textbox) ? 
                                                <>
                                                <TextField
                                                sx={{ minWidth: 400}}
                                                id="filled-multiline-flexible"
                                                label="Review"
                                                fullWidth
                                                multiline
                                                maxRows={800}
                                                value={newReview}
                                                onChange={(e)=>{
                                                    setNewReview(e.target.value)}}
                                                variant="filled"
                                                />
                                                <Box sx={{ textAlign:'right', fontWeight: 'Medium', mr:5,mb:2}}>
                                                <IconButton aria-label="save" onClick={()=>{
                                                            updateReview(parseInt(reviewID),newReview);
                                                            setUpdate_textbox(false)
                                                            }}>
                                                <SaveIcon/>
                                                </IconButton>
                                                <IconButton aria-label="cancle" onClick={()=>{setUpdate_textbox(false)}}>
                                                <CancelIcon/>
                                                </IconButton>
                                                </Box>
                                                </>
                            :   <Box sx={{ textAlign:'right', fontWeight: 'Medium', mr:5,mb:2}}>
                                <IconButton aria-label="update"  onClick={()=>{setUpdate_textbox(true);setNewReview(movieReview)}}>
                                <CreateIcon/>
                                </IconButton>
                                <IconButton aria-label="delete" onClick={()=>{deleteReview(reviewID);setIsDeleted(true)}}>
                                <DeleteIcon />
                                </IconButton>
                                </Box>}
                            </>
                            :<></>}

                    
                    
                    </Card>
                    :<></>}

    </>
}