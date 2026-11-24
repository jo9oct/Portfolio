import axios from "axios";

const sendMessage = async (req, res) => {
  try {
  
    const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!TELEGRAM_API_KEY) {
      return res.status(500).json({
        ok: false,
        code: "CONFIGURATION_ERROR",
        error: "TELEGRAM_API_KEY missing",
      });
    }

    if (!TELEGRAM_CHAT_ID) {
      return res.status(500).json({
        ok: false,
        code: "CONFIGURATION_ERROR",
        error: "TELEGRAM_CHAT_ID missing",
      });
    }
    console.log("Received request body:", req.body);
    const { name, email, subject, text, message } = req.body;

    const who = name?.trim() || "Anonymous";
    const senderEmail = email?.trim();
    const sub = subject?.trim();
    const content = (text || message)?.trim() || "";
    const stamp = new Date().toLocaleString();
    
    const bodyParts = [
      "<b>📨 New message from portfolio</b>",
      `<b>From:</b> ${escapeHtml(who)}`,
    ];

    if (senderEmail) {
      bodyParts.push(`<b>Email:</b> ${escapeHtml(senderEmail)}`);
    }
    if (sub) {
      bodyParts.push(`<b>Subject:</b> ${escapeHtml(sub)}`);
    }

    bodyParts.push(`<b>Time:</b> ${stamp}`);
    bodyParts.push("");
    bodyParts.push(escapeHtml(content));

    const body = bodyParts.join("\n");

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`,
      {
        chat_id: formatChatId(TELEGRAM_CHAT_ID),
        text: body,
        parse_mode: "HTML",
      }
    );

    return res.status(200).json({
      ok: true,
      data: response.data,
    });

  } catch (err) {
    console.error("Telegram send failed:", err.response?.data || err.message);

    const desc =
      err.response?.data?.description ||
      err.response?.data?.message ||
      err.message ||
      "unknown error";

    const code = desc.toLowerCase().includes("chat not found")
      ? "CHAT_NOT_FOUND"
      : "TELEGRAM_ERROR";

    return res.status(400).json({
      ok: false,
      code,
      error: `Telegram send failed: ${desc}`,
    });
  }
};

// helpers
function formatChatId(chatId) {
  if (/^-?\d+$/.test(chatId)) return Number(chatId);
  if (chatId.startsWith("https://t.me/")) {
    return `@${chatId.split("/").filter(Boolean).pop()}`;
  }
  return chatId;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default sendMessage;