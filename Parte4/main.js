const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
const { PORT } = require("./utils/config");
const blogsRouter = require("./routes/blogs");
const usersRouter = require("./routes/users");
const { userExtractor } = require("./utils/milddleware");
const { tokenExtractor } = require("./utils/milddleware");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(tokenExtractor); 
app.use("/api/blogs", userExtractor, blogsRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
