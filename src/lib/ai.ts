import OpenAI from "openai";
import { DENTIST_SYSTEM_PROMPT } from "@/lib/system-prompt";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function getAIResponse(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const primaryModel = process.env.AI_MODEL || "anthropic/claude-3-haiku";
  const fallbackModel = "anthropic/claude-3.5-sonnet";

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

  try {
    console.log(`Attempting AI response with model: ${primaryModel}`);
    let content = await callModel(primaryModel);

    if (!content || content.trim() === "") {
      console.warn(`Primary model ${primaryModel} returned empty content. Trying fallback: ${fallbackModel}`);
      content = await callModel(fallbackModel);
    }

    if (!content || content.trim() === "") {
      console.error("Both primary and fallback models returned empty content.");
    }

    return content || "Sorry, I couldn't generate a response. Please try again in a moment.";
  } catch (error: any) {
    console.error("AI Generation Error:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });
    return `AI Error: ${error.message || "An unexpected error occurred."}`;
  }
}
