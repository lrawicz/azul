
import {
    Iuser, Ijugada, Iplayer,
    GamePhase, Igame, Iroom,
    Ifabric, Itile, IrowLeft, IobjectiveTile, IgameMode
} from "./interfaces"

export class Room implements Iroom{
    users: Iuser[]=[];
    name: string="";
    constructor(name:string) {
        this.name=name
    }
    addUser(user:Iuser):void{
        this.users.push(user)
    }
    removeUser(user: Iuser):void{
        this.users = this.users.filter((x)=>{x.conn!=user.conn})
    }
    nameUserExist(name:string):boolean{
        let tmp:Iuser[] = this.users.filter((x) => { x.name == name })
        return tmp.length>0?true:false
    }
    getUserByName(name:string):(Iuser|null){
        let tmp:Iuser[] =  this.users.filter((x)=>{x.name ==name})
        return tmp.length>0?tmp[0]:null
    }
    getUserByConn(conn: string): (Iuser | null){
        let tmp: Iuser[] = this.users.filter((x) => { x.conn == conn })
        return tmp.length > 0 ? tmp[0] : null
     }
    updateUser(user:Iuser):void{
        this.users = this.users.map((x) => { 
            x.conn= (x.name == user.name )? user.conn:x.conn;
            return x
        })
    }
}
export class Player implements Iplayer{
    rowsLefts: IrowLeft[];
    rowsRight: IobjectiveTile[][];
    user: Iuser;
    points: number;
    hazard: string[];
    firstPlayerToken: boolean;
    constructor(user:Iuser, gameMode:IgameMode){
        this.points = 0
        this.hazard = []
        this.firstPlayerToken = false
        this.user = user
        this.rowsLefts = gameMode.rowsLefts
        this.rowsRight = gameMode.rowsRight
    }
}
export class GameMode implements IgameMode{
    colors: string[]= []
    privateBoardRows: number  =0
    rowsLefts: IrowLeft[] =[];
    rowsRight: IobjectiveTile[][] =[];
    hazard:string []
    constructor(modeName:String){
        switch (modeName){
            case "normal":
                let tempRowLeft:IrowLeft;
                let tempTile:string
                this.colors = ["red", "black", "yellow", "blue", "pink"]
                this.privateBoardRows = 5
                let objTile: IobjectiveTile
                let objetiveRow: IobjectiveTile[]
                for (let i = 0; i < this.privateBoardRows; i++) {
                    tempRowLeft={color:"",used:0,max:i+1}
                    this.rowsLefts.push(tempRowLeft)
                    objetiveRow = this.colors.map((color) => {
                        objTile = { active: false, color: color }
                        return objTile
                    })
                    this.rowsRight.push(objetiveRow)
                    let tempColor:string
                    tempColor = this.colors.pop()
                    this.colors.reverse()
                    this.colors.push(tempColor)
                    this.colors.reverse()
                }
              break
        }
    }
}
export class Fabric implements Ifabric{
    tiles: Itile[]=[]
    constructor(colors:string[]){
        colors.forEach(element => {
            this.tiles.push({ color: element, amount: 0 })
        });
    }
    add(color: string, amount: number):void{
        this.tiles.map((x)=>{
            if(x.color==color){
                x.amount +=amount
            }
            return x
        })
    }
    remove(color: string, amount: number=0): number{
        let result:number =amount
        this.tiles.map((x) => {
            if (x.color == color) {
                if(amount ==0){
                    result =x.amount
                    x.amount = 0
                }else{
                    x.amount -= amount
                }
            }
            return x
        })
        return result
    }
}

