//import { Room } from "socket.io"
    import { Iuser, 
    Iroom, Igame, Ijugada
        }  from "./interfaces"
import {Game} from "./classes"

let rooms:Iroom[] 
let games:any= {}

function joinRoom(socket: any, eventName: string, data: any, io: any){
    /*
    data.userName
    data.roomName
    */ 


    /*
    let thisUser: Iuser = { name: data.userName, conn: socket.id };
    let socketIdRooms: Set<string> = io.of("/").adapter.rooms.get(data.roomName);
    if (socketIdRooms != undefined && socketIdRooms.has(socket.id)) {
        console.log("doubleganger??")
    } else {
        //create room if doesn't exist
        if (socketIdRooms != undefined) {
            socket.join(data.roomName);
            rooms.push(thisUser)

        } else {
            if (socketIdRooms.size == 5) {
                console.log("numero de jugadores exedidos")
            } else {
                let hasUser: User[] = rooms[data.roomName].filter((user) => { user.name == thisUser.name })
                if (hasUser.length == 0) {
                    rooms[data.roomName].push(thisUser)
                } else {
                    //ToDO: check if user exist and was disconected

                    //if(!socketIdRooms.has(hasUser[0].conn)){
                    //    rooms[data.roomName] = rooms[data.roomName].map((x)=>{
                    //           if(x.name==thisUser.name){
                    //              x.conn = thisUser.conn
                    //         }
                    //      })
                    //}
                }
                socket.join(data.roomName);
            }

        }
        data.userName
        console.log(`${data.userName} join ${data.roomName}`)
        socket.emit("joinRoomSucced")
    }

    */
}
function pickTile(socket: any, eventName: string, data: any, io: any) {
    /*
    data.jugada:jugada
    data.roomName:string
    */
    games[data.roomName].pickTile(data.jugada)
}
function startGame(socket: any, eventName: string, data: any, io: any){
    /* 
    data.mode:string
    data.room:Iroom    
    */

    let mode:string ="normal"
    let room:Iroom = {name:"salaDe5",users:[]}
    let tempUser:Iuser = {conn:"asd",name:"zxc"};
    room.users.push(tempUser)
    room.users.push(tempUser)
    room.users.push(tempUser)
    room.users.push(tempUser)
    let a:Igame

    games[room.name] = new Game(mode,room)
    a = games[room.name]
    let pickColor:string = a.fabrics[1].tiles.filter((x)=>{return x.amount>0})[0].color
    let tmpJugada:Ijugada = {
        color: pickColor,
        fabricIndex:1,
        player:a.players[a.turn],
        row:3
    }

    a = games[room.name]
    console.log(a.fabrics[0].tiles)
    a.pickTile(tmpJugada)
    console.log(a.fabrics[0].tiles)


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