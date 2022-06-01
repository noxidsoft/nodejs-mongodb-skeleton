const { MongoClient } = require('mongodb');

// if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
// }

async function main() {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgckh.mongodb.net/?retryWrites=true&w=majority`;

    const client = new MongoClient(uri);

    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);