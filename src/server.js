const express = require("express");
const { handleUssd } = require("./ussd");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*
 * Home / status endpoint
 *
 * Visit:
 * https://your-render-url.onrender.com/
 *
 * to check that the HerSpace backend is running.
 */
app.get("/", (_req, res) => {
  res.json({
    service: "HerSpace USSD",
    status: "ok",
    webhook: "POST /ussd",
    demoCode: process.env.DEMO_CODE || "*700*123#"
  });
});

/*
 * Health check
 *
 * Render can use this endpoint to check whether
 * the service is healthy.
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

/*
 * USSD webhook
 *
 * Africa's Talking will send USSD requests here.
 */
app.post("/ussd", (req, res) => {
  try {
    const response = handleUssd({
      sessionId: req.body.sessionId || "demo-session",
      serviceCode: req.body.serviceCode || "",
      phoneNumber: req.body.phoneNumber || "",
      text: req.body.text || ""
    });

    res
      .type("text/plain")
      .send(response);

  } catch (error) {

    console.error("USSD error:", error);

    res
      .status(500)
      .type("text/plain")
      .send(
        "END Sorry, HerSpace is temporarily unavailable. Please try again later."
      );
  }
});

/*
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`HerSpace USSD listening on port ${PORT}`);
});

module.exports = app;
