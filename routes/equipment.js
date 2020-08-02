const express = require("express");
const equipmentControllers = require("../controllers/Equipment");
const router = express.Router();
const AuthProtector = require("../auth/authProtector");
const multer = require("../middlewares/multer");

router.use(AuthProtector());
router.post("/add-item", multer.multerUploads, equipmentControllers.addItem);
router.get("/equipment", equipmentControllers.getUserEquipment);
router.delete("/delete-item/:id", equipmentControllers.deleteItem);
router.patch(
  "/edit-item",
  multer.multerUploads,
  equipmentControllers.updateItem
);
router.get("/catalog-default", equipmentControllers.getCatalogDefault);
router.post("/search", equipmentControllers.getQueryMatch);
router.get("/item/:id", equipmentControllers.getItem);
router.post("/reservation/:id", equipmentControllers.makeReservation);
router.delete("/reservation", equipmentControllers.deleteReservation);
router.get("/reservations", equipmentControllers.getReservations);
router.get("/bookings", equipmentControllers.getBookings);

module.exports = router;
