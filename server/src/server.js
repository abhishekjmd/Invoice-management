require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connected to database");
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
