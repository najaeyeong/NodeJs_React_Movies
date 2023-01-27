"use strict"

const logger = require("../../config/logger")

const User = require('../../Models/User')
//UserStorage 의 user 를 static 으로 설정하면 바로 class 에서 불러 사용할수 있다.
//static 아닐시  const 변수 = UserStorage    , UserStorage.user 로 변수에 넣어서 사용 
const Crypto = require('../../config/crypto')


const output = {
    home : (req, res) => {
        logger.info(`GET / 200 "HOME 화면으로 이동"`)
        res.render("home/index")
    },
    login : (req, res) => {
        logger.info(`GET / 200 "LOGIN 화면으로 이동"`)
        res.render("home/login")
    },
    register: (req, res) => {   
        logger.info(`GET / 200 "REGISTER 화면으로 이동"`)
        res.render("home/register")
    }
}

const processUser = { 

    login : async (req, res) => {
        const user = new User(req,res)
        const response = await user.login2();
        logger.info(`POST / LOGIN 200 RESPONSE: ${response.success}, msg: ${response.message}`)
        return res.json(response);     
    },

    register: async (req, res) => {
    //전달받은 데이터 복호화 
        const Data = req.body
        //비대칭복호화 - 대칭키
        const aesKey = Crypto.prototype.decodeRSA(process.env.ServerPrivateKey,Data.key)
        //대칭복호화 - 데이터
        const data = Crypto.prototype.decodeAES256(aesKey,Data.data)
        //json정보 복구
        const decodedate = JSON.parse(data)
    //데이터 가공 저장 전달
        const user = new User(decodedate)
        const response = await user.register();
        logger.info(`POST / REGISTER 200 RESPONSE: ${response.success}, msg: ${response.message}`)
        return res.json(response); 
    },

    read: async (req,res)=>{
        const user = new User(req.body)
        const response = await user.read()
        return res.json(response); 
    },
    logout: async (req,res)=>{
        const user = new User(req,res)
        const response = await user.logout()
        return res.json(response); 
    },

    accessToken: async (req,res)=>{
        const user = new User(req,res)
        const response = await user.accessToken()
    //데이터 암호화하여 클라이언트로 전달
        //대칭키 생성 
        const key = Crypto.prototype.getRandomAES256(32)

        //대칭키 암호화
        const EncodedResoponse = Crypto.prototype.encodeAES256(key,response)

        //키 비대칭 암호화 
        const EncodedKey = Crypto.prototype.encodeRSA(process.env.ClinetPublicKey , key)
        
        //비대칭 암호화된 대칭키, 대칭 암호화된 데이타 
        const Res = {key:EncodedKey,data:EncodedResoponse}

        return res.json(Res); 
    },

    refreshToken: async (req,res)=>{
        const user = new User(req,res)
        const response = await user.refreshToken()
        return res.json(response);
    },

    getSalt: async (req,res)=>{
        const user = new User(req,res)
        const response = await user.getSalt()
        return res.json(response);
    },

    getToken: async (req,res)=>{
        const user = new User(req,res)
        const response = await user.getToken()
        return res.json(response);
    }

}

module.exports = {
    output,
    processUser
}
