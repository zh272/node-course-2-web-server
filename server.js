const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// if process.env.PORT doesn't exist, use 3000 for localhost
const port = process.env.PORT || 3000; 
var app = express();

// let hbs add support for Partials (reusable chunks of code)
hbs.registerPartials(__dirname+'/views/partials');

// key: thing to be set, value: value to be used
app.set('view engine', 'hbs');

// middlewares are executed in the order of calls of app.use()
// next: tell express when this logger middleware is done
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next(); // application continues only when next() is called
});

// // register a maintenance middleware for express
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

// setup static directory, without providing custom route for
// every single file.
app.use(express.static(__dirname+'/public'));



// hbs helpers: run js code from inside hbs template
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
    // return 'test'
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

// register a http route handler for GET requests
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name: 'Andrew',
    //     likes: [
    //         'Biking',
    //         'Cities'
    //     ]
    // });
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website',
        currentYear: new Date().getFullYear()
    });
});

app.get('/about', (req, res) => {
    // res.send('About Page');
    res.render('about.hbs', {
        pageTitle: 'About Page',
        currentYear: new Date().getFullYear()
    });
});

// /bad -send back json with errorMessage
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

// listen to requests
app.listen(port,() => {
    console.log(`Server is up on port ${port}`);
}); // common port for developping locally
