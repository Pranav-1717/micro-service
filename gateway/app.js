const express = require('express')
const proxyserver  = require('express-http-proxy')

const app = express()

app.use('/user' , proxyserver('http://localhost:3001'))
app.use('/captain' , proxyserver('http://localhost:3002'))
app.use('/ride' , proxyserver('http://localhost:3003'))

app.listen(3000, ()=>{
    console.log('Gateway listening on port 3000')
})