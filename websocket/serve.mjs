import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
export const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }, 
    path: "/api/webServer"
});

io.on("connection", async (client) => {
    let userId = "";
    // const clientDB = await connectDatabaseFromServer();
    // const db = clientDB.db("taskify");

    io.on("userConnect", (id) => {
        userId = id;
        console.log(id, "Just connected to Server");
    });

    if (userId !== "") {
        // const dbCollection = db.collection("AccountDetails");

    }


    console.log(client.id);
    console.log(io);
});

export const config = {
    
}

httpServer.listen(2222, ()=>{
    console.log("Serve is listening on prot: 2222");
});