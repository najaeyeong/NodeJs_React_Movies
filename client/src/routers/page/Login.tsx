import styles from "../css/Register.module.css"
import {useState} from "react"
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { useLocation } from 'react-router-dom';

//mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';


//redux store
import {useSelector} from "react-redux"
import {RootState} from '../../store/store'
import { Button } from "@mui/material";
import getGoogleUrl from "../../Modules/auth/getGoogleUrl" // google 로그인 인증 url 생성모듈

export default function Login(){

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const [id,setId] = useState("")
    const [psword,setPsword] = useState('')

//Naver Oauth2 로그인 설정 정보
    const naver_callback = process.env.REACT_APP_NAVER_CALLBACK_URI ||''
    const naver_client_id = process.env.REACT_APP_NAVER_CLIENT_ID
    const naver_state = Math.random().toString(36).substr(3, 14);
    let naver_api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + naver_client_id + '&redirect_uri=' + encodeURI(naver_callback) + '&state=' + naver_state;
//google 관련 변수
    // const location = useLocation();
    // let from = ((location.state as any)?.from?.pathname as string) || '/';
    let google_state = Math.random().toString(36).substr(3, 14);
    let google_api_url = getGoogleUrl(google_state)
//kakao 관련 변수 
    const kakao_client_id = process.env.REACT_APP_KAKAO_CLIENT_ID
    const kakao_client_redirect = process.env.REACT_APP_KAKAO_CALLBACK_URI
    let kakao_api_url = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_client_id}&redirect_uri=${kakao_client_redirect}&response_type=code`;

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
                    <Box>
                        <Box sx={{m:1}}> 
                            <Link  href={naver_api_url}><img
                            height= '50'  
                            src={require("../../images/naver_image/btnW_official.png")}
                            onMouseOver={(e)=>{e.currentTarget.src = require("../../images/naver_image/btnD_official.png")}}
                            onMouseOut={(e)=>{e.currentTarget.src = require("../../images/naver_image/btnW_official.png")}}
                            alt="naver"/>
                            </Link>
                        </Box>
                        <Box sx={{m:1}}> 
                            <Button href={kakao_api_url} ><img
                            height= '56'  
                            src={require("../../images/kakao_image/kakao_login.png")}
                            alt="kakao"/>
                            </Button>
                        </Box>
                        <Box sx={{m:1}}> 
                            <Link  href={google_api_url}>
                                <img  id={styles.google}
                                    height='57'
                                    src = { require("../../images/google_image/btn_googleW.png")}
                            onMouseOver={(e)=>{e.currentTarget.src = require("../../images/google_image/btn_googleD.png")}}
                            onMouseOut={(e)=>{e.currentTarget.src = require("../../images/google_image/btn_googleW.png")}}
                            alt="google"/>
                            </Link>
                        </Box>
                    </Box>
                    <p className={styles.message}>Not registered? <a href="/register">Create an account</a></p>

                </form>
            </div>
        </div>
    
    </>
}