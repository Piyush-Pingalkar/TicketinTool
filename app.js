// const express = require('express');
// const mongoose = require('mongoose');
// const ticket = require('./models/item');
// const path = require('path');
// const app = express();
// app.set('views', __dirname + '/views')

// app.use(express.static(path.join(__dirname, 'public')));

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://piyush:piyush123@ticket.sorypmh.mongodb.net/?retryWrites=true&w=majority&appName=ticket', {})
//     .then(db => console.log('DB is connected'))
//     .catch(err => console.log(err));

// // Set EJS as the templating engine
// app.set('view engine', 'ejs');

// app.get('/', async (req, res) => {
//    res.render('login')
// });

// // Define a route to render the data
// app.get('/adminpanel', async (req, res) => {
//     try {
//         const searchQuery = req.query.search;
//         let datas;
//         if (searchQuery) {
//             const regex = new RegExp(searchQuery, 'i'); // 'i' makes it case-insensitive
//             datas = await ticket.find({
//                 $or: [
//                     { ticketId: regex },
//                     { ClientCode: regex },
//                     { mobile: regex },
//                     { department: regex },
//                     { query: regex }
//                 ]
//             });
//         } else {
//             datas = await ticket.find();
//         }
//         res.render('index', { datas });
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });




const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const ticket = require('./models/item');
const path = require('path');
const app = express();

app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://piyush:piyush123@ticket.sorypmh.mongodb.net/?retryWrites=true&w=majority&appName=ticket', {})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Configure session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Middleware to protect routes
function requireAuth(req, res, next) {
    if (req.session.loggedIn) {
        console.log("User is authenticated");
        next();
    } else {
        console.log("User is not authenticated, redirecting to login");
        res.redirect('/');
    }
}

// Login route
app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', (req, res) => {
    const { name, password } = req.body;
    const adminUsername = 'admin';
    const adminPassword = 'admin123';

    if (name === adminUsername && password === adminPassword) {
        req.session.loggedIn = true;
        console.log("Login successful, session created");
        res.redirect('/adminpanel');
    } else {
        console.log("Invalid username or password");
        res.send('Invalid username or password. Please try again.');
    }
});

// Define a route to render the data
app.get('/adminpanel', requireAuth, async (req, res) => {
    try {
        const searchQuery = req.query.search;
        let datas;
        if (searchQuery) {
            const regex = new RegExp(searchQuery, 'i'); // 'i' makes it case-insensitive
            datas = await ticket.find({
                $or: [
                    { ticketId: regex },
                    { ClientCode: regex },
                    { mobile: regex },
                    { department: regex },
                    { query: regex }
                ]
            });
        } else {
            datas = await ticket.find();
        }
        res.render('index', { datas });
    } catch (err) {
        console.log("Error fetching data:", err);
        res.status(500).send(err);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
