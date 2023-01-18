const config = require('../config/config')
const axios = require('axios')
const crypto = require('crypto')
const CryptoJS = require("crypto-js");
const libphonenumber = require('libphonenumber-js/max');
var SHA256 = require('crypto-js/sha256');
var Base64 = require('crypto-js/enc-base64');

class AppService{

    constructor(req,res,config){
        this.config = config;
        this.req = req;
        this.res = res;
    }

    async makeSignature(time){

        const message = [];
        const space = ' ';
        const newLine = '\n';
        const method = 'POST';
        const timestamp = time;
        const serviceID = config.NCP_serviceID
        const url = config.sms_url
        const url2 = `/sms/v2/services/${serviceID}/messages`
        const accessKey = config.NCP_accessKey
        const secretKey = config.NCP_secretKey

        //crypto 활용
        const hmac2 = crypto.createHmac('sha256',secretKey);//HmacSHA256로 암호화  hash 단방향 암호화 
        message.push(method);
        message.push(space);
        message.push(url2);
        message.push(newLine);
        message.push(timestamp);
        message.push(newLine);
        message.push(accessKey);
        //message 배열에 위의 내용들을 담아준 후에
        const signature = hmac2.update(message.join('')).digest('base64');
        //message.join('') 으로 만들어진 string 을 hmac 에 담고, base64로 인코딩한다 (base64 형태로 정리)
        //return signature.toString(); // toString()이 없었어서 에러가 자꾸 났었는데, 반드시 고쳐야함.

        //CryptoJS 활용 
        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(timestamp);
        hmac.update(newLine);
        hmac.update(accessKey);
        const hash = hmac.finalize();
        console.log(hash.toString(CryptoJS.enc.Base64),signature)
        return hash.toString(CryptoJS.enc.Base64) //base64 형태로 인코등(정리)해서 보냄 
    } 


    async SMS(){ // 전달 받은 번호 확인 및 정리 
        const body = this.req.body
        const phoneNumber = libphonenumber.parsePhoneNumberFromString(body.phonenumber)
        const time = Date.now().toString()
        const message = [];
        const space = ' ';
        const newLine = '\n';
        const method = 'POST';
        const serviceID = config.NCP_serviceID
        const url = config.sms_url
        const url2 = `/sms/v2/services/${serviceID}/messages`
        const accessKey = config.NCP_accessKey
        const secretKey = config.NCP_secretKey
        try{
            //번호이상무
            if(phoneNumber !== undefined && phoneNumber?.isValid){
                //난수생성
                let randomnumber = Math.floor(Math.random() * 10000); //4자리 난수
                if(randomnumber < 1000){randomnumber = randomnumber*10} 
                    //sms발송
                    const hmac2 = crypto.createHmac('sha256',secretKey);//HmacSHA256로 암호화 
                    message.push(method);
                    message.push(space);
                    message.push(url2);
                    message.push(newLine);
                    message.push(time);
                    message.push(newLine);
                    message.push(accessKey);
                    const signature = hmac2.update(message.join('')).digest('base64');;
                    const data = {
                        "type":"SMS",
                        "contentType":"COMM",
                        "from": `${config.HostPhonNumber}`,
                        "content":"내용",
                        "messages":[
                            {
                                "to":`${phoneNumber?.number.substring(1)}`,
                                "content":`본인 인증 문자 발송 인증번호:${randomnumber}`
                            }
                            ]
                        }
                    const headers = {
                            'Contenc-type': 'application/json; charset=utf-8',
                            'x-ncp-iam-access-key': accessKey,
                            'x-ncp-apigw-timestamp': time,
                            'x-ncp-apigw-signature-v2': signature
                        }
                
                    await axios({method:"POST",json:true,url:url,data:data,headers:headers}).then((res)=>{
                        console.log(res.data)
                    }).catch(err=>{
                        console.log(headers)
                        console.error(err.response.data)
                        return {success: false ,message:'failed'}
                    })
                    
                    //난수반환
                    return {success: true,message:'successed', randomnumber: randomnumber}

            //번호이상
            }else if(phoneNumber === undefined || !phoneNumber?.isValid ) {
                return{success: false,message:'failed'}
            }
    
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = AppService