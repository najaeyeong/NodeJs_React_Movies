"use strict"
const jwt = require('jsonwebtoken')

//await  는 항상 promise를 반환하는 애 앞에 , async(비동기) 함수 안에서 사용된다. 
const UserStorage = require("./Userstorage")

class User {
    constructor(req,res){
        this.req = req
        this.res = res
        this.user = new UserStorage(req)

    }
    // async login(){
    //     const body = this.req.body
    //     const res = this.res
    //     try{
    //         const {id,psword} = await UserStorage.getUserInfo(body.id)
    //         if(id){
    //             if(id === body.id && psword === body.psword){
    //                 return {success: true ,message: 'login successful'}
    //             }
    //             return {success: false , message: 'Login failed : 틀린 password error'};
    //         }
    //         return {success: false, message: 'Login failed : 존재하지 않는 id error'};
    //     } catch(err){
    //         console.log(err)
    //         return {success: false, err: err};
    //     }
    // }
    async login2(){
        const body = this.req.body
        const res = this.res
        try{
            const response = await UserStorage.read(body)
            if(response.data[0]?.id){
                if(response.data[0].id === body.id && response.data[0].psword === body.psword){ //정보일치
                    this.getToken()
                }
                return {success: false , message: 'Login failed : 틀린 password error'};
            }
            return {success: false, message: 'Login failed : 존재하지 않는 id error'};
        } catch(err){
            console.log(err)
            return {success: false, err: err};
        }
    }

//get salt 발급
    async getSalt(){
        const req = this.req
        const res = this.res
        try {
            const response = await UserStorage.read(req.body)
            if(response.data[0]?.id){
                const salt = response.data[0]?.salt
                const psword = response.data[0]?.psword
                return{success: true,message:'get salt successed', data: {salt:salt,psword:psword}}
            }
            return {success: false, message: 'Login failed : 존재하지 않는 id error'};
        } catch (error) {
            console.log(error)
            return {success: false, message: 'get salt error'};
        }
    }
//토큰 발급
    async getToken(){
        const req = this.req
        const res = this.res
        const response = await UserStorage.read(req.body)
        try {
            //AccessToken 발급
            const accessToken = jwt.sign({
                id:response.data[0].id,
                name:response.data[0].name,
                email:response.data[0].email,
                birthdate:response.data[0].birthdate,
                gender:response.data[0].gender,
                registerDate:response.data[0].registerDate,
                phonenumber:response.data[0].phonenumber,
            },process.env.ACCESS_SECRET,{
                expiresIn:'1m',
                issuer:'About Tech'
            })
            //Refresh token 발급
            const refreshToken = jwt.sign({
                id:response.data[0].id,
                name:response.data[0].name,
                email:response.data[0].email,
                birthdate:response.data[0].birthdate,
                gender:response.data[0].gender,
                registerDate:response.data[0].registerDate,
                phonenumber:response.data[0].phonenumber,
            },process.env.REFRESH_SECRET,{
                expiresIn:'24h',
                issuer:'About Tech'
            })
            //토큰 전송  쿠키사용
            res.cookie("accessToken", accessToken,{
                secure: false, //https와 http 프로토콜의 차이를 명시하는 것  http - false
                httpOnly: true  //javascript, http 중 어디서 접근이 가능할지 정하는 것 true - javascript에서 접근 불가 
            })
            res.cookie("refreshToken", refreshToken,{
                secure: false,
                httpOnly: true 
            })
            
            //res.status(200).json('login successful')
            return {success: true ,message: 'login successful',data:response.data[0]}
        }catch (error) {
            console.log(error)
            //res.status(500).json('login failed')
            return {success: false,message: 'login failed',error:error}
        }
    }

    //accessToken을 받아 유저정보 반환
    async accessToken(){
        const req = this.req//req
        const res = this.res
        try {
            const token = req.cookies.accessToken;
            const userData = jwt.verify(token,process.env.ACCESS_SECRET);
            const response = await UserStorage.read(userData)
            if(response.success){
                return response;
            }else{
                return {success:false,message:"faild",error:response.error}
            }
        } catch (error) {
            console.log(error)
            return{success : false ,message:'error' , err : error}
        }
     }

     //refreshToken을 받아 accessTOKEN 재발급 
     async refreshToken(){
        const req = this.req //req
        const res = this.res
        try {
            const token = req.cookies.refreshToken;
            const userDate = jwt.verify(token,process.env.REFRESH_SECRET);
            const response = await UserStorage.read(userDate); //user 정보 
            // accessToken 재발급 
            const accessToken =jwt.sign({
                id:response.data[0].id,
                name:response.data[0].name,
                email:response.data[0].email,
                age:response.data[0].age,
                phonenumber:response.data[0].phonenumber,
            },process.env.ACCESS_SECRET,{
                expiresIn:'10s',
                issuer:'About Tech'
            })
            res.cookie("accessToken", accessToken,{
                secure: false, //https와 http 프로토콜의 차이를 명시하는 것  http - false
                httpOnly: true  //javascript, http 중 어디서 접근이 가능할지 정하는 것 true - javascript에서 접근 불가 
            })
            return {success:true,message:'success'}

        } catch (error) {
            res.status(500).json('AccessToken Recreate error')
        }
     }

     async logout(){
        const req = this.req //req
        const res = this.res

        try {
            res.cookie('accessToken', '');
            res.cookie('refreshToken', '');
            return {success:true,message:'logout success'}
        } catch (error) {
            return {success:false,message:'logout failed',err:error.message}
        }
     }

    async register(){
        const client = this.req
        try{
            const response = await UserStorage.save(client);
            return response;
        }catch(err){
            return {success : false ,message:'error' , err : err}
        }
     }

     async read(){
        const body = this.req.body
        try{
            const response = await UserStorage.read(body);
            return response;
        }catch(err){
            return {success : false ,message:'error' , err : err}
        }
     }

   
}
module.exports = User