export class Game implements Igame{
    mode: IgameMode;
    roomName: string;
    players: Iplayer[]=[];
    phase: GamePhase;
    fabrics: Ifabric[];
    bag: Ifabric
    trash: Ifabric
    turn: number;
    constructor(mode:string,room:Iroom){
        this.mode =new GameMode(mode)
        this.roomName =room.name
        this.bag = new Fabric(this.mode.colors)
        this.trash = new Fabric(this.mode.colors)
        this.fabrics = []
        let newPlayer:Iplayer;
        for (let index = 0; index < room.users.length; index++) {
            newPlayer = new Player(room.users[index], this.mode)
            this.players.push(newPlayer)
        }
        
        // create bag and trash
        this.mode.colors.forEach(color => {
            this.bag.add(color,20)
        });

        //create public board
        let fabricQuant: number        
        fabricQuant = room.users.length == 2 ? 6 : 6 + ((room.users.length - 2) * 2)
        for (let index = 0; index < fabricQuant; index++) {
            this.fabrics.push(new Fabric(this.mode.colors))
        }
        //assign to fabrics
        this.bagToFabrics(4)
        this.turn = Math.floor(Math.random() * (this.players.length - 1) + 1)

    }
    bagToFabrics(amountPerFabric:number):void{
        let tempBag: Ifabric = new Fabric(this.mode.colors)
        let RND: number
        let RNDcolor: string
        let cantidadFabrics:number = this.fabrics.length
        for (let fabricI = 1; fabricI < cantidadFabrics; fabricI++) {
            for (let index = 0; index < amountPerFabric; index++) {
                tempBag.tiles = this.bag.tiles.filter((x) => { return x.amount > 0 })
                if (tempBag.tiles.length ==0){
                    this.moveTrashToBag()
                    tempBag.tiles = this.bag.tiles
                }
                RND = Math.floor(Math.random() * (tempBag.tiles.length - 1) + 1)
                RNDcolor = tempBag.tiles[RND].color
                this.bag.tiles = this.bag.tiles.map((x)=>{
                    x.amount = x.color == RNDcolor ? x.amount - 1 : x.amount
                    return x
                })


                this.fabrics[fabricI].tiles = this.fabrics[fabricI].tiles.map((x) => {
                    x.amount = x.color == RNDcolor ? x.amount + 1 : x.amount
                    return x
                })
            }
        }
        
    }
    moveTrashToBag():void{
        this.trash.tiles.map((x)=>{
            this.bag.add(x.color,x.amount)
            this.trash.remove(x.color, x.amount)
        })
    }
    pickTile(jugada:Ijugada):object{

        let rowId: number = jugada.row
        let row: IrowLeft = jugada.player.rowsLefts[rowId]
        
        row.color = row.color == "" ? jugada.color : row.color
        
        if (row.color != jugada.color) {
            return {event:"error",reason:"jugada invalida"}
        } else {
            let amount: number = this.fabrics[0].remove(jugada.color)
            //public board
            if (jugada.fabricIndex> 0) {
                
                let tempFabric:Ifabric = this.fabrics[jugada.fabricIndex]
                tempFabric.tiles.forEach(tile => {
                    this.fabrics[0].add(tile.color,tile.amount)
                });
                this.fabrics[jugada.fabricIndex] = new Fabric(this.mode.colors)
            }
            //private board
            let total: number = row.used + amount
            if (total > row.max) {
                jugada.player.hazard.push(jugada.color)
            } else {
                row.used += amount
            }
            jugada.player.rowsLefts[rowId] = row
            return{
                event:"ok"
            }
        }
    }

    partialScore():void{
        let ejeX:number
        let ejeY:number


        let checkNext=(x:number,y:number,player:Iplayer,position:string):number=>{
            //position["+x","-x","-y","+x"]
            let score:number=0;
            if(x<0 ||y <0 || y > player.rowsRight.length ||
                x>player.rowsRight[0].length
                 ){
                     return 0
                 }
            if (!player.rowsRight[y][x]){
                return 0
            }
            score +=1
            switch (position){
                case "+x":
                    score +=checkNext(x+1,y,player,position)
                    break
                case "-x":
                    score +=checkNext(x-1, y, player, position)
                    break
                case "+y":
                    score +=checkNext(x, y+1, player, position)
                    break
                case "-y":
                    score +=checkNext(x, y-1, player, position)
                    break
            }
            return score
        }
        this.players.forEach(player => {
            for (ejeY = 0; ejeY < this.mode.privateBoardRows; ejeY++) {
                if (player.rowsLefts[ejeY].max == player.rowsLefts[ejeY].used){
                    ejeX = player.rowsRight[ejeY].indexOf({color: player.rowsLefts[ejeY].color,active:false})
                    player.rowsRight[ejeY][ejeX].active= true
                    let tempX1:number =0
                    let tempX2: number = 0
                    let tempY1: number = 0
                    let tempY2: number = 0
                    let subtotal:number =0
                    tempX1 = checkNext(ejeX,ejeY,player,"+x")
                    tempX2 = checkNext(ejeX, ejeY, player, "-x") -1
                    tempY1 = checkNext(ejeX, ejeY, player, "+y")
                    tempY2 = checkNext(ejeX, ejeY, player, "-x") -1
                    subtotal+= tempX1 + tempX2 - 2 == 0 ? 0:tempX1 + tempX2 - 1
                    subtotal += tempY1 + tempY2 - 2 == 0 ? 0 : tempY1 + tempY2 - 1
                    player.rowsLefts[ejeY].used = 0
                    player.rowsLefts[ejeY].color = ""
            }
        }
        });
    }
    finalScore():void{

    }
    updateUser(user:Iuser):void{
        this.players.map((x)=>{
            x.user.conn =x.user.name == user.name? user.conn:x.user.conn
            return x
        })
    }
}