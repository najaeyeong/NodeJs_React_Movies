"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get('/', ctrl.output.home)   //get 접속했을때 
router.get('/login', ctrl.output.login)
router.get('/register', ctrl.output.register)

router.post('/api/login',ctrl.process.login)
router.post('/api/registerr', ctrl.process.register) 
//post 데이터 들어왔을때 req를 받아서 process.login 실행해서 res 반환

const db = require("../../config/db")

module.exports = router
