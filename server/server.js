const http = require('http');
const express= require('express');
const mongoose=require('./storage/db');
const cors = require('cors');
const setupSocket = require('./sockets/socket');
const codeRoutes = require('./routes/codeRoutes');
const runCodeRoute = require('./routes/runCodeRoute');
const copilotRoute = require('./routes/copilotRoute');
const tokenRoute = require('./routes/tokenRoute');

const { Server } = require('socket.io');


require('dotenv').config();

const app=express();
const server = http.createServer(app);

const socketIO = new Server(server,{
    cors:{
        origin:process.env.CLIENT_URL,
        methods:['GET','POST']
    }
})

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


app.use(cors());
app.use('/api/code',codeRoutes);
app.use('/api/run',runCodeRoute);
app.use('/api/copilot',copilotRoute);
app.use('/api/get-agora-token',tokenRoute);



setupSocket(socketIO);

const port=process.env.PORT || 3000;
server.listen(port,()=>console.log(`listening at port ${port}`))

