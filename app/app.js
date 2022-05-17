const express = require("express");
const dotenv = require("dotenv")
const bodyParser = require("body-parser")

//const authRouter = require("./routes/auth/auth.router");
const parkingRouter = require("./routes/parkings/parkings.router");

// Configure dotenv
dotenv.config({
    path: ".env"
})

const app = express();
app.set("port", process.env.PORT || 3000) ;
app.use(express.static('uploads'));

// Parse data as json
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Parking API is up and running")
})

//// Apply routers
//services.use('/api/notification' , require('./routes/locataire/notificationLoc.route')) ;
//services.use(authRouter);
app.use('/api/parkings',parkingRouter);

//const mqtt = require("mqtt");

app.listen(app.get("port"), () => {
    console.log(`App is served under ${app.get("port")} port`);
})
