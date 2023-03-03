const Boardstorage = require("./Boardstorage")
const Storage = require("./Storage")

class Board {
    constructor(req,res){
        this.req = req;
        this.res = res;
        this.date = new Boardstorage(req,res)
    }

    async getList(){
        const req = this.req;
        try{
            const page = req.body.page;
            const rowsPerPage = req.body.rowsPerPage;
            const selectedOption = req.body.selectedOption;
            const searchKeyword = '%'+req.body.searchKeyword +'%';

            //board list 반환
            const column = "number,title,user,date,visited"
            // where 의 column 은 변수로 넣으면 잘 작동안됨 
            let where 
            if(selectedOption === 'title'){
                where = `where title like ? and fixed_comment = 'N'  
                        order by date desc `                    
            }else if(selectedOption === 'user'){
                where = `where user like ? and fixed_comment = 'N'  
                        order by date desc `   
            }
            const limit = `limit ?,?`
            const Where = where + limit 
            const value = [searchKeyword,rowsPerPage*page,rowsPerPage]
            const response1 =  await Boardstorage.read(column,Where,value)

            //board list counst 반환
            const column2 = "count(number) as count"
            const value2 = [searchKeyword]
            const response2 = await Boardstorage.read(column2,where,value2)
            return{success:true , message:'success', data:response1.data, data2:response2.data}

        }catch(err){
            console.log(err)
            return {success:false, message: 'read error', err:err}
        }
    }

    async getDetail(){
        const req = this.req;
        try {
            const number = req.body.number
            const column = `number,title,user,summary,date,visited,updated,updated_date`
            const where = `where number = ? `
            const value = [number]
            const response =  await Boardstorage.read(column,where,value)
            return {success:true, message:"get detail success",data:response.data}

        } catch (error) {
            console.log("error");
            return {success:false, message:"get detail failed",err:error}
        }
    }

    async putVisited(){
        const req = this.req;
        try {
            const number = req.body.number
            const set = `visited = visited + 1`
            const where = `number = ? `
            const value = [number]
            const response =  await Boardstorage.update(set,where,value)
            return {success:true, message:"put success", data:response.data}
        } catch (error) {
            console.log("error");
            return {success:false, message:"put visited failed",err:error}
        }
    }
    async createDetails(){
        const req = this.req;
        const title = req.body.title;
        const user = req.body.userID;
        const summary = req.body.summary;
        const files = req.files.files
        try {
            // 게시물 등록 
            const table = `crud.board(title,user,summary)`
            const column = `values(?,?,?)`
            const value = [title,user, summary]
            const response = await Boardstorage.create(table,column,value)
            if(response.success){
                //게시물 번호 반환 
                const column2 = `number`
                const where2 = `where title = ? and user = ? order by date desc limit 1`
                const value2 = [title,user]
                const response2 = await Boardstorage.read(column2,where2,value2)
                //게시물에 첨부파일 등록
                if(response2.success && files){
                    for(let i = 0; i < files.length; i++){
                        const post_number = response2.data[0].number;
                        const file_origin_name = files[i].originalname;
                        const file_name = files[i].filename;
                        const file_path = files[i].path;
                        const file_size = files[i].size
                        const table2 =`crud.board_file(file_origin_name, post_number, file_name, file_path, file_size)`
                        const column3 = `value(?,?,?,?,?)`
                        const value3 = [file_origin_name,post_number,file_name,file_path,file_size]
                        await Boardstorage.create(table2, column3, value3)
                    }
                    return {success: true,message:"create atteched file success"}
                }else{
                    console.log("첨부파일 추가 실패");
                }
            }else{
                console.log("등록한 게시물 번호 반환 실패");
            }
        } catch (error) {
            console.log("error");
            return {success:false, message:"create detail failed",err:error}
        }
    }

    async updateDetails(){
        const req = this.req
        const post_number = Number(req.body.post_number)
        const newTitle = req.body.newTitle
        const newSummary = req.body.newSummary
        const newFiles = req.files.newFiles || []

        try {
            const table = `crud.board`
            const set = `set title=? , summary=? ,updated="Y" , updated_date=now()`
            const where = `where number = ? `
            const value = [newTitle,newSummary,post_number]
            const response =  await Storage.update(table,set,where,value)
            if(response.success){
                for(let i = 0; i < newFiles.length; i++){
                    const table = `crud.board_file`
                    const columns = `file_origin_name, post_number, file_name, file_path, file_size`
                    const values = `values(?,?,?,?,?)`
                    const value = [newFiles[i].originalname,post_number,newFiles[i].filename,newFiles[i].path,newFiles[i].size]
                    await Storage.create(table,columns,values,value)
                }
                return {success:true, message:"details update success", data:response.data}
            }else{
                return {success:true, message:"details update failed", data:response.data}
            }
        } catch (error) {
            console.log("error");
            return {success:false, message:"details update error ",error:error}
        }
    }

    async getDetailsFiles(){
        const req = this.req
        const post_number = req.body.number
        try {
            const columns = `file_origin_name , file_name, file_path ,file_size`
            const table = `crud.board_file`
            const where = `where post_number = ?`
            const value = [post_number]
            const response =  await Storage.read(columns,table,where,value)
            return {success:true, message:"get Detail file success", data:response.data}
        } catch (error) {
            console.log("error");
            return {success:false, message:"get Detail file failed ",error:error}
        }
    }

    async deleteDetailsFiles(){
        const req = this.req
        const post_number = req.body.post_number
        const deleteFileList = req.body.deleteFileList
        try {
            deleteFileList.map(async (file)=>{
                const table = `crud.board_file`
                const where = `where post_number = ? and file_name = ?`
                const value = [post_number,file.file_name]
                await Storage.delete(table,where,value)
            })
            return {success: true , message:"delete detail file success"}
        } catch (error) {
            console.log("error");
            return {success:false, message:"delete Detail file failed ",error:error}
        }
    }


}
module.exports = Board