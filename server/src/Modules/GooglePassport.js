
/* passport googl에 인증하고 정보를 받아와서 쿠키를 반환하는것 까지는 하였으나  그 후 토큰관리 암호화 복호화를 다루기가 
힘들어서 잠시 보류 */ 


//링크에 axios를 사용하는 함수를 실행시키도록 하고 post되는 url에 함수를 만들어 그안에서 전략,passport, callback 을
//작동하게 만들고 마지막에 res 에 쿠키를 넣어 반환 








const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const User = require("../Models/User");

// Google login 전략
// 로그인 성공 시 callback으로 request, accessToken, refreshToken, profile 등이 나온다.
// 해당 콜백 function에서 사용자가 누구인지 done(null, user) 형식으로 넣으면 된다.
// 이 예시에서는 넘겨받은 profile을 전달하는 것으로 대체했다.
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.google_id,
            clientSecret: process.env.google_secret,
            callbackURL: process.env.google_callback,
            passReqToCallback: true,
        },
    //받아온 데이터를 넣어 실행시킬 함수 
        async function (request, accessToken, refreshToken, profile, done) {
            //console.log(profile);
            let user = {
              profile: profile._json,
              accessToken: accessToken
            }

            //db에 저장 
                const data = {
                id:profile._json.email,
                psword:profile._json.sub,
                name:profile._json.name,
                email:profile._json.email,
                birthdate:null,
                gender:null,
                phonenumber:null,
                personalAgree:'true',
                locationAgree:'false',
                receiveAgree:'false',
                salt:'google'
                }
                const user1 = new User(data)
                const res = await user1.register();

            //토큰 발급(우리app 토큰발급)
                // const data1={
                //     body:{
                //         id:profile._json.email
                //     }
                // }
                // // 신규가입이든 기존회원이든 조회 또는 가입 이 끝나면 토큰발급 진행 
                // if(res){
                //     const user1 = new User(data1,res)
                //     await user1.getToken();//토큰발급 
                // }
            return done(null, user);
        }
    )
  );
  
  // login이 최초로 성공했을 때만 호출되는 함수
  // done(null, user.id)로 세션을 초기화 한다.
        passport.serializeUser(function (user, done) {
            console.log("serialized user");  
            // console.log(user)
            // //토큰 발급(우리app 토큰발급)
            // const data1={
            //     body:{
            //         id:user.profile.email
            //     }
            // }
            // // 신규가입이든 기존회원이든 조회 또는 가입 이 끝나면 토큰발급 진행 
            // const user1 = new User(data1)
            // user1.getToken();//토큰발급 
            done(null, user); //세션초기화
        });
  
  // 사용자가 페이지를 방문할 때마다 호출되는 함수
  // done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
    passport.deserializeUser(function (id, done) {
        done(null, id);//사용자의 정보를 각 request의 user 변수에 넣어준다.
    });




    //index.js  에 있을것들 


const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");
require("./src/Modules/GooglePassport") // googleStrategy

// db session store options
    const options = {
        host : process.env.host,
        port : process.env.port,
        user : process.env.user,
        password : process.env.password,
        database :  process.env.database,
    };
  // mysql session store 생성
  const sessionStore = new MySQLStore(options);

// express session 연결
    app.use(
        session({
            secret: 'secret key',
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
        })
    );
  
// passport 초기화 및 session 연결
  app.use(passport.initialize());
  app.use(passport.session());

//passport google
    app.get(
        "/auth/google",async function(req,res,next){
          await passport.authenticate("google", { scope: ["email", "profile"] })(req, res, next)
          console.log(req.session);
        }
  
      );
    //인증후 받은 데이터를 받는곳 데이터받기 성공시 이동할곳 실패시 이동할곳 설정 
      app.get('/login/google/callback', function(req,res)  {
  
  
        passport.authenticate("google", {
          successRedirect: "/",
          failureRedirect: "/login",
        });
  
        // async (req, res, next) => {
        //   return res.status(200).redirect('/');
        // }
      }
      )