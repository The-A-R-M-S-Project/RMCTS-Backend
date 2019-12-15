const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectMongo = callback =>{
    MongoClient.connect(
        'mongodb+srv://ben-wycliff:9UwETeTDtrG5zg7K@rctms-qwi1m.mongodb.net/test?retryWrites=true&w=majority'
        )
        .then( client =>{
            console.log('Connected!');
            callback(client)
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = connectMongo