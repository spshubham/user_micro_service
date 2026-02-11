const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { checkIdempotency } = require("../utils/idempotency");

// Create User (Idempotent)
router.post(
  "/",
  checkIdempotency,
  userController.createUser
);
// Get All Users
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

module.exports = router;
