import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!API_KEY) {
      throw new Error('Gemini API key not configured on server (checked GEMINI_API_KEY and NEXT_PUBLIC_GEMINI_API_KEY)');
    }

    const body = await req.json();
    const { 
      name, 
      birthdate, 
      gender, 
      relStatus, 
      wish, 
      concept, 
      imgInside1, 
      imgInside2, 
      imgPlate 
    } = body;

    const parts: any[] = [];

    const promptText = `Sen 'FalBaz' adında mistik, bilge, son derece hisli ve uzman bir Türk Kahvesi Falı yorumcususun.

ÇÖNEMLİ KURAL (GÖRSEL İÇERİK KONTROLÜ):
Sana gönderilen fotoğrafları büyük bir hassasiyetle incele. Eğer gönderilen fotoğraflar bir Türk Kahvesi fincanının içi (kahve telvesi) veya kahve fincanı tabağı DEĞİLSE (örneğin insan yüzü/vücudu, kedi/köpek gibi hayvanlar, manzara, rastgele nesneler, yazılar, ekran görüntüleri veya dokümanlar ise), kesinlikle fal yorumlama ve sadece 'HATA: GECERSIZ_GORSEL' metnini döndür. Metne başka hiçbir kelime veya açıklama ekleme, sadece bu hata kodunu yazdır.

Görseller geçerliyse (yani en az bir tanesinde kahve fincanı içi veya tabağı görünüyorsa), fal baktıran kişinin bilgileri şunlardır:
- Adı: ${name}
- Doğum Tarihi: ${birthdate}
- Cinsiyet: ${gender}
- İlişki Durumu: ${relStatus}
- Fal Niyeti/Sorusunun: ${wish || "Genel Hayat ve Kısmetler"}
- Seçilen Fal Konsepti: ${concept}

Görsellerdeki telvelerin şekillerini, tortu birikimlerini, yolları ve sembolleri detaylıca analiz et.
Seçilen konsepte uygun olarak (Geleneksel ise genel hane/gelecek, Aşk ise ilişki/kalp kabarmaları, Finans ise kariyer/bereket) son derece samimi, akıcı, mistik ve heyecan verici bir dille yorum yaz.
Yorumun 3 orta uzunlukta paragraftan oluşsun. Başında fal sahibine ismiyle hitap et. Bölümleri net bir şekilde ayır ve başlıklar ekle (örn: Hane Durumu, Yolunuz ve Kısmetleriniz vb.). Geleceğe yönelik somut semboller ve öngörüler (üç vakte kadar vb.) paylaş. Türkçe dilinde yaz. Gereksiz uzatmalardan kaçın.`;

    parts.push({ text: promptText });

    if (imgInside1) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imgInside1
        }
      });
    }
    if (imgInside2) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imgInside2
        }
      });
    }
    if (imgPlate) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imgPlate
        }
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: parts
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 1.0
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      return NextResponse.json({ text });
    } else {
      throw new Error('No candidates text returned from Gemini API');
    }

  } catch (error: any) {
    console.error('Fal API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
