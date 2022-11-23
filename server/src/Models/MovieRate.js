const { response } = require("express");
const MovieRatestorage = require("./MovieRatestorage")

class MovieRate {
    constructor(body){
        this.body = body;
        this.rate = new MovieRatestorage(body)
    }

    async update(){
        const body = this.body
        try{
            const response = await MovieRatestorage.update(body);
            return response
        }catch(err){
            console.log(err)
            return {success: false,message: 'update error',err:err}
        }
    }

    async read(){
        const body = this.body
        const column = "count(case when rate='like' then 1 end)as like_count,count(case when rate='hate' then 1 end)as hate_count"
        const where = `where movieID = ? `
        const value = [body.movieID]
        try{
            const response = await MovieRatestorage.read(column,where,value,body);
            return response
        }catch(err){
            console.log(err)
            return {success : false ,message:'error' , err : err}
        }
    }



    async create(){
        const body = this.body
        try{
            const response =  await MovieRatestorage.create(body)
            return {success:true , message:'insert success', data:response}
        }catch(err){
            console.log(err)
            return {success:false, message: 'create error', err:err}
        }
    }


    async delete(){
        const body = this.body
        try{
            const response = await MovieRatestorage.delete(body)
            return response
        }catch(err){
            console.log(err)
            return{success: false,message: 'delete error' , err : err}
        }
    }

    async confirm(){
        const body = this.body
        const column = "rateID,rate"
        const where = `where movieID = ? and userID = ?`
        const value = [body.movieID, body.userID]
        try{
            const response = await MovieRatestorage.read(column,where,value,body)
            return response
        }catch(err){
            console.log(err)
            return{success: false, message: 'confirm error' , err : err}
        }
    }

    async read_user_like(){ // 유저가 좋아한 최근 영화id 반환 
        const body = this.body
        const column = "movieID"
        const where = "where userID= ? and rate = 'like' order by date desc"
        const value = [body.userID]
        try{
            const response = await MovieRatestorage.read(column, where, value)
            return {success: true , message:'success' , data:response.data}
        }catch(err){
            console.log(err)
            return {success: false, message: 'user like list error',err:err}
        }
    }

}

module.exports = MovieRate