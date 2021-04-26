const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const express = require('express');

// App Setup
const app = express();

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add after body parser initialization!

// Middleware
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// All requires
require('./controllers/posts.js')(app);
require('./data/reddit-db'); // Set db


// Routes
app.get('/', (req, res) => {
    res.render('home');
})

app.listen(3000, () => {
    console.log('Reddit-Clone listening on port localhost:3000!');
});

module.exports = app;