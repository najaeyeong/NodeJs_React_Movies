
const db = require("../config/db");
const moment = require('moment');

class Reviewstorage{

    static async Getlist(column,where){
        return new Promise(async(resolve,reject) => {
            const sqlselect = `select ${column} from movie_review ${where}` 
            await db.query(sqlselect, (err, result) => {  
                if(err) {reject(`${err}`) }
                else{
                    resolve ({success: true,message: 'success', data: result})
                }
            })
        })
    }

    static async getReviewInfo(column,where){

           const response = this.Getlist("*","")

           if(err){   reject(`${err}`)}
           else{
            if(typeof response === "MysqlError"){
                reject({success:false, message:'getlist error'})
            }else{
                resolve({success:true , data:response})
            }
           }
        }
    

    static async create(reviewInfo){
        const movieName = reviewInfo.movieName
        const movieReview = reviewInfo.movieReview
        const movieID = reviewInfo.movieID
        const userID = reviewInfo.userID
        const date =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        
        console.log(date)

        const sqlinsert = "INSERT INTO movie_review (movieName,movieReview,movieID,userID,date) values (?,?,?,?,?);"
        return new Promise((resolve, reject) =>{
            db.query(sqlinsert,[movieName,movieReview,movieID,userID,date ], async (err,result) =>{
                if(err){
                      reject(`${err}`) }
                else{
                    const sql = " select ID from movie_review order by ID DESC LIMIT 1;"
                    db.query(sql,(err, res) =>{
                        resolve({success: true, message: 'INSERT success', data: res[0].ID})
                    })
                }
            })

        })


        }
    
                // else{ 
                //     const res =  this.Getlist('ID',`order by ID DESC LIMIT 1`)
                //     if(typeof result === 'MysqlError'){
                //         resolve({success:false, message:'insert error', err:result})
                //     }else{
                //         console.log(res)
                //         resolve({success:true, message: 'insert success', data:res})
                //     }
                // }


    static async update(reviewInfo){
        const ID = reviewInfo.ID
        const movieReview = reviewInfo.newReview

        const sqlUpdate = `update movie_review set movieReview = ?,updated=? where ID = ?`

        return new Promise((resolve, reject) => {
            db.query(sqlUpdate,[movieReview,true,ID],(err, result)=>{
                if(err){
                    reject(`${err}`)
                }else{
                    resolve({success: true, message: 'update success'})
                }
            })
        })
    }

    static async delete(reviewInfo){
        const ID = reviewInfo.params.ID
        const sqlDelete = `delete from movie_review where ID = ? `
        return new Promise((resolve, reject) => {
                db.query(sqlDelete,[ID], (err, result)  => {
                    if(err){ reject(`${err}`)}
                    else{ resolve({success: true, message  : 'delete success'})}

                })
            })
    }
}

module.exports = Reviewstorage