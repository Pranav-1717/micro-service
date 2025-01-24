const mongoose = require('mongoose')

const connect = ()=>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('User service connected to mongodb')
    }).catch(err => {
        console.log(err)
    })
}

module.exports = connect