import { user, room, jugada, 
    tile, 
    player, game, fabric, colorTiles, rowLeft}  from "./interfaces"
export function sumar():number{
    return (2)
}
let rooms:room[] = []
let users:user[] = []
let games:game[] =[]
export function handler(socket:any, eventName:string, args:any, io:any){
    let thisUser:user;
    switch(eventName){

        case "setUsername":
            if (users.filter((x) => x.name == args).length > 0) {
                socket.emit('userExists', args + ' username is taken! Try some other username.');
            } else {
                thisUser = {
                    name: args,
                    conn: socket.id
                }
                users.push(thisUser);
                console.log(`${socket.id} is ${args}`);
                //socket.emit('userSet', { username: data });
            }
            
        case "createRoom":
            let tempRoom:room = {name:args, users:[thisUser]}
            rooms.push(tempRoom )
            console.log(`sala ${args} creada` )
        case "joinRoom":
            let user:user= args["user"]
            
            console.log(`usuario${args[user]}`)
        case "joinRoom":
            console.log(`${thisUser.name} joins ${args} `)
        case "startRound":
        case "startGame":
            
            let bag:colorTiles[]
            for (let index = 0; index < 20; index++) {
                bag.push(colorTiles.black)
                bag.push(colorTiles.blue)
                bag.push(colorTiles.pink)
                bag.push(colorTiles.red)
                bag.push(colorTiles.yellow)
            }
        case "pickTile":

            let player:player = games[args["gameId"]]
                .players.filter(
                    (player:player)=>
                    {player.user.conn ==socket.id})[0]

            let fabrics:fabric[] = games[args["gameId"]].fabrics
            let jugada:jugada = args["jugada"]
            let rowId:number = jugada.row
            let amount: number = fabrics[jugada.fabricIndex].tiles[jugada.color].amount
            let row:rowLeft = player.rowLefts[rowId]
            let rest: tile[] = fabrics[jugada.fabricIndex].tiles
            rest[jugada.color].amount = 0
            row.color =  row.color == 0 ? jugada.color: row.color

            io.on
            if (row.color == jugada.color ){
            
                //public board
                    if (args["fabricIndex"] != 0){
                        for (let color in colorTiles) {
                            games[args["gameId"]].fabrics[0]
                                .tiles[color].amount
                                 += rest[color].amount
                        }
                    }
                games[args["gameId"]]
                    .fabrics[args["fabricIndex"]] = { tiles: [] }
                
                //private board
                    let total:number = row.used + amount 
                    if (total > row.max){
                        row.used = row.max
                        player.hazard += total - row.max
                    }else{
                        row.used += amount
                    }
                    player.rowLefts[rowId] = row

            }else{
                socket.emit('error', 
                'jugada invalida');
            }
            io.to(games[args["gameId"]].roomName).emit("played",
            {
                userName:player.user,
                jugada: jugada,
            })
        case "chat":
            console.log(args);
            socket.emit("nombre", "Pepe");
        case "disconnect":
            console.log("se murio porque:")
            console.log(args)
            users = users.filter((x) => x.conn != socket.id)
        default:
            console.log("/////")
            console.log("¿por que paso por aca?")
            console.log(eventName)
            console.log("/////")

    }
}