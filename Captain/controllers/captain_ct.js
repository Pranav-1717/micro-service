const captainmodel = require('../models/captain_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklist = require('../models/blacklist_model')
const {subscribeToQueue} = require('../service/rabbit')

const pendingRequests = []

module.exports.register = async (req,res)=>{
    try{
        const {name,email,password} = req.body
        const captain = await captainmodel.findOne({email:email});

        if(captain){
            res.json({message:'captain alredy present'})
        }
        else{
            const hash = await bcrypt.hash(password,10);
            const newcaptain = new captainmodel({name,email,password:hash})
    
            await newcaptain.save()
            const token = jwt.sign({id:newcaptain._id} , process.env.JWT_SECRET ,{expiresIn:'1h'})
            res.cookie('token' ,token)
            delete newcaptain._doc.password;
            res.send({token,newcaptain})
        }
    }
    catch(error){
        res.status(500).json({message : error.message})
    }
}

module.exports.login = async (req,res) => {

    try{
        const {email,password} = req.body
        const captain = await captainmodel.findOne({email:email})
        if(captain){
            const isMatch = await bcrypt.compare(password , captain.password)
            if(!isMatch){
                return res.status(500).json({message:'Invalid email or password'})
            }
    
            const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            delete captain._doc.password;
    
            res.cookie('token', token);
    
            res.send({ token, captain });
    
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
        const captain = req.body
        delete captain._doc.password;
        res.send(captain)
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

module.exports.isAvailability = async (req,res) => {
    try{
        const captain = await captainmodel.findById(req.captain._id)
        captain.isAvailable = !captain.isAvailable;
        await captain.save();
        res.send(captain);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.waitForNewRide = async (req,res) => {
    try{
        req.setTimeout(30000,() => {
            res.status(204).end()
        });
    
        pendingRequests.push(res);
    }
    catch (error){
        return res.json({message:error.message})
    }
}

subscribeToQueue("new-ride" ,(data) => {
    // console.log(JSON.parse(data))
    const ridedata = JSON.parse(data)

    pendingRequests.forEach(res =>{
        res.json(ridedata)
    })

    pendingRequests.length = 0
})