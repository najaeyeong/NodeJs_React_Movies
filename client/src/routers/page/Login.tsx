import styles from "../css/Register.module.css"
import {useState} from "react"
import axios from 'axios'
import CryptoJS from 'crypto-js'

//mui
import Box from '@mui/material/Box';

//redux store
import {useSelector} from "react-redux"
import {RootState} from '../../store/store'


export default function Login(){


    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const [id,setId] = useState("")
    const [psword,setPsword] = useState('')

//비밀번호 hash 
    const hashPW = (psword:string,salt:string)=>{
        const iterations = 3280; // 3280번 hash반복
        const password = CryptoJS.PBKDF2(psword, CryptoJS.enc.Hex.parse(salt), {
            // keySize: 128 / 32,
            // keySize: 256 / 32,
            keySize: 512 / 32,
            iterations,
          });
        const hashPW = password.toString(CryptoJS.enc.Base64)
        return hashPW
    }

//토큰 발급
    const getToken = async()=>{
        await axios.post(`${url}/api/get/token`,{id:id}).then((res)=>{
            if(res.data.success){
                window.location.replace("/home/movie");
            }else{
                alert("토큰발급 error 관리자에 문의");
            }
        }).catch((err)=>{
            console.log("토큰발급 error 관리자에 문의");
        })
    }


//로그인 정보 조회 
    const LoginSubmit = async ()=>{    
        if(!id){return alert("id를 입력하세요.")}
        if(!psword){return alert("password를 입력하세요.")}

        await axios.post(`${url}/api/get/salt`,{id:id}).then(async (res)=>{
            if(res.data.success){
                const salt = res.data.data.salt
                const serverHashedPw = res.data.data.psword
                const hashedPW = hashPW(psword,salt)
                //hash값 비교 
                if(hashedPW === serverHashedPw){
                    //토큰발급
                    getToken()
                //비번틀림
                }else{
                    alert("비밀번호가 틀렸습니다.")
                }
            }else{
                alert(res.data.message)
            }
        }).catch(err=>{
            //console.log(err);
            alert(`${err} 알수 없는 error 관리자에게 문의 : login`)
        })
    }

    return <>
    
        <div className={styles.login_page}>
            <div className={styles.form}>
                <form className={styles.login_form}>
                    <input id="id" type="text" placeholder="id" value = {id} onChange={
                        (e)=>{setId(e.target.value)}
                    }/>
                    <Box sx={{ml:2, mb:2}}></Box>
                    <input id="psword" type="password" placeholder="password" value={psword} onChange={
                        (e)=>{setPsword(e.target.value)}
                    }/>
                    <Box sx={{ml:2, mb:2}} ></Box>
                    <p id={styles.button}  onClick={LoginSubmit}>login</p>
                    <p className={styles.message}>Not registered? <a href="/register">Create an account</a></p>
                </form>
            </div>
        </div>
    
    </>
}