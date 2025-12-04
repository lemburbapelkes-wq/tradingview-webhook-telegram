import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// === ENV VARS FROM RAILWAY ===
const TELEGRAM_BOT_TOKEN = process.env.TG_TOKEN;
const TELEGRAM_CHAT_ID = process.env.CHAT_ID;

// === MAIN WEBHOOK ENDPOINT ===
app.post("/webhook", async (req, res) => {
  console.log("Received TradingView Webhook:", req.body);

  const msg = `
📊 *TradingView Signal*
Symbol: ${req.body.ticker}
Condition: ${req.body.condition}
Time: ${req.body.time}
Price: ${req.body.price}
`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: msg,
        parse_mode: "Markdown",
      }
    );

    res.status(200).send("OK");
  } catch (err) {
    console.error("Telegram Error:", err.message);
    res.status(500).send("Telegram send error");
  }
});

// STATUS CHECK
app.get("/", (req, res) => {
  res.send("TradingView Webhook Server Active!");
});

// === IMPORTANT: PORT FOR RAILWAY ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

