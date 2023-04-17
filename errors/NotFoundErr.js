const {StatusCodes} = require('http-status-codes');
const CustomError = require('./CustomError');
class NotFoundErr extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}
module.exports = NotFoundErr;