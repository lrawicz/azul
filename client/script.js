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
    let roomName = document.getElementById("loginRoomName").value;
    console.log(userName, roomName)
    //let roomName = document.getElementById("loginRoom").value;
    socket.emit("joinRoom",
    {
        userName:userName,
        roomName:roomName
    }
    );
}
function startGame() {

}
// client-side
socket.on("nombre", (arg) => {
    console.log(arg); // world
});
socket.on("RoomUserAdd",()=>{
    
})
function show_fabrics(number){
    let fabrics = document.getElementsByClassName("fabric")
    let giroBase = `${360/number}deg`
    for (let index = 0; index < 11; index++) {
        fabrics[index].classList.add("hide");

    }
    document.documentElement.style.setProperty('--giroBase', giroBase);
    for (let index = 0; index < number; index++) {
         fabrics[index].classList.remove("hide");
        
    }
}
socket.on("join", (arg) => {
    console.log(arg); // world
    openGame()
});
function openGame(){
    let game = document.getElementsByClassName("game")[0]
    game.style.left = "0%"
    game.style.animationName = "openGame";
}
function closeGame(){
    let game =document.getElementsByClassName("game")[0]
    game.style.left = "100%"
    game.style.animationName= "closeGame";

}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-button").onclick= () =>{
        //openGame()
        joinRoom(); 
    }
    document.getElementById("game_border_left").onclick = () => {
        closeGame()
    }
})
