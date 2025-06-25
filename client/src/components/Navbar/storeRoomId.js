
export const storeRoomId = (roomid) => {
    localStorage.setItem('roomid',roomid);
}

export const getRoomId = () => {
    return localStorage.getItem('roomid');
}