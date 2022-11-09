import styles from "../css/Register.module.css"
import {useState} from "react"
import axios from 'axios'


//redux store
import {useSelector,useDispatch} from "react-redux"
import {RootState} from '../../store/store'
import userIdSlice from "../../store/userIdSlice"




export default function Login(){
    //sessionStorage.removeItem('user_id')

    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    //const url = "https://movietest2.herokuapp.com"
    const [id,setId] = useState("")
    const [psword,setPsword] = useState('')

    //const UserId =  useSelector<RootState,string>((state)=>{return state.userId.Id})
    // console.log(UserId)
    const dispatch= useDispatch();

    const LoginSubmit = async ()=>{
        
        if(!id){return alert("id를 입력하세요.")}
        if(!psword){return alert("password를 입력하세요.")}
        const req = {
                id : id,
                psword : psword
            }
        await axios.post(`${url}/api/login`,req).then((res)=>{
            if(res.data.success){
                dispatch(userIdSlice.actions.login(id));
                //sessionStorage.setItem('user_id',id );
                window.location.replace("/home/movie"); //새로고침 이동
                //window.location.href='/home/movie'
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
                    <button id={styles.button}  onClick={()=>{LoginSubmit()}}>login</button>
                    <p className={styles.message}>Not registered? <a href="/register">Create an account</a></p>
                </form>
            </div>
        </div>
    
    </>
}