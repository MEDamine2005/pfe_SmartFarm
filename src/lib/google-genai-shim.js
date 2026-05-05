class GoogleGenAI {
  constructor({ apiKey } = {}) {
    this.apiKey = apiKey;
    this.models = {
      generateContent: this.generateContent.bind(this),
    };
  }

  async generateContent({ model, contents }) {
    if (!this.apiKey) {
      throw new Error("GoogleGenAI API key is missing");
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: contents }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("\n")
        .trim() || "";

    return { text };
  }
}

export { GoogleGenAI };
