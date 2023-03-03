
const db = require("../config/db");

class Storage{

    static async read(column,table,where,value){

        return new Promise(async(resolve,reject) => {
            const sqlselect = `select ${column} from ${table} ${where}` 
            await db.query(sqlselect,value, (err, result) => {  
                if(err) {
                    console.log(err)
                    reject(`${err}`) }
                else{
                    resolve ({success: true, message: 'success', data: result})
                }
            })
        })
    }

/** table-string , colums-string ,values-string, value-array */
    static async create(table,columns,values,value){
        return new Promise( async (resolve, reject) => {
            const sql = `INSERT INTO ${table}(${columns})${values}`
            await db.query(sql,value,(err,result) =>{
                if(err) {
                    console.log(err)
                    reject(`${err}`) }
                else{
                    resolve ({success: true,message: 'success', data: result})
                }
            })
        })
    }

    static async update(table,set,where,value){

        return new Promise( async (resolve, reject) => {
            const sql = `update ${table}  ${set} ${where}`
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

    static async delete(table,where,value){
        const sqlDelete = `delete from ${table} ${where} `
        return new Promise((resolve, reject) => {
                db.query(sqlDelete,value, (err, result)  => {
                    if(err){ reject(`${err}`)}
                    else{ resolve({success: true, message  : 'delete success'})}

                })
            })
    }

}

module.exports = Storage