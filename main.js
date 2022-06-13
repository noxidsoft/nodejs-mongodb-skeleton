const { MongoClient } = require('mongodb');

// if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
// }

async function main() {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgckh.mongodb.net/?retryWrites=true&w=majority`;

    const client = new MongoClient(uri);

    try {
        await client.connect();

        // List databases
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
        // await findOneListingByName(client, "Lovely Loft C");

        // Read/find many items
        // await findListingsWithMinimumBedroomsAndMostRecentReviews(client, {
        //     minimumNumberOfBedrooms: 4,
        //     minimumNumberOfBathrooms: 2,
        //     maximumNumberOfResults: 5
        // });

        // Update first listing by name
        // await updateListingByName(client, "Lovely Loft C", {bedrooms: 6, beds: 8});

        // Upsert listing by name
        // await upsertListingByName(client, "Cozy Cottage", {name: "Cozy Cottage", bedrooms: 4, bathrooms: 2});

        // Update all listings so they have a property type
        await updateAllListingsToHavePropertyType(client);

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

// Read/find many items
async function findListingsWithMinimumBedroomsAndMostRecentReviews(client, {
    minimumNumberOfBedrooms = 0,
    minumumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: { $gte: minimumNumberOfBedrooms },
        bathrooms: { $gte: minumumNumberOfBathrooms }
    })
        .sort({ last_review: -1 })
        .limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    // Print the results
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minumumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minumumNumberOfBathrooms} bathrooms`);
    }
}

// Update first listing by name
async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name: nameOfListing}, {$set:updatedListing});

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);
}

// Upsert listing by name
async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name: nameOfListing}, {$set: updatedListing}, {upsert: true});

    console.log(`${result.matchedCount} document(s) matched the query criteria`);

    if(result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} document(s) were/was updated`);
    }
}

// Update all listings so they have a property type
async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({property_type: {$exists: false}}, {$set: {property_type: "Unknown" }});
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}