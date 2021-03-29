export interface Iuser {
    name: string;
    conn: string;
}
export interface Rooms{
    [roomName: string]: Iuser[]
}
export interface Iroom {
    users: Iuser[];
    name: string;
}
export interface Ijugada {
    fabricIndex: number;
    color: string;
    row: number;
    player: Iplayer;
}

export interface IrowLeft{
    max:number
    color:string
    used:number
}
export interface IgameMode{
    colors:string []
    privateBoardRows:number
    rowsLefts: IrowLeft[];
    rowsRight: IobjectiveTile[][];
    hazard: string[]
}
export interface Iplayer {
    rowsLefts: IrowLeft[];
    rowsRight: IobjectiveTile[][];
    user: Iuser;
    points: number;
    hazard: number;
    firstPlayerToken: boolean;
}

export interface Igame {
    roomName: string;
    players: Iplayer[];
    phase: GamePhase;
    fabrics: Ifabric[];
    bag: Ifabric;
    trash: Ifabric;
    turn: number; //playerIndex
    mode: IgameMode;

    pickTile: (jugada:Ijugada)=>void;
    partialScore:()=>void;
    finalScore: () => void;
}
export enum GamePhase{
    setup,
    picktiles,
    middlescore,
    finalscore,
}
export interface Ifabric {
    tiles:Itile[]
    add: (color: string, amount: number)=>void
    remove: (color: string, amount?: number)=>number
}
export interface Itile{
    color: string, amount: number
}
export interface IobjectiveTile{
    color:string
    active:boolean
}