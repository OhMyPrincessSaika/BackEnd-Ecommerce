const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,"user name is required"]
    },
    description : {
        type : String,
        required : [true,"description is required"]
    },    
    read : {
        type :Boolean,
        required : [true,"read option is required"]
    }
   
},
 {
    timestamps: true,
 }


)
module.exports = mongoose.model("Notification",notificationSchema);