

module.exports = function(io){
    io.on('connection',(socket) =>{
        console.log("user Connected");

        socket.on('join-room',(roomid) => {
            socket.join(roomid);
            console.log(`${socket} connected to room ${roomid}`);
        });

        socket.on('code-change',({roomid,code}) =>{
            socket.to(roomid).emit('code-update',code);
        });
        
        socket.on('language-change',({roomid,language})=>{
            socket.to(roomid).emit('language-update',{language});
        })
        socket.on('disconnect',()=>{
            console.log('user disconnected',socket.id);
        });
    });
};