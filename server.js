const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// App Setup
const app = express();

// Middleware
var checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken == "undefined" || req.cookies.nToken === null) {
      console.log("No valid cookie found");
      req.user = null;
    } else {
      var token = req.cookies.nToken;
      var decodedToken = jwt.decode(token, { complete: true }) || {};
      req.user = decodedToken.payload;
    }
    next();
};

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add after body parser initialization!
app.use(cookieParser());
app.use(checkAuth);


const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// All requires
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);
require('./data/reddit-db'); // Set db


// Routes
app.get('/', (req, res) => {
    res.render('home');
})

app.listen(3000, () => {
    console.log('Reddit-Clone listening on port localhost:3000!');
});

module.exports = app;