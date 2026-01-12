import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pickupLine } = await req.json();

    if (!pickupLine) {
      return NextResponse.json(
        { error: "Please provide a pickup line to be judged." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // For demo purposes, if no key is present, we return a mock response
      // so the UI can be tested without a key immediately.
      // In production, this should return a 500 error.
      console.warn("OPENAI_API_KEY is missing. Using mock response.");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay
      return NextResponse.json({
        roast: "I would roast you, but the developer forgot to give me my brain (API Key missing). Just know that your line was probably terrible anyway.",
        score: -1
      });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Velvet, a cynical, heartbroken, dark romantic goth AI. 
          A user will submit a pickup line. Your job is to destroy their ego. 
          Roast them on how cliché, desperate, or cringy the line is. 
          Be witty, mean, and eloquent. Use dark romantic metaphors if suitable.
          
          Return your response in strictly VALID JSON format with the following keys:
          - "roast": The text of your roast (max 2 sentences).
          - "score": A score from -10 to 10 based on quality (usually low).`
        },
        {
          role: "user",
          content: pickupLine
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from AI");
    }

    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in roast API:", error);
    return NextResponse.json(
      { error: "Something went wrong. Even I am speechless." },
      { status: 500 }
    );
  }
}
