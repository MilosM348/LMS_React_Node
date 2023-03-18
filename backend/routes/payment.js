const express = require("express");
const router = express.Router();
const Controller = require("../app/api/controllers/payment");

router.post("/stripeIntent", Controller.stripeIntent);
router.post("/razorpayOrder", Controller.razorpayOrder);
module.exports = router;
