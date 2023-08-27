const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required: [true,"please provide first name"]
    },
    lastname : {
        type : String,
        required: [true,'please provide last name']
    },
    password : {
        type : String,
        required : [true,'please provide password'],
    },
    age : {
        type : Number,
    },  
    email : {
        type : String,
        required : [true,'please provide email'],
        unique : true
    },
    phonenum : {
        type : String,
        unique : true,
        required : [true,'please provide phone number']
    },
    cart : {
        type : mongoose.Types.ObjectId,
        ref : "Cart"
    },
    passwordResetToken : String,
    passwordResetDate : Date,
    passwordResetExpires : Date,
    wishlists : [
        {
            product : {
            type : mongoose.Types.ObjectId,
            ref : "Product",
    
            }
        }
    ],
    coupons : [
        {
            coupon : {
            type : mongoose.Types.ObjectId,
            ref : "Coupon"
            }
        }
    ],
    notification : {
        type : mongoose.Types.ObjectId,
        ref:'Notification'
    },
    couponApplied: Boolean
    
})
userSchema.methods.createJWT =async function() {
    const token = await jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn: '3d'});
    return token;
}

userSchema.pre('save',async function(next) {
    if(!this.isModified("password")) {
        next();
    }
    const gensalt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,gensalt);
})

userSchema.methods.comparePassword = async function(toBeCompared) {
    return bcrypt.compare(toBeCompared,this.password);
}

userSchema.methods.generateResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.
    createHash('sha256')
    .update(resetToken)
    .digest("hex");
    this.passwordResetDate = Date.now()
    this.passwordResetExpires = Date.now() + 10 * 6 * 1000;
    return resetToken;
}
module.exports = mongoose.model("User",userSchema);