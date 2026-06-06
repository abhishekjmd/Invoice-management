const express = require("express");
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
} = require("../controllers/customerController");
const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);

module.exports = router