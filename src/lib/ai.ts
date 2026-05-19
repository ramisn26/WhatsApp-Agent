import OpenAI from "openai";
import { DENTIST_SYSTEM_PROMPT } from "@/lib/system-prompt";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function getAIResponse(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const modelSequence = [
    process.env.AI_MODEL || "anthropic/claude-3-haiku",
    "anthropic/claude-3.5-sonnet",
    "anthropic/claude-3-sonnet",
    "google/gemini-pro-1.5"
  ];

  async function callModel(model: string) {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: DENTIST_SYSTEM_PROMPT,
        },
        ...messages,
      ],
    });
    return completion.choices[0]?.message?.content;
  }

  for (let i = 0; i < modelSequence.length; i++) {
    const currentModel = modelSequence[i];
    try {
      console.log(`Attempting AI response with model: ${currentModel} (Attempt ${i + 1}/${modelSequence.length})`);
      const content = await callModel(currentModel);

      if (content && content.trim() !== "") {
        return content;
      }
      console.warn(`Model ${currentModel} returned empty content.`);
    } catch (error: any) {
      console.error(`Model ${currentModel} failed:`, {
        message: error.message,
        status: error.status,
      });
      // Continue to the next model in the sequence
    }
  }

  return "Sorry, I'm having trouble connecting to my AI brain right now. Please try again in a few minutes!";
}
