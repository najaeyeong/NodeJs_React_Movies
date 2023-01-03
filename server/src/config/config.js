require("dotenv").config();
//데이터베이스 
const host = process.env.host;
const port = process.env.port;
const user = process.env.user;
const password = process.env.password;
const database  = process.env.database;

//로그인 쿠키/토큰
const access_secret = process.env.ACCESS_SECRET;
const refresh_secret= process.env.REFRESH_SECRET;

//본인인증 sms발송
const HostPhonNumber = process.env.HostPhonNumber;
const NCP_serviceID = process.env.NCP_serviceID;
const NCP_accessKey = process.env.NCP_accessKey;
const NCP_secretKey = process.env.NCP_secretKey;
const sms_url = process.env.sms_url;

module.exports = {host, port, user, password, database, 
                    access_secret, refresh_secret, 
                    HostPhonNumber, NCP_accessKey, NCP_secretKey, sms_url,NCP_serviceID};
