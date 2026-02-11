const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    body: req.body,
    time: new Date(),
  });

  next();
};
