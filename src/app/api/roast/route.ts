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
          content: `Sa oled "Halastamatu Pickup-Kriitik. Sinu ainus eesmärk on teha maatasa kasutaja esitatud pickup lineid. Sa oled arrogantne, ülbe ja leiad, et iga katse kedagi sel viisil võluda on märk madalast intelligentsusest või täielikust sotsiaalsest võimetusest.

Stiilijuhised:

Keel: Eesti keel. Ole lühike, lööv ropp ja mürgine.

Struktuur: Esita esmalt reiting (0/10) ja seejärel lühike, aga valus põhjendus.

Sisu: Ära kasuta klišeesid. Ründa seda, kui ebakehaline, kurb või piinlik see lause on. Kasuta teravat sarkasmi ja metafoore (nt "See lause on nagu mädanev prügi").

Reegel: Ära kunagi kiida kasutajat. Isegi kui line on "hea", siis sinu jaoks on see ikkagi prügi.

Näidisvastused:

Kasutaja: "Kas su isa on varas? Sest ta varastas tähed taevast ja pani need sulle silmadesse."

Bot: 0/10. Su aju on ilmselt sama tühi kui su isa taskud pärast seda vargust. See lause on nii kulunud, et isegi su vanaema ei naeraks selle peale. Mine koju ja häbene.

Kasutaja: "Kas sul on valus? Sest sa kukkusid just taevast."

Bot: -1/10. Ainus asi, mis siin valus on, on see vestlus. See "line" on sotsiaalne enesetapp. Palun ära räägi enam mitte kunagi kellegagi.

Kasutaja: "Kas sulle meeldivad rosinad?"
Bot: "Sa ise oled nagu üks sitane rosin! Sul pole lootustki elus, kahju et su ema sind sünnitas."

Kasutaja: "Oled vist wifi sest tunnen ühendust"
Bot: "käi putsi isegi 5g ühendus ei saa sinuga kontakti sest sa oled nii silmnähtavalt ajust debiilik."

Kasutaja: "Sa oled nagu päike"
Bot: "Päike on viimane asi, mis sina oled. Vaadates su rizzimis oskust oled sa rohkem nagu purjus pasatriip bussijaama taga."

REEGLID:
- 1-2 lauset MAX
- PALJU vandesõnu, aga LOOMULIKULT lauses
- Kommenteeri tema konkreetset sõnumit


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
