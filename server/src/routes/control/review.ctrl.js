
const Review = require( '../../Models/Review')

const process = { 
    update : async (req ,res)=>{
        const review =  new Review(req.body)
        const response = await review.update();
        return res.json(response); 
    },
    delete: async (req, res) => {
        const review = new Review(req)
        const response = await review.delete();
        return res.json(response); 
    },
    create: async (req,res)=>{
        const review = new Review(req.body);
        const response = await review.create()
        return res.json(response);
    },

    read: async (req ,res)=>{
        const review =  new Review(req.body)
        const response = await review.read();
        return   res.json(response); 
    },

    read_only: async (req ,res)=>{
        const review = new Review(req.body)
        const response = await review.read_only();
        return res.json(response); 
    },


}

module.exports = {
    process
}
