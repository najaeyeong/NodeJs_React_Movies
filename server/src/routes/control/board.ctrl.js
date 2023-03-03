
const Board = require('../../Models/Board');

const processBoard = { 

    getList: async (req,res)=>{
        const board = new Board(req,res);
        const response = await board.getList();
        return res.json(response); 
    },
    getDetail: async (req,res)=>{
        const board = new Board(req,res);
        const response = await board.getDetail()
        return res.json(response); 
    },
    putVisited:async (req,res)=>{
        const board = new Board(req,res);
        const response = await board.putVisited()
        return res.json(response); 
    },
    createDetails: async (req,res)=>{
        const board = new Board(req,res);
        const response = await board.createDetails()
        return res.json(response); 
    },
    updateDetails :async (req,res)=>{
        const board = new Board(req,res);
        const response = await board.updateDetails()
        return res.json(response); 
    },
    getDetailsFiles:async (req,res)=>{
        const board = new Board(req,res);
        const response = await board.getDetailsFiles()
        return res.json(response); 
    },
    deleteDetailsFiles:async (req,res)=>{
        const board = new Board(req,res);
        const response = await board.deleteDetailsFiles()
        return res.json(response); 
    },
    getDetailsFileDownloads :async (req,res)=>{
        const file_path = req.body.file_path
        const file_name =  req.body.file_name
        res.download(file_path)
    },
}

module.exports = {
    processBoard
}
