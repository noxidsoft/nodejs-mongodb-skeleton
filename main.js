const { MongoClient } = require('mongodb');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

async function main() {
    const uri = "mongodb+srv://admin:<password>@cluster0.jgckh.mongodb.net/?retryWrites=true&w=majority";
}