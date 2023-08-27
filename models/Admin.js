const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminSchema =new mongoose.Schema({
    firstname : {
        type: String,
        required : [true,"firstname is required"]
    },
    lastname : {
        type: String,
        required : [true,"lastname is required"]
    },
    email : {
        type: String,
        unique : true,
        required : [true,"email is required"]
    },
    gender : {
        type : String,
        required : [true,"gender is required"]
    },
    adminId : {
        type : String,
        required : [true,"You need to give admin Id to register."]
    },
    password : {
        type: String,
        required : [true,"password is required"]
    },
    profile_img : 
       {
        url: String,
        public_id: String,
        asset_id : String
    },
    cover_img : {
        url : String,
        public_id : String,
        asset_id : String
    },
    
})

adminSchema.pre("save" , async function(next) {
    if(!this.isModified("password")) {
        next();
    }
  
    const gensalt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,gensalt);
    
})

adminSchema.methods.createJWT = async function() {
    const token = await jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn : '3d'});
    return token;
}

adminSchema.methods.comparePassword = async function(toBeCompared) {
    return await bcrypt.compare(toBeCompared,this.password);
}

module.exports = mongoose.model("Admin",adminSchema);