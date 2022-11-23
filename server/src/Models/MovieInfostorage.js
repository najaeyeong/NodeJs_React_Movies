

const db = require("../config/db");

class MovieInfostorage{



    static async read(column,where,value){

        return new Promise(async(resolve,reject) => {
            const sqlselect = `select ${column} from crud.movie_info as A ${where}` 
            await db.query(sqlselect,value, (err, result) => {  
                if(err) {
                    console.log(err)
                    reject(`${err}`) }
                else{
                    resolve ({success: true,message: 'success', data: result})
                }
            })
        })
    }

    static async create(table,column,values){

        return new Promise( async (resolve, reject) => {
            const sql = `INSERT INTO ${table}${column}`
            await db.query(sql,values,(err,result) =>{
                if(err) {
                    console.log(err)
                    reject(`${err}`) }
                else{
                    resolve ({success: true,message: 'success', data: result})
                }
            })
        })
    }

    static async update(set,where,value){

        return new Promise( async (resolve, reject) => {
            const sql = `update movie_info set ${set} where ${where}`
            await db.query(sql,value,(err, result)=>{
                if(err){
                    console.log(err)
                    reject(`${err}`)}
                else{
                    resolve({success: true,message: 'success', data: result})
                }
            })
        })
    }

    static async user_genre_movies( userID, genre){

        return new Promise(async (resolve, reject) => {
            const sql = `SELECT info.movieID, info.image, info.title, info.year, info.summary, info.visitcount, info.rate from (select * from crud.movie_rate where  userID = ?) as Rate RIGHT join 
            (SELECT A.movieID, A.image, A.title, A.year, A.summary, A.visitcount, A.rate FROM crud.movie_genre AS B join crud.movie_info AS A on A.movieID = B.movieID where genre = ? order by rate desc) info
            on Rate.movieID = info.movieID
            where Rate.movieID is null order by info.rate desc  limit 10`

            await db.query(sql,[userID , genre],(err, result)=>{
                if(err){
                    console.log(err)
                    reject(`${err}`)
                }else{
                    resolve({success:true,message:'success',data:result})
                }
            })
        })
    }

    static async user_two_genre_movies( userID, genre){

        return new Promise(async (resolve, reject) => {
            const sql = `SELECT T.movieID,T.image, T.title, T.year, T.summary, T.visitcount, T.rate from (SELECT info.movieID, info.image, info.title, info.year, info.summary, info.visitcount, info.rate, count(info.movieID) AS count from (select * from crud.movie_rate where  userID = ?) as Rate RIGHT join 
            (SELECT A.movieID, A.image, A.title, A.year, A.summary, A.visitcount, A.rate FROM crud.movie_genre AS B join crud.movie_info AS A on A.movieID = B.movieID where genre = ? or genre = ? order by rate desc) info
            on Rate.movieID = info.movieID
            where Rate.movieID is null  group by info.movieID ) AS T WHERE T.COUNT = 2 ORDER BY T.rate desc limit 10`

            await db.query(sql,[userID, genre[0].genre, genre[1].genre],(err, result)=>{
                if(err){
                    console.log(err)
                    reject(`${err}`)
                }else{
                    resolve({success:true,message:'success',data:result})
                }
            })
        })
    }

    

  


}

module.exports = MovieInfostorage