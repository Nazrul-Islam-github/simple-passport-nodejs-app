const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users-system', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('we are connected mongoDB');
});
