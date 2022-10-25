import React, { useState } from 'react';
import styles from "../css/Register.module.css"
import axios from 'axios';



export default function Register(){
    const [id, setId] = useState('')
    const [name,setName] = useState('')
    const [psword , setPsword] = useState('')
    const [confirm_psword,setConfirm_psword] = useState('')

    const register_submit = ()=>{
        if(!id) return alert('id error id없음');
        if(!psword) return alert('password 입력');
        if(psword !== confirm_psword) return alert('password error 비밀번호 확인');
        const req ={
            id: id,
            psword: psword,
            name: name,
        };
        axios.post(`http://localhost:3001/api/register`,req)
        .then((res)=>{
            console.log(res.data)
            if(res.data.success){
                alert(res.data.message)
                window.location.replace("/login")    //window.location.href="/login"  은 뒤로가기 가능 
            }else{
                alert(res.data.message);
            }
        })
        .catch(err =>{
            console.log(err)
            alert("알수없는 error 관리자에 문의: register ");
        })
    }

    return <>
            <div className={styles.login_page}>
                    <form className={styles.form}>
                        <input id ='id' type="text" placeholder="id" value={id} onChange={
                            (e)=>{setId(e.target.value)}}/>
                        <input id="name" type="text" placeholder="name" value={name} onChange={
                            (e)=>{setName(e.target.value)}}/>
                        <input id='psword' type="password" placeholder="password" value={psword} onChange={
                            (e)=>{setPsword(e.target.value)}}/>
                        <input id='confirm-psword'type="password" placeholder="confirm-password" value={confirm_psword} onChange={
                            (e)=>{setConfirm_psword(e.target.value)}}/>
                        <p id={styles.button} onClick={register_submit}>SIGN UP</p>
                        <p className={styles.message}>not registered? <a href="/login">login</a></p>
                    </form>
            </div>
        </>  
}