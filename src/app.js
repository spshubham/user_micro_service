const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const { connectMQ } = require("./config/mq");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const client = require("./config/metrics");

const userRoutes = require("./routes/user.routes");

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(errorHandler);

// DB
if (process.env.NODE_ENV !== "test") {
  connectDB();
  connectMQ();
}
// Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("User Service Running 🚀");
});
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT, () => {
    logger.info(
      `Server running on port ${process.env.PORT}`
    );
  });
}

module.exports = app;


