const mongoose = require("mongoose");
const User = require("../models/user.model");
const redis = require("../config/redis");
const { publishEvent } = require("../config/mq");

const USERS_CACHE_KEY = "users:all";
exports.createUser = async (data) => {
  // ✅ TEST MODE — no transaction
  if (process.env.NODE_ENV === "test") {
    const createdUser = await User.create(data);
    return createdUser;
  }

  // ✅ PROD MODE — transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.create([data], { session });

    await session.commitTransaction();
    session.endSession();

    const createdUser = user[0];

    // Publish Event
    publishEvent({
      event: "USER_CREATED",
      data: createdUser,
      timestamp: new Date(),
    });

    // Cache invalidation
    await redis.del("users:all");
    await redis.del(`users:id:${createdUser._id}`);

    return createdUser;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};


exports.getAllUsers = async () => {
  // 1️⃣ Check Cache
  const cached = await redis.get(USERS_CACHE_KEY);

  if (cached) {
    console.log("Serving from Redis Cache ⚡");
    return JSON.parse(cached);
  }

  // 2️⃣ Fetch from DB
  const users = await User.find().lean();

  // 3️⃣ Store in Cache
  if (process.env.NODE_ENV !== "test") 
    await redis.setEx(
    USERS_CACHE_KEY,
    60, // TTL 60 sec (configurable)
    JSON.stringify(users),
  );

  return users;
};

exports.getUserById = async (id) => {
  const cacheKey = `users:id:${id}`;

  // 1️⃣ Check Redis
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("Serving User from Cache ⚡");
    return JSON.parse(cached);
  }

  // 2️⃣ Fetch from DB
  const user = await User.findById(id).lean();

  if (!user) return null;

  // 3️⃣ Store in Cache
  if (process.env.NODE_ENV !== "test") await redis.setEx(
    cacheKey,
    300, // TTL 5 min
    JSON.stringify(user),
  );

  return user;
};
