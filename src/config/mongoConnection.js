const mongoose = require('mongoose')

const mongoURI = process.env.NEXT_PUBLIC_DATABASE_URL;
const db = mongoose.connection;

mongoose.connect(mongoURI, { autoIndex: false })

db.on('error', (err) => console.log(err.message + " is Mongod not running?"));
db.on('connected', () => console.log('mongo connected at: ', mongoURI));
db.on('disconnected', () => console.log('mongo disconnected'));

//open connection
db.on('open', () => console.log('✅ mongo connection made!'))

module.exports = mongoose;