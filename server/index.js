
const expressSanitizer = require("express-sanitizer");
const https = require("https");
const fs = require("fs");
const multer = require("multer");
const _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 파일이 저장되는 경로입니다.
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, Date.now()+"-"+file.originalname ) // 저장되는 파일명
  },
})
const upload = multer({storage:_storage})
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config(); 
// db 보다 위에 있어야 읽어온다음에 db에 접속할수 있음 
//.env 잘 안읽어지면 파일 밖으로 뺏다가 다시 넣어본다. 경로를 수정해본다. 
//dotenv를 설치후에 파일을 만들어 줘야한다 .
const db = require('./src/config/db')

//direct
const ctrl = require('./src/routes/control/home.ctrl')
const service_ctrl = require('./src/routes/control/Appservice.ctrl')
const review_ctrl = require('./src/routes/control/review.ctrl')
const movierate_ctrl = require('./src/routes/control/movierate.ctrl')
const movieinfo_ctrl = require('./src/routes/control/movieinfo.ctrl')
const movieinfo_genre_ctrl = require('./src/routes/control/moviegenre.ctrl')
const oauth2_ctrl = require('./src/routes/control/oauthCallback.ctrl')
const board_ctrl = require('./src/routes/control/board.ctrl')

// require("dotenv/config");
 const PORT1 = process.env.PORT1 || 3001;
//react 의 build 폴더 복사해서 server 로 갖어온 다음에 아래 코드로 view연결 
app.use(express.static(path.join(__dirname, "./build"))); //폴더안의 것들을 꺼내어 써도 좋다 라는 것 
app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, "./build/index.html"));   // __dirname = root    , / 로 접속하면 build의 index를 출력해주어라 
});

//app.use('/',router)
app.use(cors({ //client,server간 origin이 다른경우 통신하기위해 (출처가 다른 url끼리 통신할수 있도록 허용하기위해 사용)
  origin:'http://localhost:3001',
  methods:['GET', 'POST'],
  credentials:true // c-s 통신에서 쿠키,토큰 사용 위해 
}))
app.use(express.json())
app.use(cookieParser()); // server client 통신에 쿠키 사용
app.use(bodyParser.urlencoded({ extended: true }))


//https
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());

//login
  //app.post('/api/login', ctrl.process.login)//로그인
    app.post('/api/get/salt',ctrl.processUser.getSalt)//salt 반환
    app.post('/api/get/token',ctrl.processUser.getToken)//token(access,refresh) 반환  
    app.get('/api/logout',ctrl.processUser.logout)// 토큰 제거
    app.get('/api/accessToken',ctrl.processUser.accessToken)// access token으로 회원정보 반환
    app.get('/api/refreshToken',ctrl.processUser.refreshToken)//refresh token으로 access token 재발급
    app.post('/api/register', ctrl.processUser.register) //회원가입
    app.post(`/api/get/user/info`, ctrl.processUser.read) // 회원정보 조회

  //oauth2.0 naver
    app.get('/login/naver/callback',oauth2_ctrl.processOauth.naver)//naver callback  code 받고 code 보내서 token받아 token으로 정보 받아오는
  //oauth google
    app.get('/login/google/callback',oauth2_ctrl.processOauth.google)//google callback code 받고 code 보내서 token받아 token으로 정보 받아오는
  //oauth kakao
    app.get('/login/kakao/callback', oauth2_ctrl.processOauth.kakao)//kakao callback code 받고 code 보내서 token받아 token으로 정보 받아오는

//register
    app.post(`/api/phonenumber`,service_ctrl.process.PhoneConfirm) //본인인증 sms발송 

//review
    app.get('/api/get',review_ctrl.process.read)

    app.post('/api/movie/reviews/get',review_ctrl.process.read_only)

    app.post('/api/insert',review_ctrl.process.create)

    app.delete('/api/delete/:ID',review_ctrl.process.delete)

    app.put('/api/update',review_ctrl.process.update)

