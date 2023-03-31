const mongoose = require('mongoose');

let Registeruser = new mongoose.Schema({
    username :{
        type : String,
        required : true,
    },
    email :{
        type : String,
        required : true,
        unique : true,
    },
    password :{
        type : String,
        required:true,
    },
    confirmpassword : {
        type : String,
        required : true,
    }
})

module.exports = mongoose.model('Registeruser',Registeruser)


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://prateekkash13:rhYRxNBNS2eIglOq@cluster0.ogjf2sn.mongodb.net/test";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
