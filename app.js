const express = require("express");
const userRouter = require("./router/userRouter");
const bookRouter = require("./router/bookRouter");
const session = require("express-session")

const app = express()

app.use(express.static("./public"))
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "766dd491d5d301c38a7f3b4cb5e38c29f6bd9c554cdd8b16b7b97d6fb05e6b76",
    resave: true,
    saveUninitialized: true
}));

app.use(userRouter)
app.use(bookRouter)

app.listen(3000, () => {
    console.log("Connecté sur le port 3000");
})