const mongoose = require('mongoose');

const ConnectToDB =async (uri) => {
    mongoose.set('strictQuery',false)
    try{
        const connected = await mongoose.connect(
            uri,
            {useNewUrlParser : true,
            useUnifiedTopology : true
            }
        )
        console.log('connected to database...')
        return connected;
    }catch(err) {
        console.log('cannot connect to db error message :' + err);
    }
   
  
}

module.exports = ConnectToDB;