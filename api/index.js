const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');

dotenv.config();
const app = express();

//DATABASE CONNECTION
mongoose.connect(process.env.MONGODB)
.then(() => {
    console.log('Connected to Database');
}).catch((err) => {
    console.log('Database Offline');
});

//STORE SESSION FOR AUTENTICATION TO DATABASE
let store = new MongoStore({
    uri: process.env.MONGODB,
    collection: "sessions"
});

store.on('error', function(error) {
    console.log(error);
})

//SET SESSION TIMEOUT
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    store: store,
    saveUninitialized: true,
    cookie: {
        secure: false, //Set true when use HTTPS
        maxAge: 1000*60*60*24
    }
}));

//MIDDLEWARE CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3001'
}));

app.use(express.json());
//ROUTES
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api", userRoute);

//RUNNING
app.listen(process.env.PORT, () => {
    console.log('Server Running');
});