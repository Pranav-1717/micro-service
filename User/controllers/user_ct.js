const usermodel = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklist = require('../models/blacklist_model')
const { subscribeToQueue } = require('../service/rabbit')
const EventEmitter = require('events');
const rideEventEmitter = new EventEmitter();

module.exports.register = async (req,res)=>{
    try{
        const {name,email,password} = req.body
        console.log('pass1',password)
        const user = await usermodel.findOne({email:email});

        if(user){
            res.json({message:'User alredy present'})
        }
        else{
            console.log('pass2',password)
            const hash = await bcrypt.hash(password,10);
            const newuser = new usermodel({name,email,password:hash})
    
            await newuser.save()
            const token = jwt.sign({id:newuser._id} , process.env.JWT_SECRET ,{expiresIn:'1h'})
            res.cookie('token' ,token)
            delete newuser._doc.password;
            res.send({token,newuser})
        }
    }
    catch(error){
        console.log('error',error.message)
        res.status(500).json({message : error.message})
    }
}

module.exports.login = async (req,res) => {

    try{
        const {email,password} = req.body
        const user = await usermodel.findOne({email:email})
        console.log(user)
        if(user){
            console.log('Password from request:', password);
            console.log('Stored password in database:', user.password);
            const isMatch = await bcrypt.compare(password , user.password)
            if(!isMatch){
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
        const token = req.cookies.token
        await blacklist.create({token})
        res.clearCookie('token')
        res.json({message:'Logout successfully'})
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }

}

module.exports.profile = async (req,res) => {
    try{
        const user = req.body
        console.log("user2",user)
        delete user._doc.password;
        console.log("user2",user)
        return res.json(user)
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}

module.exports.acceptedRide = async (req, res) => {
    // Long polling: wait for 'ride-accepted' event
    rideEventEmitter.once('ride-accepted', (data) => {
        res.send(data);
    });

    // Set timeout for long polling (e.g., 30 seconds)
    setTimeout(() => {
        res.status(204).send();
    }, 30000);
}

subscribeToQueue('ride-accepted', async (msg) => {
    const data = JSON.parse(msg);
    rideEventEmitter.emit('ride-accepted', data);
});