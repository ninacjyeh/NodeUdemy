const express = require("express");
const tourController = require("./../controllers/tourControllers");

const router = express.Router();

// 中間件
router.param("id", tourController.checkID);

router
  .route("/")
  .get(tourController.getALLTours)
  .post(tourController.createTour);
router
  .route("/:id/:x?")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
