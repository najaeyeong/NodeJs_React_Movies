

const MovieInfo = require( '../../Models/MovieInfo')


const process = { 

    create_update: async (req ,res)=>{
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.create_update()
        return res.json(response);
    },

    read_years: async (req,res)=>{
        const movieInfo = new MovieInfo(req.body)
        const response = await movieInfo.read_years()
        return res.json(response);
    }

}

module.exports = {
    process
}
