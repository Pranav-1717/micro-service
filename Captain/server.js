const http = require('http')
const app = require('./app')

const server = http.createServer(app);

server.listen(3002 ,()=>{
    console.log("User server is listen on port 3002")
})