const config = require('../../config/config')
const AppService = require('../../Models/Appservice')

const process = {
    PhoneConfirm:  async (req,res,config)=>{
        const appService = new AppService(req,res,config)
        const response = await appService.SMS()
        return res.json(response);
    }
}


module.exports = {
    process
}