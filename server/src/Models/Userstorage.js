
"use strict"
//statict - UserStorage.user 로 바로 사용가능하게 해준다.
// #user  private 로 은닉화 해줄수 있다.
const fs = require('fs').promises;  
const { rejects } = require('assert');
const { resolve } = require('path');
const { isReadable } = require('stream');
const { json } = require('stream/consumers');
//.promises는 fs를 promise 로 반환하게 해준다. 


const db = require("../config/db");

class UserStorage{

    
    static getUser(){

    }
    static async getUserInfo(id){
        return new Promise((resolve,reject)=>{
                    const sql = "select id,psword from users where id = ? ;";
                    db.query(sql,[id],(err,data)=>{
                        if(err) reject(`${err}`);
                        else if(data.length === 0) resolve({id:""});
                        else resolve(data[0])

                });
            }) ;
        }

    static async save(userInfo){
        const {id} = await this.getUserInfo(userInfo.id)
        if(id){
            return new Promise((resolve,reject) => { 
                    resolve({success:false, message:`존재하는 아이디 입니다.`})
            })
        }
        return new Promise((resolve,reject)=>{
            const sql = "insert into users(id, name, psword) values(?,?,?);";
            db.query(sql,[userInfo.id,userInfo.name,userInfo.psword],(err)=>{
                if(err) reject(`${err}`);
                else resolve({success:true, message:'save success'});
        });

    }) ;
    }

}
module.exports = UserStorage;