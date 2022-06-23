const express = require("express");
const path = require('path');
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const authRouter = require("./routes/auth/auth.route");
const parkingRouter = require("./routes/parkings/parkings.router");
const reservationRouter = require("./routes/reservations/reservations.router");
const ratingRouter = require("./routes/rating/rating.router");

// Configure dotenv
dotenv.config({
    path: ".env"
})

const app = express();
app.set("port", process.env.PORT || 3000) ;
app.use('images/parkings',express.static(path.join(__dirname,'uploads/images/parkings/')));
app.use(express.static('uploads'));
app.use('qr/reservations',express.static('uploads/images/reservations'));

// Parse data as json
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Parking API is up and running")
})

//// Apply routers
//app.use('/api/notification' , require('./routes/locataire/notificationLoc.route')) ;
app.use(authRouter);
app.use('/api/parkings',parkingRouter);
app.use('/api/reservations',reservationRouter);
app.use('/api/rating',ratingRouter);

app.listen(app.get("port"), () => {
    console.log(`App is served under ${app.get("port")} port`);
})
