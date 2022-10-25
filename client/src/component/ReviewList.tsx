import React, {  useEffect, useState } from 'react';
import Axios from 'axios'
import styles from './css/Movie.module.css'



interface movieData{ID:number,movieName:string,movieReview:string}
type ReviewProps = {
  list:movieData[]
}
//{list}:{list:ReviewProps}
export function ReviewList(props:ReviewProps){
   console.log(1,props.list)
    const [movieList,setMovieList] = useState<movieData[]>(props.list)
    const [newReview, setNewReview] = useState('')
    useEffect(()=>{
      setMovieList(props.list)
    },[props.list])
    // props 를 받아서 state 를 지정하고 변경하여 랜드링 하려면 useEffect 를 사용해서 변경해주어야 한다.
    //안그러면 리랜더링이 안되고 state 값이 변경되지 않는다 .

    const updateReview = (ID:number,newReview:string):any=> { 
        if(!newReview)return alert('리뷰를 입력하세요')
        Axios.put(`http://localhost:3001/api/update`,{ID:ID,newReview:newReview})
        .then((res)=>{
          if(res.data.success){
            // eslint-disable-next-line array-callback-return
            const newList = movieList.map(val=>{if(val.ID === ID){val.movieReview = newReview} return val})
            setMovieList(newList)
            setNewReview('')
            alert(res.data.message)
          }
        }).catch(()=>{
          setNewReview('')
          alert('update error 관리자에 문의')
        })
      }

      console.log(2,movieList)
      
      const deleteReview = (ID:number):any => {
        Axios.delete(`http://localhost:3001/api/delete/${ID}`)
        .then((res)=>{alert(res.data.message)})
        .catch(()=>{alert('delete error 관리자에 문의')})
        const newMovieList=movieList.filter((val)=>{return val.ID !== ID});
        setMovieList(newMovieList)
      }

    return <>
        {movieList.map((value)=>{
            return (<div key={value.ID} className={styles.card}> 
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
            <button onClick={()=>deleteReview(value.ID)}>Delete</button>
            </div>)
        })}
    </>
}

export default ReviewList;