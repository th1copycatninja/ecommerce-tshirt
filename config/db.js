const mongoose = require('mongoose');

const mongoDbConnect = () =>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(console.log("db is conneted"))
    .catch(err => console.error("Db connection issue",err));
}

module.exports = mongoDbConnect