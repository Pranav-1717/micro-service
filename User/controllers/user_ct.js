const usermodel = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklist = require('../models/blacklist_model')

module.exports.register = async (req,res)=>{
    try{
        const {name,email,password} = req.body
        const user = await usermodel.findOne({email});

        if(user){
            res.status(400).send("User alredy present")
        }

        const hash = await bcrypt.hash(passwprd,10);
        const newuser = new usermodel({name,email,hash})

        await newuser.save()

        const token = jwt.sign({id:newuser._id} , process.env.JWT_SECRET ,{expiresIn:'1h'})
        res.cookie('token' ,token)
        res.send({message:'User login successfully'})
    }
    catch{
        res.status(500).json({message : error.message})
    }
}

module.exports.login = async (req,res) => {

    try{
        const {email,password} = req.body
        const user = usermodel.findOne({email:email})
        if(user){
            const isMatch = await bcrypt.compare(password , user.password)
            if(isMatch){
                res.send({message:'Login successfully'})
            }
            else{
                return res.status(500).json({message:'Invalid email or password'})
            }
    
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            delete user._doc.password;
    
            res.cookie('token', token);
    
            res.send({ token, user });
    
        }
        else{
            res.json({message:'Invalid email or password'})
        }

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

module.exports.logout = async (req,res) =>{
    try{
        const token = req.cookie.token
        await blacklist.create({token})
        req.clearCookie('token')
        res.json({message:'Logout successfully'})
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }

}

module.exports.profile = async (req,res) => {
    try{
        res.send(req.body)
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}