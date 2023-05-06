const mongoose = require('mongoose')

const mongoURI = process.env.NEXT_PUBLIC_DATABASE_URL;
const db = mongoose.connection;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, { autoIndex: false })
        console.log('mongo connected at: ', mongoURI);
    } catch (err) {
        console.log('Error connecting to mongo', err)
    }
}

connectDB();

db.on('error', (err) => console.log(err.message + " is Mongo not running?"));
db.on('disconnected', () => console.log('mongo disconnected'));

//open connection
db.on('open', () => console.log('✅ mongo connection made!'))

module.exports = mongoose;