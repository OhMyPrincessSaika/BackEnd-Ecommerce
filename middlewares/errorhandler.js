const {UnauthorizedErr,DuplicateErr,BadRequestErr,NotFoundErr,CustomErr} = require('../errors');
const {StatusCodes} = require('http-status-codes');

const errorhandler = (err,req,res,next) => {
    console.log("Instance of CustomErr",err instanceof CustomErr);
    if(err instanceof CustomErr) {
        console.log('custom Err');
        return res.status(err.statusCode).send(err.message);
    }
    res.status(StatusCodes.BAD_REQUEST).json({err});
}

module.exports = errorhandler