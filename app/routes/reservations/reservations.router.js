const router = require("express").Router();
const reservationController = require("../../controllers/reservations/reservations.controller");

// Get all reservations
router.get("/all", reservationController.getAllReservations);

// Get reservation by id
router.get("/:id", reservationController.getReservationById);

router.post("/reserve", reservationController.reserve);

module.exports = router;