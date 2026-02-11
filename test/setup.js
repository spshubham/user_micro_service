const mongoose = require("mongoose");
const { MongoMemoryServer } =
  require("mongodb-memory-server");

let mongo;

async function connectTestDB() {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
}

async function closeTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();

  // Force exit safety (optional)
  if (process.env.NODE_ENV === "test") {
    process.exit(0);
  }
}

module.exports = {
  connectTestDB,
  closeTestDB,
};
