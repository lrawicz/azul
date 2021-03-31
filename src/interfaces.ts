import { Fabric } from "./classes";

export interface Iuser {
    name: string;
    conn: string;
}
export interface Rooms{
    [roomName: string]: Iuser[]
}
export interface Irooms {
    [index: string]: Iroom
}
export interface Igames {
    [index: string]: Igame
}
export interface Iroom {
    users: Iuser[];
    name: string;
    addUser(user:Iuser): void
    removeUser(user: Iuser): void
    nameUserExist(name:string): boolean
    getUserByName(name: string):(Iuser | null)
    getUserByConn(conn: string): (Iuser | null)
    updateUser(user: Iuser): void
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
    hazard: string[];
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
    updateUser(user: Iuser): void
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