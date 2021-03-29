import {handler} from "./handler"
const http = require("http").createServer();
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:81",
        methods: ["GET", "POST"],
        allowedHeaders: ["user"],
        credentials: true
    }
});

io.on("connection", function (socket: any) {
    //console.dir(socket);
    console.log(`socket connected: ${socket.id}`);

    socket.onAny((eventName: string, ...args: any) => {
        handler(socket, eventName, args, io )
    })


})

const server = http.listen(3000, function () {
    console.log("listening on *:3000");
})