require("dotenv").config();
const mongoose   = require('mongoose');
const express    = require("express");
const pug        = require('pug');
const path       = require('path');
const fs         = require('fs');
const bodyParser = require("body-parser");
const app        = express();

app.engine('pug', pug.__express);
app.set("view engine", "pug"); // pug as default template engine
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require("cors")());

app.use("/user", require("./routes/user.route"))
app.use("/chatroom", require('./middlewares/oauth'), require("./routes/chatroom.route"));
app.use("/api/groups", require("./routes/group.route"))

app.get("/index.html", (req, res) => {
    res
        .writeHead(200, { "content-type": "text/html" })
        .write(fs.readFileSync('./views/index.html'))

    res.end();
})
app.all("*", (req, res) => {
    res
        .writeHead(200, { "content-type": "text/html" })
        .write(pug.renderFile('./views/app.pug'));

    res.end();
})

//Setup Error Handlers
const ErrorHandlers = require("./handlers/error-handler");
app.use(ErrorHandlers.notFound);
app.use(ErrorHandlers.mongooseErrors);
if (process.env.ENV === "DEVELOPMENT") {
    app.use(ErrorHandlers.developmentErrors);
} else {
    app.use(ErrorHandlers.productionErrors);
}

const server = app.listen(8000, () => console.log("Server is listening on port 5000...."));

mongoose
    .connect("mongodb://localhost:27017/whatsapp", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB Connected Successfully..."))
    .catch((error) => {
        console.log(error);
        console.log("MongoDB Connection Failed!...")
    })
;

const io = require("socket.io")(server, {
    cors: {
        origin: '*',
    }
});
const jwt = require("jwt-then");

const Message = require('./model/message');
const User    = require('./model/user.model');

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET)
        socket.userId = payload.id;
        next();
    } catch (err) {}
});

io.on('connection', (socket) => {
    console.log("Connected: " + socket.userId);

    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.userId);
    });

    socket.on("JoinRoom", ({ chatroomId }) => {
        socket.join(chatroomId);
        console.log("A user joined chatroom: " + chatroomId);
    });

    socket.on("LeaveRoom", ({ chatroomId }) => {
        socket.leave(chatroomId);
        console.log("A user left chatroom: " + chatroomId);
    });

    socket.on("ChatroomMessage", async ({ chatroomId, message }) => {

        console.log("Chatroom Message from " + chatroomId, message)

        if (message.trim().length > 0) {

            const user = await User.findOne({ _id: socket.userId });

            const newMessage = new Message({
                chatroom: chatroomId,
                user: socket.userId,
                message
            });

            io.to(chatroomId).emit("Message", {
                message,
                name: user.name,
                userId: socket.userId,
            })

            await newMessage.save();
        }
    });
});