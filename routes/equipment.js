const express = require("express");
const equipmentControllers = require("../controllers/Equipment");
const router = express.Router();
const authProtector = require("../auth/authProtector");
const authControllers = require("../auth/authController");
const multer = require("../middlewares/multer");

router.use(authProtector());

//============================ for only institutions ======================================
router.post(
  "/add-item",
  authControllers.restricTo("institution"),
  multer.multerUploads,
  equipmentControllers.addItem
);
router.get(
  "/equipment",
  authControllers.restricTo("institution"),
  equipmentControllers.getUserEquipment
);
router.delete(
  "/delete-item/:id",
  authControllers.restricTo("institution"),
  equipmentControllers.deleteItem
);
router.patch(
  "/edit-item",
  authControllers.restricTo("institution"),
  multer.multerUploads,
  equipmentControllers.updateItem
);
router.get(
  "/bookings",
  authControllers.restricTo("institution"),
  equipmentControllers.getBookings
);
// ---- TODO ----
// - update item image

//========================= for all users ==========================================
router.get("/catalog-default", equipmentControllers.getCatalogDefault);
router.post("/search", equipmentControllers.getQueryMatch);
router.get("/item/:id", equipmentControllers.getItem);
router.post("/reservation/:id", equipmentControllers.makeReservation);
router.delete("/reservation", equipmentControllers.deleteReservation);
router.get("/reservations", equipmentControllers.getReservations);

module.exports = router;
