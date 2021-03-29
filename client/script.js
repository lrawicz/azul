const socket = io("http://localhost:3000", {
    withCredentials: true,
    extraHeaders: {
        "user": "pepe"
    }
});
function sendMsg() {
    socket.emit("message", "HELLO WORLD");
}

function joinRoom(){
    let userName = document.getElementById("loginUserName").value;
    let roomName ="asd"
    //let roomName = document.getElementById("loginRoom").value;
    console.log("asd")
    socket.emit("startGame",
    {
        userName:userName,
        roomName: `room-${roomName}`
    }
    );
}
function startGame() {

}
// client-side
socket.on("nombre", (arg) => {
    console.log(arg); // world
});
socket.on("joinRoomSucced",()=>{
    console.log("WTF")
    document.getElementById("loginPage").classList.add("hide")
})



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-button").onclick= () =>{
        joinRoom();
        
    }
})
