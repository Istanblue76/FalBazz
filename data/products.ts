export interface Product {
   id: string;
   name: string;
   subName: string;
   price: string;
   description: string;
   folderPath: string;
   themeColor: string;
   gradient: string;
   features: string[];
   stats: { label: string; val: string }[];
   section1: { title: string; subtitle: string };
   section2: { title: string; subtitle: string };
   section3: { title: string; subtitle: string };
   section4: { title: string; subtitle: string };
   detailsSection: { title: string; description: string; imageAlt: string };
   freshnessSection: { title: string; description: string };
   buyNowSection: {
       price: string;
       unit: string;
       processingParams: string[];
       deliveryPromise: string;
       returnPolicy: string;
   };
}

export const products: Product[] = [
   {
       id: "klasik",
       name: "Geleneksel Telve Falı",
       subName: "Hanenize doğan güneş.",
       price: "₺150",
       description: "Detaylı hane yorumu - Gelecek yolları - Üç vakte kadar şanslar",
       folderPath: "/assets/turk-kahvasi_frames",
       themeColor: "#e9c349", // Celestial Gold
       gradient: "linear-gradient(135deg, #3e2723 0%, #131408 100%)", // primary-container to background
       features: ["Detaylı Hane Yorumu", "Gelecek Yolları Analizi", "Kısmet Haritası"],
       stats: [{ label: "Hane İçi", val: "Aydınlık" }, { label: "Yollar", val: "Açık" }, { label: "Kısmet", val: "%100" }],
       section1: { title: "Geleneksel Telve.", subtitle: "Hanenize doğan güneş." },
       section2: { title: "Fincanın derin fısıltısı.", subtitle: "Közde pişen kahvenizin telveleriyle, geleceğinize ayna tutan geleneksel sembollerin analizi." },
       section3: { title: "Gelecek ve kısmet yolları.", subtitle: "Hanenizi çevreleyen yollar, karşılaşacağınız sürprizler ve üç vakte kadar yaşanacak ferahlıklar." },
       section4: { title: "Gerçek hisler, derin tecrübe.", subtitle: "" },
       detailsSection: {
           title: "Telve Kültürünün Kadim Sırları",
           description: "Klasik yorumumuz, yüzyıllara dayanan Türk kahvesi falı sembollerini derin bir sezgiyle çözümler. Fincan tabanındaki yollar, kabaran hisler ve hanenize doğacak olan aydınlıklar tek tek incelenir. Bu, kahve kültürünün en saf ve geleneksel halidir.",
           imageAlt: "Klasik Telve Detayları"
       },
       freshnessSection: {
           title: "Köz Ateşinden Kehanete",
           description: "Kahvenin piştiği andan fincanın soğuma sürecine kadar her an, telvenin şekillenmesini belirler. Biz de fincanın soğuma hızı, süzülen damlalar ve tortuların oluşturduğu eşsiz figürleri analiz ederek en samimi ve isabetli öngörüleri sunuyoruz."
       },
       buyNowSection: {
           price: "₺150",
           unit: "yorum başına",
           processingParams: ["Detaylı Analiz", "Sesli Kayıt Seçeneği", "Geleneksel Metot"],
           deliveryPromise: "Kahve falı yorumunuz en geç 15 dakika içerisinde e-posta adresinize ve telefonunuza teslim edilir.",
           returnPolicy: "Memnun kalmadığınız takdirde anında ücretsiz yeni fal yorumu hakkı tanımlıyoruz."
       }
   },
   {
       id: "ask",
       name: "Yıldız Efsunlu Aşk",
       subName: "Yüreğinizin sesi.",
       price: "₺200",
       description: "İlişki uyumu - Kalp hanesi - Ruh ikizi analizleri",
       folderPath: "/assets/turk-kahvasi_frames",
       themeColor: "#d7baff", // Tertiary Purple/Lavender
       gradient: "linear-gradient(135deg, #3f0080 0%, #0e0f04 100%)", // tertiary-container to lowest
       features: ["Aşk & İlişki Analizi", "Uyum ve Bağ Derecesi", "Kalp Kabarması Tespiti"],
       stats: [{ label: "Uyum", val: "%98" }, { label: "Bağ", val: "Güçlü" }, { label: "Hissiyat", val: "Yüksek" }],
       section1: { title: "Yıldız Efsunlu Aşk.", subtitle: "Yüreğinizin sesi." },
       section2: { title: "Aşkın telve hali.", subtitle: "Fincanınızdaki kalp şekilleri, kısmet yolları ve ruh ikizinizle olan bağlarınızın efsunlu analizi." },
       section3: { title: "Ruh ikizi rehberi.", subtitle: "Karşı taraftan gelecek adımlar, aradaki engellerin kalkışı ve gelecekteki mutlu yuva işaretleri." },
       section4: { title: "Gönülden süzülen kelimeler.", subtitle: "" },
       detailsSection: {
           title: "İlişki ve Sevgi Uyumu",
           description: "Efsunlu Aşk yorumumuz, tamamen gönül ilişkileri ve sevgi bağları üzerine yoğunlaşır. Karşı tarafın aklındaki düşünceler, fincanda beliren harfler ve isminizin baş harfleriyle eşleşen gizemli figürler bu yorumda açığa kavuşur.",
           imageAlt: "Aşk Yorum Detayları"
       },
       freshnessSection: {
           title: "Niyetle Kapatılan Fincan",
           description: "Aşk falında en önemli unsur niyetinizdir. Fincanınızı kapatırken kalbinizden geçen niyet, telvelerin akışını ve aşk sembollerinin yerleşimini doğrudan etkiler. FalBaz uzmanları bu enerjiyi hissederek yorumu hazırlar."
       },
       buyNowSection: {
           price: "₺200",
           unit: "yorum başına",
           processingParams: ["Aşk Odaklı", "Harf Analizi", "Partner Uyumu"],
           deliveryPromise: "İlişki analiziniz 15-20 dakika içinde sesli veya yazılı olarak panelinize düşer.",
           returnPolicy: "Hislerimizde samimiyiz; beklentinizi karşılamayan yorumlarda anında iade seçeneği."
       }
   },
   {
       id: "bereket",
       name: "Saraylı Finans & Başarı",
       subName: "Zirvedeki fırsatlar.",
       price: "₺250",
       description: "Kariyer adımları - Finansal bereket - Güç ve başarı sembolleri",
       folderPath: "/assets/turk-kahvasi_frames",
       themeColor: "#e3beb8", // Surface Tint / Rosegold
       gradient: "linear-gradient(135deg, #5b403c 0%, #131408 100%)", // fixed-variant to background
       features: ["Kariyer Yolu Analizi", "Maddi Bereket Tahmini", "Güç & Mevki Sembolleri"],
       stats: [{ label: "Finans", val: "Açık" }, { label: "Mevki", val: "Yükseliş" }, { label: "Bereket", val: "Bol" }],
       section1: { title: "Saraylı Bereket.", subtitle: "Zirvedeki fırsatlar." },
       section2: { title: "Bereket sembolleri.", subtitle: "Tavus kuşu, balık, anahtar ve devlet kapısı gibi başarı getiren figürlerin en ince ayrıntısıyla incelenmesi." },
       section3: { title: "Kariyer basamakları.", subtitle: "İş hayatınızdaki terfiler, yeni ortaklıklar, finansal yatırımlar ve önünüzü kesmeye çalışan engeller." },
       section4: { title: "Maddi ferahlık haritası.", subtitle: "" },
       detailsSection: {
           title: "Zenginlik ve Kudret Yorumu",
           description: "Saray Usulü Bereket yorumu, fincandaki en köklü başarı ve güç sembollerini analiz eder. Maddi refahınızın artacağı dönemler, açılacak kısmet kapıları ve iş dünyasındaki prestijiniz hakkında derin analizler barındırır.",
           imageAlt: "Kariyer Yorum Detayları"
       },
       freshnessSection: {
           title: "Mikroskopik Telve Analizi",
           description: "İş dünyasındaki adımlar hassastır. FalBaz, telvedeki en küçük noktacıkları ve tortuların birikme yoğunluklarını ölçümleyerek iş hayatınızdaki dönüm noktalarını ve tarihleri belirlemeye çalışır."
       },
       buyNowSection: {
           price: "₺250",
           unit: "yorum başına",
           processingParams: ["Finansal Öngörü", "Tarih & Zaman Analizi", "PDF Raporu"],
           deliveryPromise: "Kariyer ve başarı analizi raporunuz 15 dakika içinde sisteminize yüklenir.",
           returnPolicy: "Başarıya giden yolda yanınızdayız; memnuniyetinizi garanti altına alıyoruz."
       }
   }
];
