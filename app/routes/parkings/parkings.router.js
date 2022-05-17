const router = require("express").Router();
const parkingController = require("../../controllers/parkings/parkings.controller");

// Get all parkings
router.get("/all", parkingController.getAllParkings);

// Get parking by id
router.get("/:id", parkingController.getParkingById);

module.exports = router;