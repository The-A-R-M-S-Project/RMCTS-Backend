const express = require("express");
const equipmentControllers = require("../controllers/Equipment");
const router = express.Router();
const authProtector = require("../auth/authProtector");
const authControllers = require("../auth/authController");
const multer = require("../middlewares/multer");

router.use(authProtector());

//============================ for only institutions ======================================
router.post(
  "/item",
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
  "/item/:id",
  authControllers.restricTo("institution"),
  equipmentControllers.deleteItem
);
router.patch(
  "/item",
  authControllers.restricTo("institution"),
  equipmentControllers.updateItem
);
router.get(
  "/bookings",
  authControllers.restricTo("institution"),
  equipmentControllers.getBookings
);
// ---- TODO ----


//========================= for all users ==========================================
router.get("/catalog", equipmentControllers.getCatalogDefault);
router.post("/search", equipmentControllers.getQueryMatch);
router.get("/item/:id", equipmentControllers.getItem);
router.post("/reservation/:id", equipmentControllers.makeReservation);
router.delete("/reservation", equipmentControllers.deleteReservation);
router.get("/reservations", equipmentControllers.getReservations);
router.patch("/image", equipmentControllers.updateItemImage)

module.exports = router;
