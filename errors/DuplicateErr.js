const {StatusCodes} = require('http-status-codes');
const CustomError = require('./CustomError');
class DuplicateErr extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.CONFLICT;
    }
}
module.exports = DuplicateErr;