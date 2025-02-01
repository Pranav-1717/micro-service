const jwt = require('jsonwebtoken')
const usermodel = require('../models/user_model')
const blacklist_model = require('../models/blacklist_model')

module.exports.userAuth = async (req , res , next) =>{
    try{

        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
        req.query.Authorization.split(' ')[1];
        console.log(token)

        if(!token){
            console.log("not token")
            return res.status(401).json({message:'Unauthorised'})
        }
        const isBlacklisted = await blacklist_model.findOne({"token":token})
        console.log(isBlacklisted)
        if(isBlacklisted){
            console.log("Not black")
            return res.status(401).json({message :'Unauthorized'})
        }

        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const user = await usermodel.findOne({ _id: decode.id });
        if(!user){
            console.log("USER NAHI AAHE")
            return res.status(401).json({message:'Unauthorised'})
        }

        req.body = user
        console.log("user",user)
        next();
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}