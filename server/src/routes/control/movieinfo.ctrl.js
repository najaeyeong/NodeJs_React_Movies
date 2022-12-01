

const MovieInfo = require( '../../Models/MovieInfo')


const process = { 

    read_best:async(req ,res)=>{
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_best()
        return res.json(response);
    },

    read_recommend: async (req ,res)=>{
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_recommend()
        return res.json(response)
    },

    create_update: async (req ,res)=>{
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.create_update()
        return res.json(response);
    },

    read_years: async (req,res)=>{
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_years()
        return res.json(response);
    },

    read_user_like_language: async (req ,res)=>{
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_user_like_language()
        return res.json(response); 
    },

    read_user_like_year: async(req,res)=>{
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_user_like_year()
        return res.json(response); 
    },
    read_movies_user_language: async (req, res) => {
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_movies_user_language()
        return res.json(response); 
    },
    read_movies_user_first_genre: async (req, res) => {
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_movies_user_first_genre()
        return res.json(response); 
    },
    read_movies_user_second_genre: async (req, res) => {
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_movies_user_second_genre()
        return res.json(response); 
    },
    read_movies_user_genre: async (req, res) => {
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_movies_user_genre()
        return res.json(response); 
    },
    read_user_like_movies:async(req,res)=>{
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_user_like_movies()
        return res.json(response); 
    }



}

module.exports = {
    process
}
