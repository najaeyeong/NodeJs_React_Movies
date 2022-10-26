

const db = require("../config/db");

class MovieInfostorage{



    static async read(column,where,value){

        return new Promise(async(resolve,reject) => {
            const sqlselect = `select ${column} from movie_info ${where}` 
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

  


}

module.exports = MovieInfostorage