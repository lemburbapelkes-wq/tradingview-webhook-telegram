import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post("/webhook", async (req, res) => {
  console.log("Received request from TradingView:", req.body);

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
    res.status(500).send("Error sending message to Telegram");
  }
});

app.get("/", (req, res) => {
  res.send("TradingView Webhook Server Active!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
