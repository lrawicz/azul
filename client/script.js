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
        
        fabrics[index].classList.remove(`fabric${index + 1}_hide`);
        fabrics[index].classList.add(`fabric${index + 1}_show`);


    }
    console.log(fabrics)
    document.documentElement.style.setProperty('--giroBase', giroBase);
    for (let index = 0; index < number; index++) {
        console.log(index)
        console.log(fabrics[index].classList)
         fabrics[index].classList.remove("hide");
    }
    for (let index = 0; index < 11; index++) {
        fabrics[index].style.webkitAnimation = 'none';
        void fabrics[index].offsetWidth;
        fabrics[index].style.webkitAnimation = '';
    }
}

function show_fabricsById(id){
    let fabric = document.getElementById(`fabric${id}`);

    fabric.classList.remove(`fabric${id}_hide`);
    fabric.classList.add(`fabric${id}_show`);
}
function hide_fabricsAll() {
    let fabrics = document.getElementsByClassName("fabric")

    for (let index = 0; index < number; index++) {
        fabrics[index].classList.remove(`fabric${index+1}_show`);
        fabrics[index].classList.add(`fabric${index + 1}_hide`);
        
    }
   
}
function hide_fabricsById(id) {
    let fabric = document.getElementById(`fabric${id}`);

    fabric.classList.remove(`fabric${id}_show`);
    fabric.classList.add(`fabric${id}_hide`);
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
let fabricChoosen;
show_fabrics(5)
tiles = document.getElementsByClassName("tile");
for (let index = 0; index < tiles.length; index++) {
    const tile = tiles[index];
    /*
    y.onmouseout = (x) => {
        //element = x.explicitOriginalTarget;
        y.style.width = "";
        y.style.height = ""
    }
    */

    tile.onclick=(x)=>{
        fabricChoosen = tile.offsetParent.offsetParent.id.substr(-1)
        hide_fabricsById(fabricChoosen)
        children = tile.offsetParent.children
        let amount = 0
        for (let index = 0; index < children.length; index++) {
            let child = children[index];
            console.log(child.classList)
            if (child.classList[1] ==tile.classList[1]){
                console.log(child.classList[1])
                amount +=1
            }
        }
        jugada = { color: tile.classList[1].substr(4),amount:amount}
        console.log(jugada)
    }
    tile.onmouseenter = (x) => {
        element = x.explicitOriginalTarget
        tileSize = getComputedStyle(document.documentElement)
        .getPropertyValue('--tileSize');
        let parent = element.offsetParent;
        parent.children[0].classList[1]
        for (let index = 0; index < tiles.length; index++) {
            tiles[index].classList.remove("doubleSize")
        }
        for (let index = 0; index < parent.children.length; index++) {
            let child = parent.children[index];
            if (child.classList[1] == element.classList[1]){
                child.classList.add("doubleSize")
            }
        }
    }
    function undo(){
        show_fabricsById(fabricChoosen)
    }
    
}
