const MovieGenrestorage = require("./MovieGenrestorage")

class MovieGenre {
    constructor(body){
        this.body = body;
        this.Info = new MovieGenrestorage(body)
    }
    async read(){
        const body = this.body;

        try{
            const column = "genre,ID"
            const where = "group by genre order by genre asc"
            const value = []
            const response =  await MovieGenrestorage.read(column,where,value)
            return{success:true , message:'success', data:response.data}

        }catch(err){
            console.log(err)
            return {success:false, message: 'read error', err:err}
        }
    }


}

module.exports = MovieGenre