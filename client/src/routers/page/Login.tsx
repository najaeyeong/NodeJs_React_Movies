import styles from "../css/Register.module.css"
import React,{useState} from "react"
import axios from 'axios'

export default function Login(){
    const [id,setId] = useState("")
    const [psword,setPsword] = useState('')

    const LoginSubmit = ()=>{
        if(!id){return alert("id를 입력하세요.")}
        if(!psword){return alert("password를 입력하세요.")}
        const req = {
                id : id,
                psword : psword
            }
        axios.post(`http://localhost:3001/api/login`,req).then((res)=>{
            if(res.data.success){
                sessionStorage.setItem('user_id',id )
                window.location.replace("/home/movie")
            }else{
                alert(res.data.message)
            }
        }).catch(err=>{
            console.log(err)
            alert("알수 없는 error 관리자에게 문의 : login")
        })
    }

    return <>
        <div className={styles.login_page}>
            <div className={styles.form}>
                <form className={styles.login_form}>
                    <input id="id" type="text" placeholder="id" value = {id} onChange={
                        (e)=>{setId(e.target.value)}
                    }/>
                    <input id="psword" type="password" placeholder="password" value={psword} onChange={
                        (e)=>{setPsword(e.target.value)}
                    }/>
                    <p id={styles.button} onClick={LoginSubmit}>login</p>
                    <p className={styles.message}>Not registered? <a href="/register">Create an account</a></p>
                </form>
            </div>
        </div>
    </>
}