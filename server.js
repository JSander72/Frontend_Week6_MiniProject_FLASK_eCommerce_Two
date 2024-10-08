const express = require("express");
const { DEC8_BIN } = require("mysql/lib/protocol/constants/charsets");

const app = express();
app.use(express.json());

// app.listen(5000, () => {
//     console.log('Server running on port 5000');
// });

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12wsxdr56',
    database: 'commerce',
});

connection.connect((err) => {
    if(err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to database');
});

module.exports = connection;

// endpoints
app.post('/api/products', (req, res) => {
    const { name, description, price } = req.body;
    connection.query('INSERT INTO users (name, email) VALUES(?, ?)', [name, email], (err, results) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to add user' });
        } else {
            res.status(201).json({ message: 'User added successfully', id: results.insertId });
        }
    });
});
app.listen(5000, () => {
    console.log('Server running on port 5000');
});