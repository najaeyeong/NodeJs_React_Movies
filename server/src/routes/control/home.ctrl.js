"use strict"

const logger = require("../../config/logger")

const User = require('../../Models/User')
//UserStorage 의 user 를 static 으로 설정하면 바로 class 에서 불러 사용할수 있다.
//static 아닐시  const 변수 = UserStorage    , UserStorage.user 로 변수에 넣어서 사용 

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

const process = { 
    login : async (req, res) => {
        const user = new User(req)
        const response = await user.login();
        logger.info(`POST / LOGIN 200 RESPONSE: ${response.success}, msg: ${response.message}`)
        return res.json(response);     
    },
    register: async (req, res) => {
        const user = new User(req.body)
        const response = await user.register();
        logger.info(`POST / REGISTER 200 RESPONSE: ${response.success}, msg: ${response.message}`)
        return res.json(response); 
    }
}

module.exports = {
    output,
    process
}
