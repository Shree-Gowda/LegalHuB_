const mongoose = require("mongoose");
require("dotenv").config();

const DB_NAME = require("../constants.js");

let memoryServer = null; // for mongodb-memory-server in dev if no DB_URL

async function connectWithUri(uri) {
    const connectionInstance = await mongoose.connect(uri);
    console.log(`connected to DB! DB host: ${connectionInstance.connection.host}`);
}

const db_connect = async () => {
    try {
        const DB_URL = process.env.DB_URL;
        if (DB_URL) {
            await connectWithUri(`${DB_URL}/${DB_NAME}`);
        } else {
            // Fallback to in-memory Mongo for local development when DB_URL is not provided
            const { MongoMemoryServer } = require("mongodb-memory-server");
            memoryServer = await MongoMemoryServer.create();
            const memUri = memoryServer.getUri(DB_NAME);
            console.warn("DB_URL not provided — using in-memory MongoDB for development.");
            await connectWithUri(memUri);
            // expose dbClose to allow graceful shutdown including memory server
            global.dbClose = async () => {
                try {
                    await mongoose.disconnect();
                } catch {}
                try {
                    if (memoryServer) await memoryServer.stop();
                } catch {}
            };
        }
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
};

module.exports = db_connect;
