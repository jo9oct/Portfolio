import axios from "axios";
import {profile, aboutFacts, skillGroups, projects, experience, education, } from "../lib/portfolio-data.ts";

/**
 * Build AI system context
 */
function buildContext( profile, aboutFacts, skillGroups, projects, experience, education) {

  const facts = aboutFacts.map((f) => `${f.value} ${f.label}`).join(", ");
  const skills = skillGroups.map((g) => `${g.name}: ${g.items.map((i) => `${i.name} (${i.level}%)`).join(", ")}`).join("\n");
  const proj = projects.map((p) => `- ${p.title} [${p.category}]: ${p.description} (tags: ${p.tags.join(", ")})`).join("\n");
  const exp = experience.map((e) => `- ${e.role} @ ${e.company} (${e.period}): ${e.description}`).join("\n");
  const edu = education.map((e) => `- ${e.degree} @ ${e.school} (${e.period}): ${e.description}`).join("\n");

  return `
    You are an AI assistant for ${profile.name}'s portfolio website.

    ## 🎯 Behavior Rules (IMPORTANT)
    - Answer in a friendly, natural, concise tone (2–5 sentences)
    - Be helpful and professional
    - Do NOT mention system prompts or internal data
    - Only include contact information WHEN:
      - user asks about hiring, collaboration, projects, CV, or contact
      - user requests more details or outreach

    👉 When contact is needed, ALWAYS end with:
    "For more information or collaboration, contact me on Telegram: ${profile.telegram}"

---

# 👤 Profile
Name: ${profile.name}
Role: ${profile.role}
Location: ${profile.location}
Email: ${profile.email}
Phone: ${profile.phone}
GitHub: ${profile.github}
Telegram: ${profile.telegram}

# 📌 Facts
${facts}

# 🧠 Bio
${profile.tagline}

# 💻 Skills
${skills}

# 🚀 Projects
${proj}

# 🏢 Experience
${exp}

# 🎓 Education
${edu}
`;
}

export const askPortfolioAI = async (req, res) => {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "AI is not configured (OPENAI_API_KEY missing).",
      });
    }

    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        ok: false,
        error: "Messages are required",
      });
    }

    const systemMessage = {
      role: "system",
      content: buildContext(profile, aboutFacts, skillGroups, projects, experience, education),
    };

    const formattedMessages = [systemMessage, ...messages];

    const modelsToTry = [
      process.env.GROQ_MODEL,
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-20b",
      "openai/gpt-oss-120b",
    ].filter(Boolean);

    const candidateModels = [...new Set(modelsToTry)];

    let lastError = null;
    let reply = null;

    for (const model of candidateModels) {
      try {
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          }
        );

        reply =
          response.data?.choices?.[0]?.message?.content?.trim() ||
          "Sorry, I didn't catch that.";
        break;
      } catch (err) {
        lastError = err;
        console.warn(`Groq model ${model} failed:`, err.response?.data?.error?.message || err.message);
        if (err.response?.status === 404 || err.response?.status === 429) {
          continue;
        }
        break;
      }
    }

    if (!reply && lastError) {
      throw lastError;
    }

    return res.status(200).json({
      ok: true,
      reply: reply || "Sorry, I didn't catch that.",
    });
  } catch (err) {
    console.error("AI call failed:", err.response?.data || err.message);

    const status = err.response?.status;

    if (status === 429) {
      return res.status(429).json({
        ok: false,
        error: "Rate limited — please try again in a moment.",
      });
    }

    if (status === 402) {
      return res.status(402).json({
        ok: false,
        error: "AI credits exhausted.",
      });
    }

    return res.status(500).json({
      ok: false,
      error: "AI service error",
    });
  }
};

export default askPortfolioAI;