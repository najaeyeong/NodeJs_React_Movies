"use strict"

//await  는 항상 promise를 반환하는 애 앞에 , async(비동기) 함수 안에서 사용된다. 
const UserStorage = require("./Userstorage")

class User {
    constructor(body){
        this.body = body
        this.user = new UserStorage(body)

    }
    async login(){
        const body = this.body.body
        try{
            const {id,psword} = await UserStorage.getUserInfo(body.id)
            if(id){
                if(id === body.id && psword === body.psword){
                    return {success: true ,message: 'login successful'}
                }
                return {success: false , message: 'Login failed : 틀린 password error'};
            }
            return {success: false, message: 'Login failed : 존재하지 않는 id error'};
        } catch(err){
            console.log(err)
            return {success: false, err: err};
        }
    }

    async register(){
        const client = this.body
        try{
            const response = await UserStorage.save(client);
            return response;
        }catch(err){
            return {success : false ,message:'error' , err : err}
        }
     }
}
module.exports = User