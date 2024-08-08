const express = require("express");
const dotenv = require("dotenv");
const voteRoutes = require("./routes/voteRoutes");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/votes", voteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
