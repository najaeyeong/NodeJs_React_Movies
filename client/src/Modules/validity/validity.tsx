import axios from 'axios';
import 'react-phone-number-input/style.css'
import PhoneInput,{ isValidPhoneNumber } from 'react-phone-number-input'

const validity = {
// 이메일 형식 확인 함수
    onChangeEmail : ((e: React.ChangeEvent<HTMLInputElement>) => {
        const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        const emailCurrent = e.target.value
        if(emailCurrent.length !== 0 && !emailRegex.test(emailCurrent)){
            return false
        }else if(emailCurrent.length === 0){
            return false
        }else{
            return true
        }
    }),

//비밀번호
    onChangePassword : ((password:string) => {
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$~;:'"\\\]|/[{}()<>=+_,.%^&*-]).{8,}$/
        //비번창 형식 상태 메세지 
        if (password.length !== 0 && !passwordRegex.test(password)) {
            return false
        }else if(password.length === 0 ){
            return false
        } else {
            return true
        }
    }),



//아이디 입력형식 검사 함수
    onChangeId : ((id:string)=>{
        const idRegax = /^[a-zA-Z0-9]{2,20}$/
        const str = id.toLowerCase()
        if(str.length !== 0 && !idRegax.test(str)){
            return false
        }else if(str.length === 0 ){
            return false
        }else{
            return true
        }
    }),

//이름 입력형식 검사 함수 
    onChangeName : ((name:string)=>{
        const nameRegax = /^[가-힣a-zA-Z]{1,30}$/ //한영 30자이하
        const str = name.toLowerCase()
        if(str.length !== 0 && !nameRegax.test(str)){
            return false
        }else if(str.length === 0 ){
            return false
        }else{
            return true
        }
    }),

    //휴대폰인증을 위해 휴대폰번호 전송 (난수반환받음)~
    PostPhoneNumber : ( async(PhoneNumber:string,url:string)=>{
        if(!isValidPhoneNumber(PhoneNumber)){ return  false}
        else{
            await axios.post(`${url}/api/phonenumber`,{phonenumber:PhoneNumber}).then((res)=>{
                if(res.data.success){
                    console.log(res.data.randomnumber)
                    return res.data.randomnumber
                }else{
                    console.log(res)
                }
            }).catch((err)=>{
                console.log('err')
                console.log(err)
            })
        }
    })
    ,
//생년월일 유효성 검사 함수 ~
    isBirthDay:(year:number,month:number,day:number)=>{
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
,
    /**성별 생년 주민등록번호 조합 만들기 국내 true godhl false*/
    getIdCardNumber : (year:string,day:string,gender:string,local:boolean)=>{
        var birthdate;
        if(local){
            if(gender === "M"){ //남자 
                if(Number(year) > 2000){
                    return year+day+3
                }else{
                    return year+day+1
                }
            }else if(gender === "W"){ //여자
                if(Number(year) > 2000){
                    return year+day+4
                }else{
                    return year+day+2
                }
            }else{// 성별 없음
                return year+day+0
            }
        }else{
            if(gender === "M"){ //외국남자 
                if(Number(year) > 2000){
                    return year+day+7
                }else{
                    return year+day+5
                }
            }else if(gender === "W"){ //외국여자
                if(Number(year) > 2000){
                    return year+day+8
                }else{
                    return year+day+6
                }
            }else{// 성별 없음
                return year+day+9
            }
        }
    }

}

export default validity