const jwt = require('jsonwebtoken')
const usermodel = require('../models/user_model')

module.exports.userAuth = async (req , res , next) =>{
    try{

        const token = req.cookies.token || req.header.authorization.split(' ')[1];
        if(!token){
            res.status(401).json({message:'Unauthorised'})
        }

        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const user = await usermodel.findOne({ _id: decode.id });
        if(!user){
            res.status(401).json({message:'Unauthorised'})
        }

        req.body = user
        next();
    }
    catch(error){
        res.status(500).josn({message:error.message})
    }
}