const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Backend OK" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/presensi", require("./routes/presensi"));
app.use("/api/reports", require("./routes/reports"));

const PORT = 3001;
app.listen(PORT, () => console.log(`Running http://localhost:${PORT}`));
