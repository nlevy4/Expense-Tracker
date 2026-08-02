require("dotenv").config();
const express = require("express");
const cors = require("cors");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const accountRoutes = require("./routes/accountRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// serverless-http pre-populates req.body as a raw Buffer in Netlify's
// production runtime, which makes express.json() skip parsing it (it only
// parses when req.body is still undefined). Parse it ourselves when that
// happens so route handlers always see a plain object.
app.use((req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = req.body.length ? JSON.parse(req.body.toString("utf-8")) : {};
    } catch (error) {
      req.body = {};
    }
  }
  next();
});

app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/data", dataRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
