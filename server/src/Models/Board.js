const Boardstorage = require("./Boardstorage")

class Board {
    constructor(req,res){
        this.req = req;
        this.res = res;
        this.date = new Boardstorage(req,res)
    }

    async read(){
        const req = this.req;
        try{
            const page = req.body.page;
            const rowsPerPage = req.body.rowsPerPage;
            const selectedOption = req.body.selectedOption;
            const searchKeyword = "%"+req.body.searchKeyword +"%";
            //board list 반환
            const column = "number,title,user,date,visited"
            const where = `where ? like ? and fixed_comment = 'N' 
                            order by date desc 
                            limit ?,?`
            const value = [selectedOption,searchKeyword,rowsPerPage*page,rowsPerPage]
            const response1 =  await Boardstorage.read(column,where,value)

            //board list counst 반환
            const column2 = "count(number) as count"
            const where2 = `where ? like ? and fixed_comment = 'N' 
                            order by date asc `
            const value2 = [selectedOption,searchKeyword]
            const response2 = await Boardstorage.read(column2,where2,value2)
            return{success:true , message:'success', data:response1.data, data2:response2.data}

        }catch(err){
            console.log(err)
            return {success:false, message: 'read error', err:err}
        }
    }
}
module.exports = Board