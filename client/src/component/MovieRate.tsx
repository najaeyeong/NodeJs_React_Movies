import {useState,useEffect } from "react";
import Axios from 'axios'

//mui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { IconButton } from "@mui/material";





interface MovieRateProps{
    movieID:number,
    visitCount:number
}


export function MovieRate(props:MovieRateProps){
    interface Rate {like_count:number ,hate_count:number }
    interface ConfirmUserRate{rateID:number,rate:string}

    const [movieRate,setMovieRate]= useState<Rate[]>([])
    const [userID,setUserID] = useState(sessionStorage.getItem("user_id"))
    const [movieID] = useState(props.movieID)
    const [likeCount,setLikeCount] = useState<number>(0)
    const [hateCount,setHateCount] = useState<number>(0)
    const [visitCount,setVisitCount] = useState<number>(props.visitCount)
    const [rated,setRated] = useState<boolean>(false)
    const [like,setLike] = useState<boolean>()
    const [userRate,setUserRate] = useState<ConfirmUserRate[]>([])


    const getMovieRate = async ()=>{
        await Axios.post(`http://localhost:3001/api/movie/rate`,{movieID:movieID}).then((res)=>{
            if(res.data.success){
             setMovieRate(res.data.data)        
            }else{
              alert('data load fail')
            }
        })
    }

    const Confirm_user = async ()=>{

        await Axios.post('http://localhost:3001/api/movie/rate/confirmuser',{userID:userID,movieID:movieID}).then((res)=>{
            if(res.data.success){
                setUserRate(res.data.data)
            }else{

                console.log("confirm_user error")
            }
        })
    }

    useEffect(()=>{
        if(userRate[0]){
            setRated(true)
            if(userRate[0].rate === "like"){
                setLike(true)
            }else if(userRate[0].rate === "hate"){
                setLike(false)
            }
        }else{
            setRated(false)
        }

    },[userRate])


    const CreateMovieRate = async (rate:string)=>{
        if(sessionStorage.getItem("user_id") === null)return alert('먼저 로그인을 하세요.')
        await Axios.post('http://localhost:3001/api/movie/rate/insert',{userID:userID, movieID:movieID, rate:rate}).then((res)=>{
            if(res.data.success){
                setRated(true); 
                if(rate === "like"){
                    setLike(true)
                    setLikeCount(likeCount+1)
                }else if(rate === "hate"){
                    setLike(false)
                    setHateCount(hateCount+1)
                }
            }
        }).catch(()=>{
            alert('rate create error')
            }    
        )
    }

    const UpdateMovieRate = async (rate:string)=>{
        if(sessionStorage.getItem("user_id")===null)return alert('먼저 로그인을 하세요.')
        await Axios.put('http://localhost:3001/api/movie/rate/update',{userID:userID,movieID:movieID,rate:rate}).then((res)=>{
            if(res.data.success){
                if(rate==="like"){
                    setLike(true)
                    setLikeCount(likeCount+1)
                    setHateCount(hateCount-1)
                }else if(rate === "hate"){
                    setLike(false)
                    setLikeCount(likeCount-1)
                    setHateCount(hateCount+1)
                }
            }
        }).catch(()=>{
            alert('rate update error')
            }    
        )
    }


    //Axios.delete에 params (/:id)가 아니라 body 에 넣어서 보내고 싶을때 {data:{}} 사용 , 서버에서 req.body{} 사용해서 꺼내서 사용가능  
    const DeleteMovieRate = async (like:boolean)=>{
        if(sessionStorage.getItem("user_id")===null)return alert('먼저 로그인을 하세요.')
        await Axios.delete(`http://localhost:3001/api/movie/rate/delete/`,{data:{userID:userID,movieID:movieID}}).then((res)=>{
            if(res.data.success){
                if(like){
                    setLikeCount(likeCount-1)
                    setRated(false)
                }else{
                    setHateCount(hateCount -1)
                    setRated(false)
                }
            }
        }).catch(()=>{
            alert('rate delete error')
            }    
        )
    }



    

    useEffect(()=>{
        getMovieRate()
        Confirm_user()
    },[userID])

    useEffect(()=>{
        setLikeCount(movieRate[0]?.like_count)
        setHateCount(movieRate[0]?.hate_count)
    },[movieRate])

    //읽어오기 전에 비동기로 먼저 실행시켜서 undefined라 에러가 발생할경우   value?.date  같이 ? 활용  또는 loading state 활용 

    return<>
    <>
        {rated ? <>
                    {like?  <>
                            <IconButton sx={{color:"black"}} onClick={()=>{DeleteMovieRate(true)}}>
                                <ThumbUpIcon sx={{color:"black"}}/> {likeCount}
                            </IconButton>
                            <IconButton sx={{color:"black"}} onClick={()=>{UpdateMovieRate("hate")}}>
                                <ThumbDownOffAltIcon sx={{color:"black"}}/>     {hateCount}
                            </IconButton>
                            </> 
                    
                    :   <>
                        <IconButton sx={{color:"black"}} onClick={()=>{UpdateMovieRate("like")}}>
                            <ThumbUpOffAltIcon sx={{color:"black"}}/>    {likeCount}   
                        </IconButton>
                        <IconButton sx={{color:"black"}} onClick={()=>{DeleteMovieRate(false)}}>
                            <ThumbDownAltIcon sx={{color:"black"}}/>     {hateCount}
                        </IconButton>
                        </>
                    }
                </>
            :<>
                <IconButton sx={{color:"black"}} onClick={()=>{CreateMovieRate("like")}}>
                    <ThumbUpOffAltIcon sx={{color:"black"}}/>    {likeCount}   
                </IconButton>
                <IconButton sx={{color:"black"}} onClick={()=>{CreateMovieRate("hate")}}>
                    <ThumbDownOffAltIcon sx={{color:"black"}}/>    {hateCount}
                </IconButton>
            </>
        }
        

    </>


    </>


}