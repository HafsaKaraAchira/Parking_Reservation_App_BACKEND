const authController = require("../../controllers/auth/auth.controller")
// Create express router
const router = require("express").Router();

// Authenticate clients
router.post("/login", authController.login);

// Register new user
router.post("/signup", authController.signUp);


// export default router;
module.exports = router;
