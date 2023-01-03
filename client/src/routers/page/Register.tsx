import React, { useState,useCallback,useEffect,useRef } from 'react';
import styles from "../css/Register.module.css"
import axios from 'axios';
import 'react-phone-number-input/style.css'
import PhoneInput,{ isValidPhoneNumber } from 'react-phone-number-input'

//mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
//redux store
import {useSelector} from "react-redux"
import {RootState} from '../../store/store'

// declare global {
//     interface Window {
//       IMP: any
//     }
//   }


export default function Register(){
    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    //Ref
    const inputId = useRef<HTMLInputElement>(null)
    const inputName = useRef<HTMLInputElement>(null)
    const inputAge = useRef<HTMLInputElement>(null)
    const inputEmail = useRef<HTMLInputElement>(null)
    const inputPhoneNumber = useRef<any>(null)
    const inputPsword = useRef<HTMLInputElement>(null)
    const inputConfirmPsword = useRef<HTMLInputElement>(null)
    const inputRandomNumber = useRef<HTMLInputElement>(null)

    //입력값
    const [id, setId] = useState('')  //아이디 
    const [name,setName] = useState('') //이름
    const [psword , setPsword] = useState('')   //비밀번호 
    const [confirm_psword,setConfirm_psword] = useState('') //비밀번호 확인
    const [age , setAge] = useState('')  //나이
    const [email, setEmail]= useState('')  //이메일 
    const [phonenumber , setPhoneNumber]= useState<string | undefined>('') //전화번호
    const [country,setCountry] = useState()//국가별 번호
    const [randomNumber,setRandomNumber] = useState<number>() //서버에서 생성한 난수 
    const [sms,setSms] = useState('') //사용자가 sms로 받아 입력한 난수  

    //유효성
    const [confirmId,setConfirmId]= useState<boolean>(false)  //아이디 형식 확인 
    const [confirmName,setConfirmName]= useState<boolean>(false) //이름 형식 확인
    const [confirmAge,setConfirmAge]= useState<boolean>(false) //나이 형식 확인 
    const [confirmEmail,setConfirmEmail]= useState<boolean>(false) //이메일 형식 확인 
    const [confirmPsword,setConfirmPsword]= useState<boolean>(false)//비밀번호 형식 확인 
    const [confirmConfimPsword,setConfirmConfirmPsword] = useState<boolean>(false)  //비밀번호 동일 확인 
    const [confirmPhoneNumber,setConfirmPhoneNumber]= useState<boolean>(false) //전화번호 형식
    const [confirmRN,setConfirmRN] = useState<boolean>(false) //문자 발송한 난수와 입력받은 난수의 동일함 확인

    //메세지
    const [messageId,setMessageId] = useState<string>('')
    const [messageName,setMessageName] = useState<string>('')
    const [messageAge,setMessageAge] = useState<string>('')
    const [messageEmail,setMessageEmail] = useState<string>('')
    const [messagePsword,setMessagePsword] = useState<string>('')
    const [messageConfirmPsword,setMessageConfirmPsword] = useState<string>('')
    const [messagePhoneNumber,setMessagePhoneNumber] = useState<string>('')
    const [messageConfirmRN,setMessageConfirmRN] = useState<string>('')//인증문자 난수 확인 결과 메세지 

    //아이디
    const onChangeId = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
                    const idRegax = /^[a-zA-Z0-9]{2,20}$/
                    setId(e.target.value);
                    const str = e.target.value.toLowerCase()
                    if(str.length !== 0 && !idRegax.test(str)){
                        setConfirmId(false)
                        setMessageId("영문, 숫자 2자이상 20자 이하")
                    }else if(str.length === 0 ){
                        setMessageId('')
                    }else{
                        setConfirmId(true)
                        setMessageId("ID success")
                    }
                },[])
    //이름
    const onChangeName = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
                    const nameRegax = /^[가-힣a-zA-Z]{1,30}$/
                    setName(e.target.value);
                    const str = e.target.value.toLowerCase()
                    if(str.length !== 0 && !nameRegax.test(str)){
                        setConfirmName(false)
                        setMessageName("한글,영문 30자 이하")
                    }else if(str.length === 0 ){
                        setMessageName('')
                    }else{
                        setConfirmName(true)
                        setMessageName("Name success")
                    }
                },[])

    //나이
    const onChangeAge = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        const ageRegax = /^[0-9]{1,3}$/
        setAge(e.target.value);
        const str = e.target.value.toLowerCase()
        if(str.length !== 0 && !ageRegax.test(str)){
            setConfirmAge(false)
            setMessageAge("3자리 이하 숫자")
        }else if(str.length === 0 ){
            setMessageAge('')
        }else{
            setConfirmAge(true)
            setMessageAge("Age success")
        }
    },[])
    // 이메일
    const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                    const emailRegex =
                    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
                    const emailCurrent = e.target.value
                    setEmail(emailCurrent)

                    if (emailCurrent.length !== 0 && !emailRegex.test(emailCurrent)) {
                        setMessageEmail('Email 형식이 틀렸습니다.')
                        setConfirmEmail(false)
                    }else if(emailCurrent.length === 0){
                        setMessageEmail('')
                    } else {
                        setMessageEmail('Email success')
                        setConfirmEmail(true)
                    }
                }, [])


    //전화번호
    const onChangePhoneNumber = useCallback((PN:any)=>{
        const phonenumberRegax = /^[0-9]{9,16}$/
        setPhoneNumber(PN);
        const str = PN
        if(str.length !== 0 && isValidPhoneNumber(str)){
            setConfirmPhoneNumber(false)
            setMessagePhoneNumber("유효하지않은 번호입니다.")
        }else if(str.length === 0 ){
            setMessagePhoneNumber('')
        }else{
            setConfirmPhoneNumber(true)
            setMessagePhoneNumber("PhoneNumber success")
        }
        // if(str.length !== 0 && !phonenumberRegax.test(str)){
        //     setConfirmPhoneNumber(false)
        //     setMessagePhoneNumber("9~16자리 숫자 -제외")
        //     // setConfirmRN(false)
        //     // setMessageConfirmRN('')
        // }else if(str.length === 0 ){
        //     setMessagePhoneNumber('')
        //     // setConfirmRN(false)
        //     // setMessageConfirmRN('')
        // }else{
        //     setConfirmPhoneNumber(true)
        //     setMessagePhoneNumber("PhoneNumber success")
        // }
    },[])
  // 📍비밀번호
  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$~;:'"\\\]|/[{}()<>=+_,.%^&*-]).{8,}$/
                    const str = e.target.value
                    setPsword(str)
                    //비번창 형식 상태 메세지 
                    if (str.length !== 0 && !passwordRegex.test(str)) {
                        setMessagePsword('숫자,영문 대소문자,특수문자 8~25자리')
                        setConfirmPsword(false)
                    }else if(str.length === 0 ){
                        setMessagePsword('')
                    } else {
                        setMessagePsword('Password success')
                        setConfirmPsword(true)
                    }
                    //비번 확이 창 상태 메세지 
                    if(str.length !== 0 && str === confirm_psword ){
                        setMessageConfirmPsword('Password confirm success')
                        setConfirmConfirmPsword(true)
                    }else if (confirm_psword.length !== 0 && str !== confirm_psword){
                        setMessageConfirmPsword('Password가 다릅니다.')
                        setConfirmConfirmPsword(false)
                    }
                }, [confirm_psword])

  // 📍비밀번호 확인
  const onChangeConfirmPsword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                    const Current = e.target.value
                    setConfirm_psword(Current)

                    if (Current.length !== 0 && psword !== Current) {
                        setMessageConfirmPsword('Password가 다릅니다.')
                        setConfirmConfirmPsword(false)
                    }else if(Current.length === 0 ){
                        setMessageConfirmPsword('')
                    } else {
                        setMessageConfirmPsword('Password confirm success')
                        setConfirmConfirmPsword(true)
                    }
                },[psword])

    const PhostPhoneNumber = ( async()=>{
        if(!confirmPhoneNumber) return  inputPhoneNumber.current?.focus()
        await axios.post(`${url}/api/phonenumber`,{phonenumber:phonenumber}).then((res)=>{
            if(res.data.success){
                setRandomNumber(res.data.randomnumber)
                console.log(res)
            }else{
                console.log(res)
            }
        }).catch((err)=>{
            console.log('err')
            console.log(err)
        })
    })
    
    //sms - 난수 확인 
    const ConfirmRandomNumber = (()=>{
        if(sms.length !== 0 && Number(sms) === randomNumber){
            setConfirmRN(true)
            setMessageConfirmRN('인증완료')
        }else if (sms.length === 0){
            setConfirmRN(false)
            setMessageConfirmRN('')
        }
        else{
            setConfirmRN(false)
            setMessageConfirmRN('인증실패')
        }
    })



    const register_submit = ()=>{
        //빈칸 알림
        if(!id) return alert('id error id없음');
        if(!psword) return alert('password 입력');
        if(!name) return alert('name을 입력하세요');
        if(!age) return alert('age을 입력하세요');
        if(!email) return alert('email을 입력하세요');
        if(!phonenumber) return alert('phonenumber을 입력하세요');
        if(psword !== confirm_psword) return alert('password error 비밀번호 확인');
        //수정할 부분에 focus
        if(!confirmConfimPsword) return inputConfirmPsword.current?.focus()
        if(!confirmPsword) return inputPsword.current?.focus()
        if(!confirmPhoneNumber) return inputPhoneNumber.current?.focus()
        if(!confirmEmail) return inputEmail.current?.focus()
        if(!confirmAge) return inputAge.current?.focus()
        if(!confirmName) return inputName.current?.focus()
        if(!confirmId) return inputId.current?.focus()
        if(!confirmRN) return inputRandomNumber.current?.focus()
        const req ={
            id: id,
            psword: psword,
            name: name,
            age: age,
            email:email,
            phonenumber:phonenumber
        };
        axios.post(`${url}/api/register`,req)
        .then((res)=>{
            console.log(res.data)
            if(res.data.success){
                alert(res.data.message)
                window.location.replace("/login")    //window.location.href="/login"  은 뒤로가기 가능 
            }else{
                console.log(res)
                alert(res.data.message);
            }
        })
        .catch(err =>{
            console.log(err)
            alert("알수없는 error 관리자에 문의: register ");
        })
    }


    useEffect(()=>{
        const str = phonenumber
        if(str !== undefined){
            if(str?.length !== 0 && !isValidPhoneNumber(str)){
                setConfirmPhoneNumber(false)
                setMessagePhoneNumber("유효하지않은 번호입니다.")
                setConfirmRN(false)
                setMessageConfirmRN('')
            }else if(str?.length === 0 ){
                setMessagePhoneNumber('')
                setConfirmRN(false)
                setMessageConfirmRN('')
            }else{
                setConfirmPhoneNumber(true)
                setMessagePhoneNumber("PhoneNumber success")
            }
        }
    },[phonenumber])

    return <>
            <div className={styles.login_page}>
                    <form className={styles.form}>

                        {/* ID */}
                        <input id='id' ref={inputId} type="text" placeholder="id" value={id} onChange={(e)=>{onChangeId(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmId ? "green" :"red"} textAlign="start" >{messageId}</Box>

                        {/* Name */}
                        <input id="name" ref={inputName} type="text" placeholder="name" value={name} onChange={(e)=>{onChangeName(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmName ? "green" :"red"} textAlign="start" >{messageName}</Box>

                        {/* Age */}
                        <input id="age" ref={inputAge} type="text" placeholder="age" value={age} onChange={(e)=>{onChangeAge(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmAge ? "green" :"red"} textAlign="start" >{messageAge}</Box>

                        {/* Email */}
                        <input id="email" ref={inputEmail} type="text" placeholder="email" value={email} onChange={(e)=>{onChangeEmail(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmEmail ? "green" :"red"} textAlign="start" >{messageEmail}</Box> 

                        {/* PhoneNumber */}
                        <PhoneInput
                        defaultCountry="KR"
                        ref={inputPhoneNumber}
                        placeholder="Enter phone number"
                        value={phonenumber}
                        onChange={setPhoneNumber}/>{phonenumber}
                        {/* <input id="phonenumber" ref={inputPhoneNumber} type="text" placeholder="phonenumber" value={phonenumber} onChange={
                            (e)=>{onChangePhoneNumber(e)}}/> */}
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmPhoneNumber ? "green" :"red"} textAlign="start" >{messagePhoneNumber}</Box>
                        <Button onClick={()=>{PhostPhoneNumber()}}>인증번호요청</Button>
                        {/* 인증번호 */}
                        <input id="confirmPhoneNumber" ref={inputRandomNumber} type="text" placeholder="인증번호" value={sms} onChange={
                            (e)=>{setSms(e.target.value)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmRN? "green" :"red"} textAlign="start" >{messageConfirmRN}</Box>
                        <Button onClick={()=>{ConfirmRandomNumber()}}>인증</Button>
                        {/* Psword */}
                        <input id='psword' ref={inputPsword} type="password" placeholder="password" value={psword} onChange={(e)=>{onChangePassword(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmPsword ? "green" :"red"} textAlign="start" >{messagePsword}</Box>

                        {/* ConfirmPsword */}
                        <input id='confirm-psword' ref={inputConfirmPsword} type="password" placeholder="confirm-password" value={confirm_psword} onChange={
                            (e)=>{onChangeConfirmPsword(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmConfimPsword ? "green" :"red"} textAlign="start" >{messageConfirmPsword}</Box>

                        <p id={styles.button} onClick={register_submit}>SIGN UP</p>
                        <p className={styles.message}>not registered? <a href="/login">login</a></p>
                    </form>
            </div>
        </>  
}