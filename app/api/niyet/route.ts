import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!API_KEY) throw new Error('API key not configured (checked GEMINI_API_KEY and NEXT_PUBLIC_GEMINI_API_KEY)');
    
    const body = await req.json();
    const { category, intention, age, cardName, marital, gender, ritualType } = body;

    let prompt = "";
    if (ritualType) {
      prompt = `Sen bir niyet kağıdı dökme ritüeli uygulamasının yapay zekasısın.
Kullanıcı bir kağıda dileğini/niyetini yazdı ve onu evrene göndermek için şu yöntemi seçti: "${cardName}".

Kullanıcının Niyeti: "${intention}"

Şimdi şu iki şeyi oluştur:

1. NİYET MESAJI: Kullanıcının niyetine ve seçtiği ritüel yöntemine ("${cardName}") özel, pozitif, son derece motive edici, şiir tadında ve derin anlamı olan kısa bir niyet yorumu yaz. Tam olarak 2 satır olsun. Bu ritüelin (örneğin yakma, suya bırakma, yastık altı, tütsüleme) niyetinin enerjisini nasıl serbest bıraktığına veya bilinçaltına nasıl yerleştiğine değin.

2. GÜNÜN TAVSİYESİ: Günlük hayata dokunan, bu niyet ve seçilen ritüel ile uyumlu, sıcak, samimi ve uygulanabilir tek cümlelik bir tavsiye yaz.

MUTLAKA bu formatta cevap ver, başka hiçbir şey yazma:
NIYET: [mesaj satır 1]
[mesaj satır 2]
TAVSIYE: [tavsiye cümlesi]`;
    } else {
      prompt = `Sen bir niyet falı uygulamasının yapay zekasısın. Kullanıcı bilgileri:
- Kategori: ${category}
- Niyet: ${intention}
- Yaş: ${age}
- Medeni durum: ${marital || 'Belirtilmedi'}
- Cinsiyet: ${gender || 'Belirtilmedi'}
- Çekilen kart: ${cardName}

Şimdi iki ayrı şey üret:

1. NİYET MESAJI: Kullanıcıya özel, pozitif, motive edici, insanların mutlu olup başkasıyla paylaşmak isteyeceği, şiir tadında kısa bir niyet mesajı yaz. Tam olarak 2 satır olsun. Aşk, sağlık, mutluluk, seyahat, para, iş, aile, hobiler, mülk, arkadaşlık, gelecek gibi konularda olabilir. Kategoriye uygun olsun. Kişiye özel hissettir.

2. GÜNÜN TAVSİYESİ: Günlük hayata dokunan, sıcak, samimi ve uygulanabilir tek cümlelik bir tavsiye yaz.

MUTLAKA bu formatta cevap ver, başka hiçbir şey yazma:
NIYET: [mesaj satır 1]
[mesaj satır 2]
TAVSIYE: [tavsiye cümlesi]`;
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${API_KEY}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 1.2,
          maxOutputTokens: 200
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error('Niyet API Error:', error.message);
    return NextResponse.json({ error: `API Hatası: ${error.message}` }, { status: 500 });
  }
}
