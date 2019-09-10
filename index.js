require('express-async-errors');
const express = require('express');
const app = express();
const morgan = require('morgan')
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const error = require('./middleware/error');
const users = require('./routes/users');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('combined'))
app.use('/api/users', users);
app.use(error);

mongoose.connect('mongodb://localhost:27017/devi', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log('We are connected to DB.'))
    .catch(err => console.log(`We are NOT connected to DB.Error: ${err}`));

app.listen(port, () => console.log(`Server is on port: ${port}`));