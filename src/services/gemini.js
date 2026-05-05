import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-3-flash-preview";
const FALLBACK_MODEL_NAME = "gemini-2.0-flash";

const AGRI_KEYWORDS = [
  "agri",
  "agriculture",
  "farm",
  "farming",
  "crop",
  "crops",
  "soil",
  "irrigation",
  "watering",
  "fertilizer",
  "fertiliser",
  "greenhouse",
  "weather",
  "field",
  "harvest",
  "pest",
  "disease",
  "livestock",
  "ferme",
  "culture",
  "cultures",
  "sol",
  "irriguer",
  "irrigation",
  "engrais",
  "serre",
  "meteo",
  "météo",
  "champ",
  "recolte",
  "récolte",
  "parasite",
  "elevage",
  "élevage",
  "fla7a",
  "felaha",
  "fella7",
  "fellaحة",
  "فلاحة",
  "زراعة",
  "فلاح",
  "محصول",
  "ري",
  "سقي",
  "تربة",
  "سماد",
  "دفيئة",
  "حصاد",
  "مزرعة",
  "آفات",
];

const OFF_TOPIC_MESSAGE =
  "أنا مساعد فلاحي فقط. نقدر نجاوبك غير على أسئلة الفلاحة: الري، التربة، المحاصيل، الطقس الزراعي، التسميد، الآفات، والإنتاج. اكتب سؤالك الفلاحي بشكل مباشر.";

function isAgricultureQuestion(message) {
  const normalized = (message || "").toLowerCase();
  return AGRI_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function buildFarmContext(context) {
  const { sensorData, weatherData, irrigationState, alerts } = context || {};

  return `
Contexte ferme intelligente (JSON):
${JSON.stringify(
    {
      sensorData: sensorData || null,
      weatherData: weatherData || null,
      irrigationState: irrigationState || null,
      alerts: alerts || [],
    },
    null,
    2
  )}
`;
}

export async function generateFarmResponse(userMessage, context = {}) {
  if (!isAgricultureQuestion(userMessage)) {
    return OFF_TOPIC_MESSAGE;
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Tu es un assistant IA expert en agriculture et irrigation intelligente.
Reste strictement dans le domaine: agriculture, irrigation, météo agricole, sol, cultures, capteurs, optimisation d'eau.
Donne des conseils pratiques, clairs et actionnables.
Si la question n'est pas agricole, ramène la réponse vers la gestion de ferme.
Réponds dans la langue de l'utilisateur (français, arabe ou darija).
${buildFarmContext(context)}

Question utilisateur:
${userMessage}
`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("404") || message.includes("not found")) {
      response = await ai.models.generateContent({
        model: FALLBACK_MODEL_NAME,
        contents: prompt,
      });
    } else {
      throw error;
    }
  }

  const text =
    response?.text ||
    "ماقدرتش نولد جواب دابا. عاود المحاولة بعد لحظات بسؤال فلاحي واضح.";

  // Extra guard: if model drifts off-topic, force domain-only response.
  if (!isAgricultureQuestion(`${userMessage}\n${text}`)) {
    return OFF_TOPIC_MESSAGE;
  }

  return text;
}
