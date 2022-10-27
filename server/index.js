const express = require('express');
const app = express();
const router = require('./src/routes/control/index')
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config(); 
// db 보다 위에 있어야 읽어온다음에 db에 접속할수 있음 
//.env 잘 안읽어지면 파일 밖으로 뺏다가 다시 넣어본다. 경로를 수정해본다. 
//dotenv를 설치후에 파일을 만들어 줘야한다 .
const db = require('./src/config/db')
const ctrl = require('./src/routes/control/home.ctrl')
const review_ctrl = require('./src/routes/control/review.ctrl')
const movierate_ctrl = require('./src/routes/control/movierate.ctrl')
const movieinfo_ctrl = require('./src/routes/control/movieinfo.ctrl')
const movieinfo_genre_ctrl = require('./src/routes/control/moviegenre.ctrl')



//app.use('/',router)
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

//login
app.post('/api/login', ctrl.process.login)

app.post('/api/register', ctrl.process.register) 

//review
app.get('/',(req,res)=>{res.send('hello world')})

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

//info
app.post('/api/movieinfo/update', movieinfo_ctrl.process.create_update)

app.get('/api/movieinfo/years', movieinfo_ctrl.process.read_years)

//genre
app.get('/api/movieinfo/genres', movieinfo_genre_ctrl.process.read)

app.listen(3001 , ()=> {console.log("3001 server" )})

//같은것 선택 컨트롤 + D , 알트 + 마우스 클릭 