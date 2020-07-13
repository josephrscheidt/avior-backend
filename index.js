const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

require('custom-env').env('production');
const cors = require('cors');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin:"*"}));

var api = require('./routes/')(app);

// app.listen(process.env.PORT, () => console.log('Server started at port : ' + process.env.PORT));

/*
* This code runs  the server on local host
* Uses port 5000
*/
// const PORT = 3000;
const  PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Connected: 200 Ok'));
app.listen(PORT, console.log(`Server started on ${PORT}`));
