const express = require('express');
const mongoose = require('mongoose');
const ticket = require('./models/item');
const path = require('path');
const app = express();
app.set('views', __dirname + '/views')

app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://piyush:piyush123@ticket.sorypmh.mongodb.net/?retryWrites=true&w=majority&appName=ticket', {})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
   res.render('login')
});

// Define a route to render the data
app.get('/adminpanel', async (req, res) => {
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
        res.status(500).send(err);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
