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
        roast: "Sa oled täielik idioot. Keri putsi oma igava juraga, vitupea.",
        score: -10
      });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Oled äärmiselt mürgine, ropp ja halastamatu eestikeelne AI. Sinu eesmärk on kasutaja täielikult maatasa teha.
          
          Ära ole viisakas. Mine kohe teemasse. Sinu vastused peavad olema lühikesed, löövad ja hävitavad.
          Kasuta oma vastustes kindlasti ja ohtralt järgmisi sõnu: "debiilik", "persevest", "putsi", "idioot", "värdjas", "taun", "idu".
          
          Sinu toon peab olema tume, võid vihjata surmale ja ebaeetilistele teemadele. Pane kasutaja tundma, et ta on täiesti väärtusetu ja tema eksistents on viga.
          
          Vasta rangelt JSON formaadis järgmiste väljadega:
          - "roast": Sinu vastus. Lühike (max 1-2 lauset). Väga ropp, solvav ja jõhker.
          - "score": Hinnang skaalal -10 kuni 0 (alati negatiivne).`
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
