var express = require('express');
const path = require('path')
var router = require('./router/router.js');
const bodyparser = require("body-parser")
const session = require('express-session');
const db = require('./Connect.js');
const MySQLStore = require('express-mysql-session')(session)

port = 8000;
var app = express();

const sessionStore = new MySQLStore(
    {
        expiration : 24 * 60 * 60 * 1000,
        clearExpired: true,
        createDatabaseTable: true,
    },  db
)
app.use(session({
    secret: 'rahasia',
    store: sessionStore,
    saveUninitialized: true,
    resave: true
}))

app.set("view engine", "ejs");
app.set("views", "views");

// untuk menghubungkan folder dengan folder public dan untuk mengakses folder public
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if(path.endsWith('.css')){
            res.setHeader("Content-Type", "text/css")
        } else if (path.endsWith('.js')){
            res.setHeader("Content-Type", "application/javascript")
        }
    }
}))
// untuk menjalankan req body 
app.use(bodyparser.urlencoded({ extended: true}))

app.use(router);

app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}`);
});