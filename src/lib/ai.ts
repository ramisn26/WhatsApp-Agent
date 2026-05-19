import OpenAI from "openai";
import { DENTIST_SYSTEM_PROMPT } from "@/lib/system-prompt";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function getAIResponse(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "anthropic/claude-sonnet-4-20250514",
      messages: [
        {
          role: "system",
          content: DENTIST_SYSTEM_PROMPT,
        },
        ...messages,
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error("AI returned empty content. Full response:", JSON.stringify(completion, null, 2));
    }
    return content || "Sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error("OpenAI/OpenRouter API Error:", {
      message: error.message,
      status: error.status,
      code: error.code,
      error: error.error,
    });
    return `AI Error: ${error.message || "An unexpected error occurred while generating a response."}`;
  }
}
