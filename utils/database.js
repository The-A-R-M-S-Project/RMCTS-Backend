// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _db;

// const connectMongo = callback => {
//     MongoClient.connect(
//         'mongodb+srv://ben-wycliff:9UwETeTDtrG5zg7K@rctms-qwi1m.mongodb.net/rmcts?retryWrites=true&w=majority'
//         )
//         .then( client =>{
//             console.log('Connected!');
//             _db = client.db()
//             callback(client);
//         })
//         .catch( err => {
//             console.log(err);
//             throw err;
//         })
// }

// const getDB = () => {
//     if(_db){
//         return _db
//     }
//     else{
//         throw "No database found"
//     }
// }

// exports.connectMongo = connectMongo
// exports.getDB = getDB