//rate
    app.post('/api/movie/rate',movierate_ctrl.process.read)

    app.post('/api/movie/rate/insert',movierate_ctrl.process.create)

    app.put('/api/movie/rate/update',movierate_ctrl.process.update)

    app.delete('/api/movie/rate/delete',movierate_ctrl.process.delete)

    app.post('/api/movie/rate/confirmuser',movierate_ctrl.process.confirm)

    app.post('/api/get/movies/user_rate',movierate_ctrl.process.read_user_like) // user가 좋아한 영화 id 목록 반환!0.

//info
    app.post('/api/movieinfo/update', movieinfo_ctrl.process.create_update)

    app.get('/api/movieinfo/years', movieinfo_ctrl.process.read_years)

    app.post(`/api/get/movies/user/language`, movieinfo_ctrl.process.read_movies_user_language)//! 0 .
    app.post(`/api/get/movies/user/first/genre`, movieinfo_ctrl.process.read_movies_user_first_genre)//!0.
    app.post(`/api/get/movies/user/second/genre`, movieinfo_ctrl.process.read_movies_user_second_genre)//!0.
    app.post(`/api/get/movies/user/genre`, movieinfo_ctrl.process.read_movies_user_genre)//!0.
    app.post(`/api/get/user/language`, movieinfo_ctrl.process.read_user_like_language)//유저가 좋아하는 언어권 목록! 0.
    app.post('/api/get/user/year',movieinfo_ctrl.process.read_user_like_year)//유저가 좋아하는 년도 목록! 0.
    app.post(`/api/get/user/movies`,movieinfo_ctrl.process.read_user_like_movies)


//genre
    app.get('/api/movieinfo/genres', movieinfo_genre_ctrl.process.read) // 장르 목록 반환 0

    app.post('/api/movieinfo/user/genre', movieinfo_genre_ctrl.process.read_user_genre) // user의 최신 선호장르 2개 반환 !0.

//mainhome(best,recommend)
    app.get('/api/get/movies/best', movieinfo_ctrl.process.read_best) //가장 평가 높은 영화데이터 10개 반환 

    app.post('/app/get/movies/recommend', movieinfo_ctrl.process.read_recommend) //!

//board
    app.post('/api/get/board',board_ctrl.processBoard.getList)//게시판 게시글 리스트 반환 
    app.post('/api/get/board/details',board_ctrl.processBoard.getDetail)// 게시글 상세 정보 반환
    app.put('/api/put/board/details/visited',board_ctrl.processBoard.putVisited)//게시글 조회수 수정 및 반환
    app.post('/api/post/board/details',upload.fields([{name:"files"}]),board_ctrl.processBoard.createDetails)
    app.put('/api/put/details',upload.fields([{name:"newFiles"}]),board_ctrl.processBoard.updateDetails)
    app.post('/api/get/board/details/files',board_ctrl.processBoard.getDetailsFiles)
    app.delete('/api/delete/details/files',board_ctrl.processBoard.deleteDetailsFiles)
    app.post('/api/post/board/file/downloads',board_ctrl.processBoard.getDetailsFileDownloads)

//기타
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './build/index.html'));
  });

app.listen(PORT1 , ()=> {console.log(`${PORT1} server` )}) //http 서버 실행 



// https 의존성으로 certificate와 private key로 새로운 서버를 시작
https.createServer( app).listen(8080, () => {
  console.log(`HTTPS server started on port 8080`);
});



//같은것 선택 컨트롤 + D , 알트 + 마우스 클릭 


//실행순서 

// client 폴더로 이동
// npm ci 
// npm run build
// client/build 파일 -> server/build 폴더로 이동

// server 폴더로 이동 
// npm ci
// tsc
// node app.jh 실행 

// "client-build": "cd client && npm ci && npm run build && cd ../",
// "server-build": "cd server && npm ci --dev && cd ../",
// "heroku-prebuild":"npm run client-build && npm run server-build && mv ./client/build ./server",