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
        const user = new User(req.body)
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
    loginSuccess: async (req,res)=>{},
    accessToken: async (req,res)=>{
        const user = new User(req,res)
        const response = await user.accessToken()
        //대칭키 생성 
        const key = Crypto.prototype.getRandomString(32)

        //대칭키 암호화
        const EncodedResoponse = Crypto.prototype.encodeAES56(key,response)

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
