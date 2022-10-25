import React, { useEffect, useState } from 'react';
import Axios from 'axios'
import ReviewList from "../../component/ReviewList"
import styles from '../css/ReviewForm.module.css'
import Card from '../../component/card'
import MenuBar from '../../component/MenuBar';

export function ReviewForm(){
  interface movieData{ID:number,movieName:string,movieReview:string}
  const [movieName,setMovieName] = useState('')
  const [movieReview,setMovieReview] = useState('')
  const [movieReviewList,setMovieReviewList] = useState<movieData[]>([])
 
 
  useEffect( ()=>{
     Axios.get(`http://localhost:3001/api/get`).then((res)=>{
      if(res.data.success){
        setMovieReviewList(res.data.data)
      }else{
        alert('data load fail')
      }
    })
  },[]) 

  const submitReview =  ()=>{
    if(movieName === '') return alert('영화제목을 입력하세요')
    if(movieReview === '') return alert('리뷰를 입력하세요') 
     Axios.post(`http://localhost:3001/api/insert`,{
      movieName:movieName,
      movieReview:movieReview
    }).then((res)=>{
      if(res.data.success){
        alert(res.data.message)
        const newMovieList = [...movieReviewList,{
          ID:res.data.data.data , movieName:movieName,movieReview:movieReview
        }]
        setMovieReviewList(newMovieList)
        setMovieName('')
        setMovieReview('')
      }else{
        alert('insert fail')
      }
    }).catch((err)=>{
      console.log(err)
      alert('insert error 관리자에 문의')
    })
  }



  const deleteReview = (ID:number):any => {
    Axios.delete(`http://localhost:3001/api/delete/${ID}`)
    .then((res)=>{alert(res.data.message)})
    .catch(()=>{alert('delete error 관리자에 문의')})
    const newMovieList=movieReviewList.filter((val)=>{return val.ID !== ID});
    setMovieReviewList(newMovieList)
  }

  if(movieReviewList.length === 0){
    return <>
        <MenuBar />
        <div className={styles.App}>
          <h1>CRUD</h1>
          <div className={styles.form}>
            <label>Movie Name</label>
            <input type="text" value={movieName} placeholder='name' onChange={(e)=>{
              setMovieName(e.target.value)
            }}></input>
            <label>Movie Review</label>
            <input type="text" value={movieReview} placeholder='review' onChange={(e)=>{
              setMovieReview(e.target.value)
            }}></input>
            <button onClick={submitReview}>submit</button>
            <p>리뷰가 없습니다.</p>
          </div>
        </div>
      </>
  }else{
    return <>
    <MenuBar />
    <div className={styles.form}>
      <h1>CRUD</h1>
      <label>Movie Name</label>
      <input type="text" value={movieName} placeholder='name' onChange={(e)=>{
        setMovieName(e.target.value)
      }}></input>
      <label>Movie Review</label>
      <input type="text" value={movieReview} placeholder='review' onChange={(e)=>{
        setMovieReview(e.target.value)
      }}></input>
      <button onClick={submitReview}>submit</button>

      {movieReviewList.map((value)=>{
            return (<div key={value.ID} className={styles.card}> 
            <Card value={value} />
            <button onClick={()=>deleteReview(value.ID)}>Delete</button>
            </div>)
        })}
    </div>
  </>
  }
}