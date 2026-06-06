const express = require("express");
const router = express.Router();
const {
  getCompanyById,
  createCompany,
} = require("../controllers/companyController");

router.get("/:id", getCompanyById);
router.post("/", createCompany);

module.exports = router;
