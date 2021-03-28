export interface user {
    name: string;
    conn: string;
}



export interface room {
    users: user[];
    name: string;
}
export interface jugada {
    fabricIndex: number;
    color: colorTiles;
    row: number;
}

export interface rowLeft{
    max:number
    color:colorTiles
    used:number
}
export interface player {
    rowLefts: rowLeft[];
    boardRight: string[][];
    user: user;
    points: number;
    hazard: number;
    firstPlayerToken: boolean;
}
export interface game {
    roomName: string;
    players: player[];
    phase: gamePhase;
    fabrics: fabric[];
    bag: colorTiles[];
    turn: number; //playerIndex
}
enum gamePhase{
    setup,
    picktiles,
    middlescore,
    finalscore,
}
export interface fabric {
    tiles: tile[];
}
export enum colorTiles{
    null =0,
    black =1,
    blue = 2,
    pink = 3,
    red =4 ,
    yellow= 5,
}
export interface tile {
    amount: number;
}