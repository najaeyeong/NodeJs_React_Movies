
const ReviewStorage = require("./Reviewstorage")

class Review {
    constructor(body){
        this.body = body;
        this.review = new ReviewStorage(body)
    }
    async update(){
        const body = this.body
        try{
            const response = await ReviewStorage.update(body);
            return response
        }catch(err){
            console.log(err)
            return {success: false,message: 'update error',err:err}
        }
    }

    async read(){
        const body = this.body
        try{
            const response = await ReviewStorage.Getlist('*',"");
            return response
        }catch(err){
            return {success : false ,message:'error' , err : err}
        }
    }

    async read_only(){
        const body = this.body
        try{
            const where = `where movieID = ${this.body.movieID} `
            const columns = `ID,userID,movieReview,date,updated`
            const response = await ReviewStorage.Getlist(columns,where);
            return response
        }catch(err){
            //console.log(err)
            return {success : false ,message:'error' , err : err}
        }
    }


    async create(){
        const body = this.body
        try{
            const response =  await ReviewStorage.create(body)
            return {success:true , message:'insert success', data:response}
        }catch(err){
            return {success:false, message: 'create error', err:err}
        }
    }


    async delete(){
        const body = this.body
        try{
            const response = await ReviewStorage.delete(body)
            return response
        }catch(err){
            console.log(err)
            return{success: false,message: 'delete error' , err : err}
        }
    }

}

module.exports = Review