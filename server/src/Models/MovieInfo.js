const MovieInfostorage = require("./MovieInfostorage")

class MovieInfo {
    constructor(body){
        this.body = body;
        this.Info = new MovieInfostorage(body)
    }

    async read_years(){
        const body = this.body
        try{
            const column = "year"
            const where = "group by year order by year asc"
            const value = []

            const response =  await MovieInfostorage.read(column,where,value)
            return {success:true , message:'read success', data:response.data}
        }catch(err){
            console.log(err)
            return {success:false, message: 'read error', err:err}
        }
    }



    async create_update(){
        const body = this.body
        try{
            const where=`where movieID = ?`
            const column = `movieID,visitcount`
            const value = [body.movieID]

            const response =  await MovieInfostorage.read(column,where,value)

            if(response.data[0]?.movieID){

                const set = `visitcount=?`
                const where = `movieID =?`
                const value = [(response.data[0].visitcount+1),response.data[0].movieID]
                const res = await MovieInfostorage.update(set,where,value)
                return {success:true , message:'success', data:response.data[0].visitcount+1}

            }else{
                const table = `movie_info`
                const column = `(movieID,image,title,summary,runtime,language,rate,year,visitcount) values (?,?,?,?,?,?,?,?,?)`
                const values = [body.movieID,body.image,body.title,body.summary,body.runtime,body.language,body.rate,body.year,1]
                const res = await MovieInfostorage.create(table,column, values)

                body.genres.map(async (g)=>{
                    const table2 =`movie_genre`
                    const column2 = `(movieID,genre) values(?,?)`
                    const values2 = [body.movieID, g]
                    const res = await MovieInfostorage.create(table2,column2, values2)
                })
                return {success:true , message:'success', data:1}
            }
            
        }catch(err){
            console.log(err)
            return {success:false, message: 'create error', err:err}
        }
    }



}

module.exports = MovieInfo