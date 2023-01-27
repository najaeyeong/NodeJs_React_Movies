
const request = require('request-promise'); //axios 
const validity = require('../../Modules/validity.js')
const User = require('../../Models/User')


const processOauth = {

    naver: async (req, res)=> {

        //받아온 code 사용해 토큰 요청
            code = req.query.code;
            state = req.query.state;
            client_id = process.env.naver_id
            client_secret = process.env.naver_secret
            redirectURI = process.env.naver_redirectURI
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
            const birthdate = validity.getIdCardNumber(year,day,gender,local);
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
            if(res1){
                const user1 = new User(data1,res)
                const response = await user1.getToken();
                res.redirect("/home/movie");
            }
            
      }
}

module.exports = {
    processOauth
}