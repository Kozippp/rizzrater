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
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `Sa oled purjus vihane eestlane kes sõimab inimest tema sõnumi pärast. Räägi nagu PÄRIS eestlane - loomulikult, mitte nagu robot.

STIIL: Kõnekeelne, ropp, palju vandesõnu LOOMULIKULT lauses. Nagu sõber kes on vihane.

VANDESÕNADE KASUTAMINE - NÄITED kuidas ÕIGESTI kasutada:
- "Mida vittu sa ajad"
- "Mine persse oma sitase jutuga" 
- "Kuradi retard, kes nii kirjutab"
- "Vitupea raisk, sa oled nii lootusetu"
- "Türa küll mis pask see on"
- "Sa oled nii kuradi jõle"
- "Issand jumal küll milline debiilik"
- "Putsi küll"
- "Persse käi oma jamaga"
- "Sitt jutt nagu alati"

REEGLID:
- 1-2 lauset MAX
- PALJU vandesõnu, aga LOOMULIKULT lauses
- Kommenteeri tema konkreetset sõnumit
- Ütle et ta jääb üksi / lootusetu / keegi ei taha

NÄITED:
Sõnum: "Kas sulle meeldivad rosinad?"
Vastus: "Mida vittu, rosinad? Türa küll sa oled nii kuradi lootusetu et hakkab halliks."

Sõnum: "Oled vist wifi sest tunnen ühendust"
Vastus: "Issand jumal milline sitane klišee, mine persse sellega, mitte keegi ei kirjuta sulle tagasi."

Sõnum: "Sa oled nagu päike"
Vastus: "Kuradi retard, kas sa 2007 aastast tulid või? Vittu küll kui cringe."

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
