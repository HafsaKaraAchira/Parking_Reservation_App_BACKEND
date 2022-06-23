const router = require("express").Router();
const ratingController = require("../../controllers/rating/rating.controller");

// Get rating by id
router.post("/rate", ratingController.rateParking);

module.exports = router;