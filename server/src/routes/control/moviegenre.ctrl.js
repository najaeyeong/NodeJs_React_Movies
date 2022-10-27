

const MovieGenre = require( '../../Models/MovieGenre')


const process = { 
    read: async (req,res) =>{
        const movieGenre = new MovieGenre(req.body)
        const response = await movieGenre.read()
        return res.json(response);
    }


}

module.exports = {
    process
}
