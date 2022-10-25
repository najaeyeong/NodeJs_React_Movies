const winston = require('winston');
const newLocal = { label: 'nodeJS-login' };
 //const {createLogger , transports,format} = require(winston);
 //const {combine,timestamp,json,simple,label, colorize,printf} = require(format);
// winston 과 format 을 지워서 가독석 좋게 표현할 수 도 있다 . 일단 하지 않음 

const printLogFormat_file =  winston.format.combine(
    winston.format.label(newLocal),
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.printf(
        ({timestamp,message,level})=>{
            return `${timestamp} [${newLocal.label}] ${level}: ${message}`
        }))
const printLogFormat_console =  winston.format.combine(
                            winston.format.label(newLocal),
                            winston.format.colorize(), // 출력 format에 색 입히기 
                            winston.format.timestamp({
                                format: 'YYYY-MM-DD HH:mm:ss',
                            }), // 시간표시 
                            winston.format.printf(
                                ({timestamp,message,level})=>{
                                    return `${timestamp} [${newLocal.label}] ${level}: ${message}`
                                }) // printf()직접입력 
                        )  // 출력하고 싶은 포멧 유형 simple()심플 , json()

const logger = winston.createLogger({
                    transports: [
                        new winston.transports.File({
                            level: 'info',
                            format: printLogFormat_file ,
                            filename:'access_winston.log',
                            dirname: './log'

                        })
                    ]
                });

if(process.env.NODE_ENV !== 'production') {  //개발중이라면 콘솔에 로그 띄운다.  서비스 중이면 뺌 
    logger.add(
        new winston.transports.Console({ 
            level: 'info',  // info 레벨이상의 로그만 반환함 
            format: printLogFormat_console
        }),
    )
}
module.exports = logger;