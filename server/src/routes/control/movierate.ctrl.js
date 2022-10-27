

const MovieRate = require( '../../Models/MovieRate')


const process = { 

    read: async (req ,res)=>{
        const movieRate = new MovieRate(req.body)
        const response = await movieRate.read()
        return res.json(response); 
    },

    create: async (req ,res)=>{
        const movieRate = new MovieRate(req.body)
        const response = await movieRate.create()
        return res.json(response);
    },

    update: async (req ,res)=>{
        const movieRate = new MovieRate(req.body)
        const response = await movieRate.update()
        return res.json(response)
    },

    delete: async (req ,res)=>{
        const movieRate = new MovieRate(req.body)
        const response = await movieRate.delete()
        return res.json(response)
    },

    confirm: async (req ,res)=>{
        const movieRate = new MovieRate(req.body)
        const response = await movieRate.confirm()
        return res.json(response)
    }

}




module.exports = {
    process
}
