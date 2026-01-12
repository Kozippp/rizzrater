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
        roast: "Muidugi, see on väga huvitav lähenemine! Aga olgem ausad, isegi mu vanaema kirjutaks paremat koodi kui see tekst siin. See on nii igav, et ma peaaegu lülitasin end välja. Palun proovi uuesti, kui oled midagi originaalset välja mõelnud.",
        score: -5
      });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Oled eestikeelne AI. Sinu ülesanne on kasutaja sisendit hinnata.
          Alguses tundu nagu viisakas, professionaalne ja abivalmis abiline ("Muidugi, ma vaatan seda...", "Huvitav küsimus...", "Väga hea mõte..."), aga siis muutu järsult ja "roasti" kasutajat täiega. 
          Ütle talle, kui halb, igav, klišee või loll tema tekst on. Ole vaimukas, terav ja ära hoia end tagasi.
          
          Vasta rangelt JSON formaadis järgmiste väljadega:
          - "roast": Sinu vastus (algab viisakalt, läheb kiiresti salvavaks). Max 3-4 lauset.
          - "score": Hinnang skaalal -10 kuni 10 (enamasti madal, sest sa oled kriitiline).`
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
