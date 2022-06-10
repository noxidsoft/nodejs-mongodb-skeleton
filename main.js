const { MongoClient } = require('mongodb');

// if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
// }

async function main() {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgckh.mongodb.net/?retryWrites=true&w=majority`;

    const client = new MongoClient(uri);

    try {
        await client.connect();

        //List databases
        // await listDatabases(client);

        // *** function calls CRUD + L

        // Create single record
        // await createListing(client,
        //     {
        //         name: "Lovely Loft",
        //         summary: "A charming loft in central Sydney",
        //         bedrooms: 1,
        //         bathrooms: 1
        //     }
        // );

        // Create multiple records
        // await createMultipleListings(client,
        //     [
        //         {
        //             name: "Lovely Loft A",
        //             summary: "A charming loft in central Sydney",
        //             bedrooms: 2,
        //             bathrooms: 2
        //         },
        //         {
        //             name: "Lovely Loft B",
        //             summary: "A charming loft in central Sydney",
        //             bedrooms: 3,
        //             bathrooms: 2
        //         },
        //         {
        //             name: "Lovely Loft C",
        //             summary: "A charming loft in central Sydney",
        //             bedrooms: 4,
        //             bathrooms: 1,
        //             beds: 7,
        //             last_review: new Date()
        //         }
        //     ]
        // );

        // Read one(1) item by name
        await findOneListingByName(client, "Lovely Loft C");

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

// List databases
async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");

    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}

// Create single record
async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);
}

// Create multiple records
async function createMultipleListings(client, newListings) {
    const results = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${results.insertedCount} new listings created with the following id(s):`);
    console.log(results.insertedIds);
}

// Read one(1) item by name - only returns the first item found, even if more exist
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name ${nameOfListing}`);
        console.log(result);
    } else {
        console.log(`No listing found with the name of ${nameOfListing}`);
    }
}