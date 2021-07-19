const {
    createLogger,
    transports,
    format
} = require('winston')
const path = require('path')
const logger = createLogger({
    transports :[
        new transports.File({
            filename : path.join(__dirname,'../src/logs', 'info.log'),
            level:'info',
            format : format.combine(
                format.timestamp(),
                format.simple(),
                format.prettyPrint(),
                format.colorize()
            )
        }),
        new transports.File({
            filename : path.join(__dirname,'../src/logs', 'error.log'),
            level:'error',
            format : format.combine(
                format.timestamp(),
                format.simple(),
                format.prettyPrint(),
                format.colorize()
            )
        })
    ]
})
module.exports = logger