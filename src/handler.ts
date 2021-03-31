//import { Room } from "socket.io"
import { Iuser, Irooms, Igames, Ijugada}  from "./interfaces"
import {Game, Room, Player} from "./classes"

let rooms: Irooms ={}
let games: Igames ={}

function joinRoom(socket: any, eventName: string, data: any, io: any){
    /*
    data.userName
    data.roomName
    */ 
    console.log("//////")
    console.log(data.roomName)
    console.log(data.userName)
    console.log("//////")

    let roomName:string ="room-"+data.roomName
    let thisUser: Iuser = { name: data.userName, conn: socket.id };
    let socketIdRooms: Set<string> = io.of("/").adapter.rooms.get(roomName);

    
    /*
    if (socketIdRooms != undefined && socketIdRooms.has(socket.id)) {
        console.log("doubleganger??")
    } else {<all the code>    }
    */
        //create room if doesn't exist
    if (!(roomName in rooms)) {

        let tmpRoom = new Room(roomName)
        tmpRoom.addUser(thisUser)
        rooms[tmpRoom.name]
        socket.emit("join", roomName);
        socket.join(roomName);

        } else {
            if (socketIdRooms.size > 5) {
                return {
                        event:"error",
                        message:"numero de jugadores exedidos"
                        }
            } else {
                
                if (!rooms[roomName].nameUserExist(thisUser.name)) {
                    rooms[roomName].users.push(thisUser)
                    io.to(roomName).emit('RoomUserAdd', thisUser.name);
                    socket.join(roomName);
                    socket.emit("join", roomName);
                } else {
                    if (rooms[roomName].nameUserExist(thisUser.name) &&
                        !socketIdRooms.has(
                            rooms[roomName].getUserByName(thisUser.name).conn)){
                        // Re-conect
                        socket.join(roomName);
                        rooms[roomName].updateUser(thisUser)
                        games[roomName].updateUser(thisUser)
                        io.to(roomName).emit('userReconnected', thisUser.name);

                        }
                }
            }

        }
        data.userName
        console.log(`${data.userName} join ${roomName}`)
        socket.emit("joinRoomSucced")
}
function pickTile(socket: any, eventName: string, data: any, io: any) {
    /*
    data.jugada:jugada
    data.roomName:string
    */
   //check if is the correct user
    let correctPlayer:Player[] =games["room-" + data.roomName].players.filter((x)=>{
        x.user.conn == socket.id
    })
    if (correctPlayer.length>0){
        games["room-" + data.roomName].pickTile(data.jugada)
    }
}
function startGame(socket: any, eventName: string, data: any, io: any){
    /* 
    data.mode:string
    data.room:Iroom    
    */

    let mode:string ="normal"
    let room: Room = new Room("salaDe5")
    let tempUser:Iuser = {conn:"asd",name:"zxc"};
    room.addUser(tempUser)
    room.addUser(tempUser)
    room.addUser(tempUser)
    room.addUser(tempUser)

    games[room.name] = new Game(mode,room)
    let pickColor: string = games[room.name].fabrics[1].tiles.filter((x)=>{return x.amount>0})[0].color
    let tmpJugada:Ijugada = {
        color: pickColor,
        fabricIndex:1,
        player: games[room.name].players[games[room.name].turn],
        row:3
    }

    console.log(games[room.name].fabrics[0].tiles)
    games[room.name].pickTile(tmpJugada)
    console.log(games[room.name].fabrics[0].tiles)


}
export function handler(
    socket:any, eventName:string, args:any, io:any){
    let data:any = args[0]
    switch(eventName){
        case "joinRoom":
            joinRoom(socket, eventName, data, io)
            break


        case "startGame":
            startGame(socket, eventName, data, io)
            break

        case "pickTile":
            pickTile(socket, eventName, data, io)
            break
        case "chat":
            console.log(data);
            socket.emit("nombre", "Pepe");
            break
        case "disconnect":
            console.log("se murio porque:")
            console.log(data)
            break
        default:
            console.log("/////")
            console.log("¿por que paso por aca?")
            console.log(eventName)
            console.log("/////")
            break
    }
}