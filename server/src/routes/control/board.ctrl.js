
const Board = require('../../Models/Board');

const processBoard = { 

    get: async (req,res)=>{
        const board = new Board(req,res);
        const response = await board.read();
        return res.json(response); 
    },

}

module.exports = {
    processBoard
}
