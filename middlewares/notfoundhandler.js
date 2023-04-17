const {NotFoundErr} = require('../errors')
const {StatusCodes} = require('http-status-codes');

const notfoundhandler = async(req,res,next) => {
    console.log("not found middleware")
    throw new  NotFoundErr("The route doesn't exist")
}
module.exports = notfoundhandler