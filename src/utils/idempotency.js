const redis = require("../config/redis");

const IDEMPOTENCY_TTL = 60 * 60; // 1 hour

exports.checkIdempotency = async (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    return next();
  }
  const key = req.headers["idempotency-key"];

  if (!key) {
    return res.status(400).json({
      message: "Idempotency-Key header required",
    });
  }

  const cached = await redis.get(key);

  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  req.idempotencyKey = key;
  next();
};

exports.storeIdempotency = async (key, response) => {
  if (process.env.NODE_ENV === "test") return;

  await redis.setEx(
    key,
    3600,
    JSON.stringify(response)
  );
};

