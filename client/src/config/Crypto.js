//rsa
import crypto_rsa ,{privateDecrypt} from "crypto-browserify"
import CryptoJS from "crypto-js";
//import  jsencrypt  from "jsencrypt";
// const crypto = require('crypto');
// const CryptoJS = require('crypto-js')
// const privateKey = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n');
// const publicKey = process.env.RSA_PUBLIC_KEY.replace(/\\n/g, '\n');

// class Crypto{

// //RSA 비대칭키 암복화(crypto사용)
//     //openssl 사용 rsa key 생성 후 crypto로 암복화 
//     //openssl genrsa -out private_key.pem 1024
//     //openssl rsa -in private_key.pem -out public_key.pem -pubout
//     encodeRSA  (key,text)  {
//         //브라우저에는 buffer 기능이 없어서 react 에서 사용할려면 buffer를 따로 설치 설정해주어야한다.
//         window.Buffer = window.Buffer || require("buffer").Buffer;
//         const buffer = Buffer.from(text);//buffer 형태로 변환
//         const encrypted = crypto_rsa.publicEncrypt(key,buffer) //암호화
//         return encrypted.toString('hex'); //hex 문자열로 변환
//     }
//     decodeRSA(key,text){
//         window.Buffer = window.Buffer || require("buffer").Buffer;
//         const buffer = Buffer.from(text,'hex'); //hex문자열을 buffer 형태로 변환 

//         const decrypted = privateDecrypt(key,buffer)//복호화
//         return decrypted.toString("utf8"); //utf8 문자열로 변환
//     }

// // rsa 비대칭 암복화 JSEncrypt 사용 
//     // encodeRSA_JSEncrypt(publicKey,text){
//     //     let encrypt = new jsencrypt()
//     //     encrypt.setPrivateKey(publicKey)
//     //     let encrypted = encrypt.encrypt(text)
//     //     return encrypted
//     // }
//     // decodeRSA_JSEncrypt(privateKey,text){
//     //     var decrypt = new jsencrypt();
//     //     decrypt.getPrivateKey(privateKey)
//     //     var uncrypted = decrypt.decrypt(text)
//     //     return uncrypted
//     // }
    
   
// //aes AES256은 key 길이가 32자여야 함 (대칭키)(cryptoJS사용)
//     decodeAES256(key, data){
//         const Data = data;
//         const cipher = CryptoJS.AES.decrypt(Data, CryptoJS.enc.Utf8.parse(key), {
//             iv: CryptoJS.enc.Utf8.parse(""),
//             padding: CryptoJS.pad.Pkcs7,
//             mode: CryptoJS.mode.CBC
//         });
//         return cipher.toString(CryptoJS.enc.Utf8);
//     };
//     encodeAES56(key, data){
//         const Data = JSON.stringify(data);
//         const cipher = CryptoJS.AES.encrypt(Data, CryptoJS.enc.Utf8.parse(key), {
//             iv: CryptoJS.enc.Utf8.parse(""),
//             padding: CryptoJS.pad.Pkcs7,
//             mode: CryptoJS.mode.CBC
//         });
//         return cipher.toString();
//     }
//     //대칭키 생성
//     getRandomString(num){
//     const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
//     let result = '';
//     const charactersLength = characters.length;
//     for (let i = 0; i < num; i++) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
//     }
// }

// export default Crypto

const crypt={
    //RSA 비대칭키 암복화(crypto사용)
    //openssl 사용 rsa key 생성 후 crypto로 암복화 
    //openssl genrsa -out private_key.pem 1024
    //openssl rsa -in private_key.pem -out public_key.pem -pubout
    encodeRSA :  (key,text) => {
        //브라우저에는 buffer 기능이 없어서 react 에서 사용할려면 buffer를 따로 설치 설정해주어야한다.
        window.Buffer = window.Buffer || require("buffer").Buffer;
        const buffer = Buffer.from(text);//buffer 형태로 변환
        const encrypted = crypto_rsa.publicEncrypt(key,buffer) //암호화
        return encrypted.toString('hex'); //hex 문자열로 변환
    },
    decodeRSA : (key,text) => {
        window.Buffer = window.Buffer || require("buffer").Buffer;
        const buffer = Buffer.from(text,'hex'); //hex문자열을 buffer 형태로 변환 
        const decrypted = crypto_rsa.privateDecrypt(key,buffer)
        //crypto-browserify 사용시 env의 key는 일자로 길게 적어야함
        //복호화  crypto-browserify  crypto로는 안됨 브라우저상의 crypto모듈을 잡아와서 그런건지 함수를 찾지못함
        //create-react-app으로 개발시 webpack이 자동설치되며 그안에 최신 모듈들이 있는데 예전 모듈들(crypto,stream,buffer등)이 설정되있지 않아
        //npm react-app-rewired 설치 후 confing=overrides.js 파일 생성하여 모듈설정을 추가해주어야 하며 package.json 설정을 수정해준다. 
        return decrypted.toString("utf8"); //utf8 문자열로 변환
    },

// rsa 비대칭 암복화 JSEncrypt 사용 
    // encodeRSA_JSEncrypt : (publicKey,text) =>{
    //     let encrypt = new jsencrypt()
    //     encrypt.setPrivateKey(publicKey)
    //     let encrypted = encrypt.encrypt(text)
    //     return encrypted
    // },
    // decodeRSA_JSEncrypt : (privateKey,text) => {
    //     var decrypt = new jsencrypt();
    //     decrypt.getPrivateKey(privateKey)
    //     var uncrypted = decrypt.decrypt(text)
    //     return uncrypted
    // },
    
   
//aes AES256은 key 길이가 32자여야 함 (대칭키)(cryptoJS사용)
    decodeAES256 : (key, data) => {
        const Data = data;
        const cipher = CryptoJS.AES.decrypt(Data, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(""),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        return cipher.toString(CryptoJS.enc.Utf8);
    },
    encodeAES56 : (key, data) => {
        const Data = JSON.stringify(data);
        const cipher = CryptoJS.AES.encrypt(Data, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(""),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        return cipher.toString();
    },
    //대칭키 생성
    getRandomString : (num) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
    },
}

export default crypt;
