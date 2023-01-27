//rsa
const crypto = require("crypto");
const CryptoJS = require("crypto-js")
require('dotenv').config();
// const privateKey = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n');
// const publicKey = process.env.RSA_PUBLIC_KEY.replace(/\\n/g, '\n');

class Crypto{

//RSA 비대칭키 암복화
    //openssl 사용 rsa key 생성 후 crypto로 암복화 
    //openssl genrsa -out private_key.pem 1024
    //openssl rsa -in private_key.pem -out public_key.pem -pubout
    encodeRSA (key,text) {
        const buffer = Buffer.from(text);//buffer 형태로 변환
        const encrypted = crypto.publicEncrypt(key, buffer); //암호화
        return encrypted.toString("hex"); //hex 문자열로 변환
    }
    decodeRSA  (key,text)  {
        const buffer = Buffer.from(text, "hex"); //hex문자열을 buffer 형태로 변환 
        const decrypted = crypto.privateDecrypt(key, buffer); //복호화
        return decrypted.toString("utf8"); //utf8 문자열로 변환
    }
    
   
//aes AES256은 key 길이가 32자여야 함 (대칭키)
    decodeAES256(key, data){
        const Data = data;
        const cipher = CryptoJS.AES.decrypt(Data, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(""),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        return cipher.toString(CryptoJS.enc.Utf8);
    };
    encodeAES256(key, data){
        const Data = JSON.stringify(data);
        const cipher = CryptoJS.AES.encrypt(Data, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(""),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        return cipher.toString();
    }
    //대칭키 생성
    getRandomAES256(num){
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
    }
}


module.exports = Crypto