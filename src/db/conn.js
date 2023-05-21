const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/userRegistration');
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - ',err));