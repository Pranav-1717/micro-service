const mongoose = require('mongoose')

const blackllistTokenSchema = new mongoose.Schema(
    {
        token:{
            type:String,
            require:true
        },
        createdat:{
            type:Date,
            default:Date.now,
            expires:3600
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('blacklistmodel' ,blackllistTokenSchema )