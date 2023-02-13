
const request = require('request-promise'); //axios랑 같은
const axios = require('axios')
const qs = require('qs') // url에 넣을 쿼리 쿼리화 <-> 스트링화 해주는 미들웨어 
const validity = require('../../Modules/validity.js')
const User = require('../../Models/User')


const processOauth = {

    naver: async (req, res)=> {

        //네이버 아이디 인증 후 받아온 code 사용해 토큰 요청
            code = req.query.code;
            state = req.query.state;
            client_id = process.env.naver_id
            client_secret = process.env.naver_secret
            redirectURI = process.env.naver_redirectURI //토큰 받을 redirect 
            api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
            + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
            //var request = require('request');
            var options = {
                url: api_url,
                headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
            };
            const result = await request.get(options);

        //받아온 토큰 사용해 data 요청  
            // string 형태로 값이 담기니 JSON 형식으로 parse를 해줘야 한다.
            const token = JSON.parse(result).access_token;
            // 발급 받은 access token을 사용해 회원 정보 조회 API를 사용한다.
            const info_options = {
                url: 'https://openapi.naver.com/v1/nid/me',
                headers: {'Authorization': 'Bearer ' + token}
            };
            const info_result = await request.get(info_options);
            // string 형태로 값이 담기니 JSON 형식으로 parse를 해줘야 한다.
            const info_result_json = JSON.parse(info_result).response;

        //받아온 data DB저장 
            const contryNumber = info_result_json.mobile_e164.slice(0,3)
            const year = info_result_json.birthyear
            const day = info_result_json.birthday.replace('-','')
            const gender = info_result_json.gender
            const local = (contryNumber === '+82') 
            const birthdate = validity.getIdCardNumber(year,day,gender,local);//생년월일 성별 국적 숫자9자 생성
            const data = {
                id:info_result_json.email,
                psword:info_result_json.id,
                name:info_result_json.name,
                email:info_result_json.email,
                birthdate:birthdate,
                gender:gender,
                phonenumber:info_result_json.mobile_e164,
                personalAgree:'true',
                locationAgree:'false',
                receiveAgree:'false',
                salt:'naver'
            }
            const user = new User(data,res)
            const res1 = await user.register();

        //로그인 진행 (우리app 토큰발급)(home으로 이동)
            const data1={
                body:{
                    id:info_result_json.email
                }
            }
            // 신규가입이든 기존회원이든 조회 또는 가입 이 끝나면 토큰발급 진행 
            if(res1){
                const user1 = new User(data1,res)
                const response = await user1.getToken();//토큰발급 
                res.redirect("/home/movie");
            }
      },

    google: async (req,res)=>{
        const code = req.query.code;
        const { id_token, access_token } = await processOauth.getGoogleOauthToken({code})
        const user = await processOauth.getGoogleUser({ id_token, access_token })
        //db에 저장 
        const data = {
            id:user.email,
            psword:user.sub,
            name:user.name,
            email:user.email,
            birthdate:null,
            gender:null,
            phonenumber:null,
            personalAgree:'true',
            locationAgree:'false',
            receiveAgree:'false',
            salt:'google'
            }
            const user1 = new User(data)
            const response = await user1.register();

        //토큰 발급(우리app 토큰발급)
            const data1={
                body:{
                    id:user.email
                }
            }
            // 신규가입이든 기존회원이든 조회 또는 가입 이 끝나면 토큰발급 진행 
            if(response){
                const user1 = new User(data1,res)
                await user1.getToken();//토큰발급 
                res.redirect("/home/movie");
            }

      },

    getGoogleOauthToken : async ({ code })=> {
        const rootURl = 'https://oauth2.googleapis.com/token';
        const options = {
            client_id: process.env.google_id,
            client_secret: process.env.google_secret,
            code:code,
            redirect_uri: process.env.google_redirectURI,
            grant_type: 'authorization_code',
        };
        try {
            const { data } = await axios.post(
                rootURl,
                qs.stringify(options),
                {
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
                );
            return data;
        } catch (err) {
            console.log('Failed to fetch Google Oauth Tokens');
            throw new Error(err);
        }
        },
             
    getGoogleUser : async ({id_token,access_token,})=> {
            try {
              const { data } = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
                {
                  headers: {
                    Authorization: `Bearer ${id_token}`,
                  },
                }
              );
          
              return data;
            } catch (err) {
              console.log(err);
              throw Error(err);
            }
          },
    
    kakao : async (req,res)=>{
        //코드 받고, 토큰 받고, 유저정보 받고 
            const code = req.query.code;
            const {access_token,token_type}= await processOauth.getKakaoOauthToken({code})
            const user = await processOauth.getKakaoUser({access_token})
            console.log(user);
        //db저장 
            let gender 
            if(user.kakao_account.gender === 'male'){
                gender = "M"
            }else{
                gender = "W"
            }
            const data = {
                id:user.kakao_account.email,
                psword:user.id,
                name:user.kakao_account.profile.nickname,
                email:user.kakao_account.email,
                birthdate:null,
                gender:gender,
                phonenumber:null,
                personalAgree:'true',
                locationAgree:'false',
                receiveAgree:'false',
                salt:'kakao'
                }
                console.log(data);
            const user1 = new User(data)
            const response = await user1.register();
        //로그인 - 토큰발급
            const data1={
                body:{
                    id:user.kakao_account.email
                }
            }
            // 신규가입이든 기존회원이든 조회 또는 가입 이 끝나면 토큰발급 진행 
            if(response){
                const user1 = new User(data1,res)
                await user1.getToken();//토큰발급 
                res.redirect("/home/movie");
            }

    },
    getKakaoOauthToken : async ({code})=>{
        const rootURl = 'https://kauth.kakao.com/oauth/token';
        const options = {
            client_id: process.env.kakao_id, //"REST API 부분을 넣어준다."
            client_secret: process.env.kakao_secret, // 보안
            code:code,
            redirect_uri: process.env.kakao_redirectURI ,
            grant_type: 'authorization_code',
        };
        try {
            const {data} = await axios.post(
                rootURl,
                qs.stringify(options),
                {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }) 
            //console.log(data.data)
            return data
        } catch (error) {
            console.log(error);
        }
    },
    getKakaoUser : async ({access_token})=>{
        const rootURI = "https://kapi.kakao.com/v2/user/me"
        const options = {
            headers : {
                Authorization: `Bearer ${access_token}`
            }
        }
        try {
            //get으로 해야함 , post로 하면 error(targetID가 없다고 나옴 어트민키사용하는걸로 판단해서)
            const data = await axios.get( rootURI,options)

            return data.data
            
        } catch (error) {
            console.log(error);
            console.log("error");
        }
    }
}

module.exports = {
    processOauth
}