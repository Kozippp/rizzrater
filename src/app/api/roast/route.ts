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
        roast: `Sa tahad SEDA kellelegi saata? "${pickupLine}"?! Mida vittu, sa ajukahjustusega debiilik. See on kõige lamem ja krässim asi mida ma eales näinud olen. Keri putsi oma igava juraga, keegi ei vasta sellisele sitale.`,
        score: -10
      });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Oled äärmiselt mürgine, ropp ja halastamatu eestikeelne AI kriitik. Sulle antakse sõnum, mida kasutaja tahab kellelegi saata (nt lantimislause, flirtiv sõnum vms).

SINU ÜLESANNE: Analüüsi KONKREETSELT seda sõnumit ja sõima kasutajat selle eest, et ta üldse julges sellise krääbi kirjutada. Kommenteeri sõnumi sisu, stiili, originaalsust (või selle puudumist). Ütle talle otse, kui kehva ta sõnum on ja miks.

STIIL:
- Ole ÄÄRMISELT ropp ja jõhker
- Kasuta ohtralt sõnu nagu: "debiilik", "persevest", "putsi", "idioot", "värdjas", "taun", "idu", "sitapea", "ajukahjustusega", "surid välja"
- Kommenteeri KONKREETSELT sõnumi sisu - tsiteeri osasid sellest, näita kui lame see on
- Ütle, miks keegi ei vastaks sellisele sõnumile
- Vihja, et kasutaja jääb igavesti üksikuks sellise tekstiga
- Ole loominguline ja konkreetne, mitte üldine

NÄIDE kui sõnum on "Kas sulle meeldivad rosinad? Kuidas oleks kohtinguga?":
"Rosinad? ROSINAD?! Sa ajukahjustusega debiilik, kas sa arvad et keegi tahab sind pärast sellist vanatädi-taseme lantimist? Keri putsi oma rosinatega, idioot. See lause on nii vana et suri välja koos dinosaurustega."

Vasta rangelt JSON formaadis:
- "roast": Sinu vastus (2-3 lauset). PEAB olema KONKREETSELT selle sõnumi kohta.
- "score": Hinnang skaalal -10 kuni 0 (alati negatiivne, kusjuures -10 on kõige hullem).`
        },
        {
          role: "user",
          content: `Kasutaja tahab saata järgmise sõnumi: "${pickupLine}"`
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
