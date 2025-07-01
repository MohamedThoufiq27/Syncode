

const rooms = {};

module.exports = function(io){
    io.on('connection',(socket) =>{
        console.log("user Connected");

        socket.on('join-room',({roomid,username}) => {
            if (!rooms[roomid]) rooms[roomid] = [];

            const alreadyPresent = rooms[roomid].some(user => user.id === socket.id);
            if (!alreadyPresent) {
                rooms[roomid].push({ id: socket.id, name: username });
            }

            socket.join(roomid);

            io.to(roomid).emit('members-update', rooms[roomid]);
            console.log(`${socket} connected to room ${roomid}`);
        });

        socket.on('Request-members', (roomid) => {
            socket.to(socket.id).emit('Members-update', rooms[roomid] || []);
        });

        socket.on('code-change',({roomid,code}) =>{
            socket.to(roomid).emit('code-update',code);
        });
        
        socket.on('language-change',({roomid,language})=>{
            socket.to(roomid).emit('language-update',{language});
        });
        socket.on('leave-room',()=>{
            for (let room in rooms) {
                rooms[room] = rooms[room].filter((user) => user.id !== socket.id);
                // Optionally emit updated member list
                io.to(room).emit('members-update', rooms[room]);
            }
        })
        socket.on('disconnect',()=>{
            for (let room in rooms) {
                rooms[room] = rooms[room].filter((user) => user.id !== socket.id);
                // Optionally emit updated member list
                io.to(room).emit('members-update', rooms[room]);
            }
            console.log('user disconnected',socket.id);
        });
    });
};