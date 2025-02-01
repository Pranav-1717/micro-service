const jwt = require('jsonwebtoken')
const captainmodel = require('../models/captain_model')
const blacklist_model = require('../models/blacklist_model')

module.exports.captainAuth = async (req , res , next) =>{
    try{
        const token =   req.cookies.token ||
        (req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
        req.query.Authorization.split(' ')[1];

        if(!token){
            res.status(401).json({message:'Unauthorised'})
        }
        const isBlacklisted = await blacklist_model.findOne({token})
        if(isBlacklisted){
            return res.status(401).json({message :'Unauthorized'})
        }

        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const captain = await captainmodel.findOne({ _id: decode.id });
        if(!captain){
            res.status(401).json({message:'Unauthorised'})
        }

        req.body = captain
        next();
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}