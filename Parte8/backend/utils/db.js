require("dotenv").config();
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) =>
    console.error("Error conectando a MongoDB:", error.message)
  );
