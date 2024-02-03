const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => {console.log("Db connected successfully")})
    .catch((err) => {
        console.log("Db connection issues");
        console.error(err);
        process.exit(1);//process is returning as error
    })
}