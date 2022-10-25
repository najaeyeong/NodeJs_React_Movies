import { useEffect, useState} from "react"
import Axios from 'axios'
import styles from '../routers/css/ReviewForm.module.css'
interface movieData{ID:number,movieName:string,movieReview:string}
type CardProps= {
    value:movieData,
}

export default function Card(props:CardProps){
    const [newReview,setNewReview] = useState('')
    const [value,setValue] = useState(props.value)
    useEffect(()=>{
        setValue(props.value)
    },[props.value])


    const updateReview = (ID:number,newReview:string):any=> { 
        if(!newReview)return alert('리뷰를 입력하세요')
        Axios.put(`http://localhost:3001/api/update`,{ID:ID,newReview:newReview})
        .then((res)=>{
            console.log(res.data)
          if(res.data.success){
            // eslint-disable-next-line array-callback-return
            // const newList = movieList.map(val=>{if(val.ID === ID){val.movieReview = newReview} return val})
            // setMovieList(newList)
            setValue({ID:value.ID,movieName:value.movieName,movieReview:newReview})
            setNewReview('')
            alert(res.data.message)
          }else{
            alert(res.data.message);
          }
        }).catch(()=>{
          setNewReview('')
          alert('update error 관리자에 문의')
        })
      }

    return(

        <>
            <h1>movie: {value.movieName}</h1>
            <p>review: {value.movieReview}</p>
            <input 
            type="text" 
            placeholder='review' 
            className={styles.reviewUpdate}
            value={newReview}
            onChange={(e)=>{setNewReview(e.target.value)}}>
            </input>
            <button onClick={()=>updateReview(value.ID,newReview)}>Update</button>
        </> )

}


