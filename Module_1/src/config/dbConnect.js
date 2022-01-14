import mongoose from 'mongoose';

const connectDB = () => {
    mongoose
    .connect(process.env.DB_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connected to DB!'))
    .catch((err) => {
        console.log('Connection to DB failed!');
        console.log(`Error: ${err.message}`);
        process.exit();
    });
};


export default connectDB;