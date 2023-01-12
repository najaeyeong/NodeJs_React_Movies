import React, { useState,useCallback,useEffect,useRef } from 'react';
import styles from "../../routers/css/Register.module.css"
import axios from 'axios';
import 'react-phone-number-input/style.css'
import PhoneInput,{ isValidPhoneNumber } from 'react-phone-number-input'

//암호화
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import CryptoJS from 'crypto-js'
//mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, ToggleButton, ToggleButtonGroup } from '@mui/material';
import TextField from '@mui/material/TextField';
//redux store
import {useSelector} from "react-redux"
import {RootState} from '../../store/store'
import { rejects } from 'assert';


// declare global {
//     interface Window {
//       IMP: any
//     }
//   }


export default function UserInfoInput(){
    const url = useSelector<RootState,string>(state=>{return state.serverUrl.url})
    const personalAgree = (useSelector<RootState,boolean>(state=>{return state.agreement.personalinfo})).toString()
    const locationAgree = (useSelector<RootState,boolean>(state=>{return state.agreement.locationinfo})).toString()
    const receiveAgree = (useSelector<RootState,boolean>(state=>{return state.agreement.receive})).toString()
    const monthlist = [1,2,3,4,5,6,7,8,9,10,11,12]
    //Ref
    const inputId = useRef<HTMLInputElement>(null)
    const inputName = useRef<HTMLInputElement>(null)
    const inputYear = useRef<HTMLInputElement>(null)
    const inputDay = useRef<HTMLInputElement>(null)
    //const inputAge = useRef<HTMLInputElement>(null)
    const inputEmail = useRef<HTMLInputElement>(null)
    const inputPhoneNumber = useRef<any>(null)
    const inputPsword = useRef<HTMLInputElement>(null)
    const inputConfirmPsword = useRef<HTMLInputElement>(null)
    const inputRandomNumber = useRef<HTMLInputElement>(null)

    //입력값
    const [id, setId] = useState('')  //아이디 
    const [name,setName] = useState('') //이름
    const [gender,setGender] = useState('')//성별
    const [psword , setPsword] = useState('')   //비밀번호 
    const [confirm_psword,setConfirm_psword] = useState('') //비밀번호 확인
    const [year,setYear] = useState('') //년
    const [month,setMonth]= useState('')//월
    const [day,setDay] = useState('')//일
    const [nationality,setNationality] = useState('') //외국인
    //const [age , setAge] = useState('')  //나이
    const [email, setEmail]= useState('')  //이메일 
    const [phonenumber , setPhoneNumber]= useState<string | undefined>('') //전화번호
    const [randomNumber,setRandomNumber] = useState<number>() //서버에서 생성한 난수 
    const [sms,setSms] = useState('') //사용자가 sms로 받아 입력한 난수  
    const [birthDay,setBirthday] = useState('') //생년월일 문자열 합성을 위해 사용  (일)
    const [birthMonth,setBirthMonth] = useState("") //생년월일 문자열 합성을 위해 사용 (월)

    //유효성
    const [confirmId,setConfirmId]= useState<boolean>(false)  //아이디 형식 확인 
    const [confirmName,setConfirmName]= useState<boolean>(false) //이름 형식 확인
    const [confirmBirthdate,setConfirmBirthdate] = useState<boolean>(false)//생년월일 확인
    //const [confirmAge,setConfirmAge]= useState<boolean>(false) //나이 형식 확인 
    const [confirmEmail,setConfirmEmail]= useState<boolean>(false) //이메일 형식 확인 
    const [confirmPsword,setConfirmPsword]= useState<boolean>(false)//비밀번호 형식 확인 
    const [confirmConfimPsword,setConfirmConfirmPsword] = useState<boolean>(false)  //비밀번호 동일 확인 
    const [confirmPhoneNumber,setConfirmPhoneNumber]= useState<boolean>(false) //전화번호 형식
    const [confirmRN,setConfirmRN] = useState<boolean>(false) //문자 발송한 난수와 입력받은 난수의 동일함 확인

    //메세지
    const [messageId,setMessageId] = useState<string>('')
    const [messageName,setMessageName] = useState<string>('')
    const [messageBirthdate,setMessageBirthdate] = useState<string>('')
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
    //성별
    const genderHandleChange = (event: SelectChangeEvent) => {
        setGender(event.target.value as string);
      };
    //내국인 외국인
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
      ) => {
        setNationality(newAlignment);
      };
    //생년월일

    //나이
    // const onChangeAge = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
    //     const ageRegax = /^[0-9]{1,3}$/
    //     setAge(e.target.value);
    //     const str = e.target.value.toLowerCase()
    //     if(str.length !== 0 && !ageRegax.test(str)){
    //         setConfirmAge(false)
    //         setMessageAge("3자리 이하 숫자")
    //     }else if(str.length === 0 ){
    //         setMessageAge('')
    //     }else{
    //         setConfirmAge(true)
    //         setMessageAge("Age success")
    //     }
    // },[])
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
                    //비번 동일 확인 창 상태 메세지 
                    if(str.length !== 0 && str === confirm_psword ){//동일
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



//bcryptjs 비밀번호 해쉬 생성
const createHashPwBcryptjs = (password:string)=>{
    //salt 생성
    const salt = bcrypt.genSaltSync(10)
    //hashPW 생성 
    let hashPW = bcrypt.hashSync(password, salt) // hash
    //hash반복 
    for(var i = 0; i < 10; i++){
        hashPW = bcrypt.hashSync(hashPW) // hash
    }
    return {hashPW,salt}
}
//cryptojs 
const createHashPwCryptojs = (psword:string)=>{
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    const iterations = 3280; // 3280번 hash반복
    const password = CryptoJS.PBKDF2(psword, CryptoJS.enc.Hex.parse(salt), {
        // keySize: 128 / 32,
        // keySize: 256 / 32,
        keySize: 512 / 32,
        iterations,
      });
    const hashPW = password.toString(CryptoJS.enc.Base64)
    return {hashPW,salt}
}




// 데이터 전송  
    const register_submit = async ()=>{
        //빈칸 알림
        if(!id) return alert('id error id없음');
        if(!psword) return alert('password 입력');
        if(!name) return alert('name을 입력하세요');
        if(!gender) return alert('성별을 입력하세요.');
        if(!year||!day||!month) return alert("생년월일을 입력하세요.")
        //if(!age) return alert('age을 입력하세요');
        if(!email) return alert('email을 입력하세요');
        if(!phonenumber) return alert('phonenumber을 입력하세요');
        if(psword !== confirm_psword) return alert('password error 비밀번호 확인');
        if(!nationality) return alert("내국인 유무를 표시하시오.")
        //수정할 부분에 focus
        if(!confirmConfimPsword) return inputConfirmPsword.current?.focus()
        if(!confirmPsword) return inputPsword.current?.focus()
        if(!confirmPhoneNumber) return inputPhoneNumber.current?.focus()
        if(!confirmBirthdate) return inputYear.current?.focus()
        if(!confirmEmail) return inputEmail.current?.focus()
        //if(!confirmAge) return inputAge.current?.focus()
        if(!confirmName) return inputName.current?.focus()
        if(!confirmId) return inputId.current?.focus()
        if(!confirmRN) return inputRandomNumber.current?.focus()

        let birthdate:string
        //성별 생년 주민등록번호 조합
        if(nationality === "local"){
            if(gender === "M"){ //남자 
                if(Number(year) > 2000){
                    birthdate = year+birthMonth+birthDay+3
                    console.log(birthdate)
                }else{
                    birthdate = year+birthMonth+birthDay+1
                    console.log(birthdate)
                }
            }else if(gender === "W"){ //여자
                if(Number(year) > 2000){
                    birthdate = year+birthMonth+birthDay+4
                    console.log(birthdate)
                }else{
                    birthdate = year+birthMonth+birthDay+2
                    console.log(birthdate)
                }
            }else{// 성별 없음
                birthdate = year+birthMonth+birthDay+0
                console.log(birthdate)
            }
        }else if(nationality === "foreigner"){
            if(gender === "M"){ //외국남자 
                if(Number(year) > 2000){
                    birthdate = year+birthMonth+birthDay+7
                    console.log(birthdate)
                }else{
                    birthdate = year+birthMonth+birthDay+5
                    console.log(birthdate)
                }
            }else if(gender === "W"){ //외국여자
                if(Number(year) > 2000){
                    birthdate = year+birthMonth+birthDay+8
                    console.log(birthdate)
                }else{
                    birthdate = year+birthMonth+birthDay+6
                    console.log(birthdate)
                }
            }else{// 성별 없음
                birthdate = year+birthMonth+birthDay+9
                console.log(birthdate)
            }
        }else{
            return alert("내국인 유무를 표시하시오.")
        }
        //hash비밀번호 생성
        const { hashPW, salt }= await createHashPwCryptojs(psword)
        const req={
            id: id,
            psword: hashPW,
            salt:salt,
            name: name,
            gender:gender,
            birthdate:birthdate,
            email:email,
            phonenumber:phonenumber,
            personalAgree:personalAgree,
            locationAgree:locationAgree,
            receiveAgree:receiveAgree
        };

        axios.post(`${url}/api/register`,req)
        .then((res)=>{
            if(res.data.success){
                alert(res.data.message)
                window.location.replace("/login")    //window.location.href="/login"  은 뒤로가기 가능 
            }else{
                //console.log(res)
                alert(res.data.message);
            }
        })
        .catch(err =>{
            //console.log(err)
            alert("알수없는 error 관리자에 문의: register ");
        })
    }

    //생년월일 유효성 검사 함수 
    const isBirthDay=(year:number,month:number,day:number)=>{
        var today = new Date(); // 날짜 변수 선언
        var yearNow = today.getFullYear(); // 올해 연도 가져옴
		if (1900 > year || year > yearNow){
			return false;
		}else if(month < 1 || month > 12){
			return false;
		}else if(day < 1 || day > 31){
			return false;
		}else if((month===4 || month===6 || month===9 || month===11) && day===31) {
			return false;
		}else if(month === 2){
			var isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
			if (day>29 || (day===29 && !isleap)) {
				return false;
			}else{
				return true;
			} //end of if (day>29 || (day==29 && !isleap))
		}else{
			return true;
		}
    }

    //생년월일 문자열 (일,월) 작성
    useEffect(()=>{
        if(confirmBirthdate){
            setBirthMonth("0"+month)
            setBirthday("0"+ day)
        }else{
            setBirthMonth("")
            setBirthday("")
        }
    },[confirmBirthdate])

    //생년월일 유효성겁사 
    useEffect(()=>{
        const yearRegax = /^[0-9]{4}$/
        const dayRegax = /^[0-9]{1,2}$/
        if(year !== '' && month !== '' && day !== ''){ //전부입력받았으면 
            if(yearRegax.test(year)&&dayRegax.test(day)){ //숫자로 입력받았으면 
                if(isBirthDay(Number(year),Number(month),Number(day))){//유효성검사
                    setConfirmBirthdate(true)
                    setMessageBirthdate("success")

                }else{
                    setConfirmBirthdate(false)
                    setMessageBirthdate("유효하지않은 생년월일")
                } 
            }else{
                setConfirmBirthdate(false)
                setMessageBirthdate("유효하지않은 생년월일")
            }
        }else{
            setConfirmBirthdate(false)
        }
    },[year,month,day])

    //휴대폰 유효성 검사 
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

                        {/* ID */}
                        <input id='id' ref={inputId} type="text" placeholder="id" value={id} onChange={(e)=>{onChangeId(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmId ? "green" :"red"} textAlign="start" >{messageId}</Box>

                        {/* Name */}
                        <input id="name" ref={inputName} type="text" placeholder="name" value={name} onChange={(e)=>{onChangeName(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmName ? "green" :"red"} textAlign="start" >{messageName}</Box>

                        {/* Gender */}
                        <FormControl sx={{mb:2}} fullWidth>
                            <InputLabel id="gender_label">gender</InputLabel>
                            <Select 
                                variant="filled"
                                size='small'
                                value={gender}
                                labelId="gender_label"
                                label="Gender"
                                onChange={genderHandleChange}
                                >
                                <MenuItem value={"M"}>남자</MenuItem>
                                <MenuItem value={"W"}>여자</MenuItem>
                                <MenuItem value={"N"}>선택안함</MenuItem>
                            </Select>
                        </FormControl>
                        {/* foreigner */}
                        <ToggleButtonGroup
                            color="primary"
                            value={nationality}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                            >
                            <ToggleButton value="local">내국인</ToggleButton>
                            <ToggleButton value="foreigner">외국인</ToggleButton>

                        </ToggleButtonGroup>


                        {/* birthday */}
                        <Box component="span" sx={{ml:2,width:"100%",textAlign:"left",fontSize:"10px",display:"inline-block"}}>Brithday</Box>
                        <FormControl sx={{width:"100%",display:"inline-block"}} fullWidth>
                            {/* year */}
                            <Box component="div" sx={{mr:2,width:"30%",display:"inline-block"}}>
                                <input  id="year" ref={inputYear} type="text" placeholder="Year" value={year} onChange={(e)=>{setYear(e.target.value)}}/>
                            </Box>
                            {/* month */}
                            <FormControl sx={{mr:2, width:"30%"}}>
                                <InputLabel id="month_label">month</InputLabel>
                                <Select
                                    value={month}
                                    variant="filled"
                                    labelId='month_label'
                                    size='small'
                                    onChange={(e)=>{ setMonth(e.target.value)}}>
                                    {monthlist.map((m)=>{return <MenuItem value={m}>{m}월</MenuItem>})}
                                </Select>
                            </FormControl>
                            {/* day */}
                            <Box component="div" sx={{width:"30%",display:"inline-block"}}>
                                <input id="day" ref={inputDay} type="text" placeholder="Day" 
                                    value={day} onChange={(e)=>{setDay(e.target.value)}}/>
                            </Box>
                        </FormControl>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmBirthdate ? "green" :"red"} textAlign="start" >{messageBirthdate}</Box>

                        {/* Email */}
                        <input id="email" ref={inputEmail} type="text" placeholder="email" value={email} onChange={(e)=>{onChangeEmail(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmEmail ? "green" :"red"} textAlign="start" >{messageEmail}</Box> 

                        {/* PhoneNumber */}
                        <PhoneInput
                            defaultCountry="KR"
                            ref={inputPhoneNumber}
                            placeholder="Enter phone number"
                            value={phonenumber}
                            onChange={setPhoneNumber}/>
                        {/* <input id="phonenumber" ref={inputPhoneNumber} type="text" placeholder="phonenumber" value={phonenumber} onChange={
                            (e)=>{onChangePhoneNumber(e)}}/> */}
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmPhoneNumber ? "green" :"red"} textAlign="start" >{messagePhoneNumber}</Box>
                        <Button sx={{mb:1}} onClick={()=>{PhostPhoneNumber()}}>인증번호요청</Button>

                        {/* 인증번호 */}
                        <input id="confirmPhoneNumber" ref={inputRandomNumber} type="text" placeholder="인증번호" value={sms} onChange={
                            (e)=>{setSms(e.target.value)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmRN? "green" :"red"} textAlign="start" >{messageConfirmRN}</Box>
                        <Button sx={{mb:1}} onClick={()=>{ConfirmRandomNumber()}}>인증</Button>

                        {/* Psword */}
                        <input id='psword' ref={inputPsword} type="password" placeholder="password" value={psword} onChange={(e)=>{onChangePassword(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmPsword ? "green" :"red"} textAlign="start" >{messagePsword}</Box>

                        {/* ConfirmPsword */}
                        <input id='confirm-psword' ref={inputConfirmPsword} type="password" placeholder="confirm-password" value={confirm_psword} onChange={
                            (e)=>{onChangeConfirmPsword(e)}}/>
                        <Box sx={{ml:2, mb:2}} fontSize="13px" color={confirmConfimPsword ? "green" :"red"} textAlign="start" >{messageConfirmPsword}</Box>

                        <p id={styles.button} onClick={register_submit}>SIGN UP</p>
                        <p className={styles.message}>not registered? <a href="/login">login</a></p>


        </>  
}