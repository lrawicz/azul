const socket = io("http://localhost:3000", {
    withCredentials: true,
    extraHeaders: {
        "user": "pepe"
    }
});
function sendMsg() {
    socket.emit("message", "HELLO WORLD");
}
// client-side
socket.on("nombre", (arg) => {
    console.log(arg); // world
});

document.getElementById("login-button").onclick= ()=>{
    console.log("test")
}