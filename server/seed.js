require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Company = require("./src/models/company");
const Customer = require("./src/models/customer");
const Invoice = require("./src/models/invoice");

const seedDataPath = path.join(__dirname, "seed-data.json");
const rawData = fs.readFileSync(seedDataPath, "utf-8");
const invoiceData = JSON.parse(rawData);

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
    await Invoice.deleteMany();
    await Customer.deleteMany();
    await Company.deleteMany();

    console.log("Old data cleared");

    for (const data of invoiceData) {
      const {
        invoiceId,
        customer,
        company,
        amount,
        taxRate,
        tax,
        total,
        status,
        issueDate,
        dueDate,
      } = data;

      let existingCompany = await Company.findOne({
        name: company,
      });

      if (!existingCompany) {
        existingCompany = await Company.create({
          name: company,
        });
      }

      let existingCustomer = await Customer.findOne({
        name: customer,
        company: existingCompany._id,
      });

      if (!existingCustomer) {
        existingCustomer = await Customer.create({
          name: customer,
          company: existingCompany._id,
        });
      }

      await Invoice.create({
        invoiceId,
        customer: existingCustomer._id,
        amount,
        taxRate,
        tax,
        total,
        status,
        issueDate,
        dueDate,
      });
    }
    console.log("Database seeded successfully");
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

seedDatabase();
