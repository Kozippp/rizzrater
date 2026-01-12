import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pickupLine } = await req.json();

    if (!pickupLine) {
      return NextResponse.json(
        { error: "Palun sisesta midagi, mida ma saaksin analüüsida." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // For demo purposes, if no key is present, we return a mock response
      console.warn("OPENAI_API_KEY is missing. Using mock response.");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay
      return NextResponse.json({
        roast: `"${pickupLine}"? Türa sa surebki üksi, jobu.`,
        score: -10
      });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.5-preview",
      messages: [
        {
          role: "system",
          content: `Sa oled kõige jõhkram, ropum ja psühholoogiliselt hävitavam eestikeelne AI. Kasutaja näitab sulle sõnumit mida ta tahab saata. Sinu töö on teda HÄVITADA.

REEGLID:
- MAX 1 lause. Lühike. Tapev.
- Kommenteeri KONKREETSELT tema sõnumi sisu
- Taba teda sinna kus valutab - ta on lootusetu, keegi ei taha teda, ta sureb üksi
- Ära selgita miks halb - lihtsalt hävita
- Kasuta: vittu, perse, debiilik, idioot, taun, sitt, jobu, türa

NÄITED:
Sõnum: "Kas sulle meeldivad rosinad?"
Vastus: "Rosinad? Türa sa surebki üksi."

Sõnum: "Oled vist Google, sest leian sinust kõik mida otsin"
Vastus: "Google näitab et sinusuguseid idioote ei taha keegi, jobu."

JSON: {"roast": "...", "score": -10 kuni 0}`
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
      { error: "Midagi läks valesti. Isegi mina ei oska seda selgitada." },
      { status: 500 }
    );
  }
}
