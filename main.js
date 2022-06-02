const { MongoClient } = require('mongodb');

// if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
// }

async function main() {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgckh.mongodb.net/?retryWrites=true&w=majority`;

    const client = new MongoClient(uri);

    try {
        await client.connect();

        // function calls
        await listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");

    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}