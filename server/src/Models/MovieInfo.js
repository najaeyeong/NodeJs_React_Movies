const MovieInfostorage = require("./MovieInfostorage")
const MovieGenre = require("./MovieGenre")

class MovieInfo {
    constructor(body){
        this.body = body;
        this.Info = new MovieInfostorage(body)
    }

    async read_years(){ // 영화정보의 년도리스트 
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

    async read_best(){ // rate,info  테이블  사용해 좋아요 많은 영화 정보 반납
        const body = this.body
        try{
            const column = "A.movieID , A.image, A.title, A.summary, A.year, A.visitcount, RATE.count"
            const where = `INNER join (SELECT movieID, count(movieID) as count FROM crud.movie_rate where rate = 'like' group by movieID order by count desc  limit 10) RATE
             on A.movieID = RATE.movieID;`
            const value = []

            const response = await MovieInfostorage.read(column,where,value)
            return {success: true,message:"top movies read success", data:response.data}
        }catch(err){
            console.log(err)
            return{success:false,message:"top movies read error",err:err}
        }
    }



    async create_update(){  //새로운 영화라면 데이터베이스에 담기 
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


    // user 정보 활용 추천 영화 추출

    async read_user_like_language(){
        const body = this.body
        try{
            const column = "A.language ,count(A.language) as count"
            const where = `INNER JOIN (SELECT movieID FROM crud.movie_rate where userID= ? and rate = 'like' order by date desc limit 10) Rate 
            ON A.movieID = Rate.movieID group by A.language order by count desc`
            const value = [body.userID]

            const response = await MovieInfostorage.read(column,where,value)
            return {success: true,message:"language read success", data:response.data}
        }catch(err){
            console.log('read_user_like_language error')
        }
    }

    async read_user_like_year(){
        const body = this.body
        try{
            const column = "A.year , count(A.year) as count "
            const where = `INNER JOIN (SELECT movieID FROM crud.movie_rate where userID= '123' and rate = 'like' order by date desc limit 10) Rate 
            ON A.movieID = Rate.movieID group by A.year order by count desc`
            const value = [body.userID]
            const response = await MovieInfostorage.read(column,where,value)
            return {success: true,message:"language read success", data:response.data}
        }catch(err){
            console.log('read_user_like_year error')

        }
    }

    async read_movies_user_language(){ //유저가 좋아하는 언어권의 영화 목록 추천 
        const body = this.body
        try{
            // user 가 좋아하는 언어 목록 
            const movieInfo = new MovieInfo(body)
            const response = await movieInfo.read_user_like_language()
            // user 가 좋아하는 언어 목록 
            // const column = "A.language ,count(A.language) as count"
            // const where = "INNER JOIN (SELECT movieID FROM crud.movie_rate where userID= ? and rate = 'like' order by date desc limit 10) Rate ON A.movieID = Rate.movieID group by A.language order by count desc"
            // const value = [body.userID]
            // const response = await MovieInfostorage.read(column,where,value)

            if(response.data[0]?.language){
                const column = "A.movieID , A.image, A.title, A.year, A.summary, A.visitcount"
                const where = `left join (select * from crud.movie_rate where userID = ?  ) Rate 
                on (Rate.movieID = A.movieID)  where Rate.movieID is null and language = ? order by A.rate desc limit 10`
                const value = [body.userID,response.data[0]?.language ]
                const res = await MovieInfostorage.read(column,where, value)
                return {success: true,message:"user's language movies read success", data:res.data}
            }
            return {success: false ,message:"user's language movies read false", err:err}
        }catch(err){
            console.log('read_movies_best_language error')

        }
    }

    async read_movies_user_first_genre(){
        const body = this.body
        try{
            const movieGenre = new MovieGenre(body)
            const response = await movieGenre.read_user_genre() //장르 2개 반환

            if(response.data[0]?.genre){
                const res = await MovieInfostorage.user_genre_movies(body.userID ,response.data[0]?.genre )
                return {success: true,message:"user's genre movie read success", data:res.data}
            }
            return {success: false ,message:"user's genre movie read false", err:err}
        }catch(err){
            console.log('user genre movies read error')

        }
    }

    async read_movies_user_second_genre(){
        const body = this.body
        try{
            const movieGenre = new MovieGenre(body)
            const response = await movieGenre.read_user_genre() //장르 2개 반환

            if(response.data[1]?.genre){
                const res= await MovieInfostorage.user_genre_movies(body.userID ,response.data[1]?.genre )
                return {success: true,message:"user's genre movie read success", data:res.data}
            }
            return {success: false ,message:"user's genre movie read false", err:err}
        }catch(err){
            console.log('user genre movies read error')

        }
    }

    async read_movies_user_genre(){
        const body = this.body
        try{
            const movieGenre = new MovieGenre(body)
            const response = await movieGenre.read_user_genre() //장르 2개 반환

            if(response.data[1]?.genre){
                const res= await MovieInfostorage.user_two_genre_movies(body.userID ,response.data)
                return {success: true,message:"user's two genre movie read success", data:res.data}
            }
            return {success: false ,message:"user's two genre movie read false", err:err}
        }catch(err){
            console.log('user two genre movies read error')
            console.log(err)
        }
    }

    async read_user_like_movies(){
        const body = this.body
        try{
            const column = ` A.movieID, A.image, A.title, A.summary, A.language, A.year, Rate.date `
            const where = `inner join (select * from crud.movie_rate  where userID = ? and rate = 'like' order by date desc) as Rate 
            on A.movieID = Rate.movieID order by Rate.date desc`
            const value = [body.userID]

            const response = await MovieInfostorage.read(column,where,value)

            return {success : true , message:'success',data:response.data}
        }catch(err){
            console.log(err)
            return{success:false,message:"error",err:err}
        }
    }


}

module.exports = MovieInfo