"use client";
// Forced redeployment trigger with the newly added GEMINI_API_KEY key
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductBottleScroll from "@/components/ProductBottleScroll";
import NiyetciModal from "@/components/NiyetciModal";
import NiyetGonderModal from "@/components/NiyetGonderModal";

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context is not supported"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        const base64 = dataUrl.split(",")[1];
        resolve(base64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeProduct = products[currentIndex];
  
  // Modal & Form State
  const [isOpen, setIsOpen] = useState(false);
  const [niyetOpen, setNiyetOpen] = useState(false);
  const [niyetGonderOpen, setNiyetGonderOpen] = useState(false);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("Kadın");
  const [relStatus, setRelStatus] = useState("İlişkisi yok");
  const [wish, setWish] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fortuneText, setFortuneText] = useState("");
  const [typedText, setTypedText] = useState("");

  // Real Image uploads states
  const [imgInside1, setImgInside1] = useState<string>("");
  const [imgInside2, setImgInside2] = useState<string>("");
  const [imgPlate, setImgPlate] = useState<string>("");

  // Scroll Position State
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Horoscope selection states
  const [selectedHoroscope, setSelectedHoroscope] = useState<string | null>(null);
  const [horoscopeOpen, setHoroscopeOpen] = useState(false);

  // History Modal State
  const [historyOpen, setHistoryOpen] = useState(false);

  const dailyHoroscopes: Record<string, { symbol: string, date: string, text: string }> = {
    "Koç": { symbol: "♈", date: "21 Mart - 19 Nisan", text: "Bugün içsel enerjiniz oldukça yüksek. Kariyerinizde atmak istediğiniz cesur adımlar için gökyüzü sizi destekliyor. Aşk hayatınızda ise fevri çıkışlardan kaçınmalısınız." },
    "Boğa": { symbol: "♉", date: "20 Nisan - 20 Mayıs", text: "Maddi konularda şanslı ve bereketli bir gün. Yatırımlarınız veya birikimlerinizle ilgili güzel haberler alabilirsiniz. İlişkilerinizde güven arayışınız ön planda." },
    "İkizler": { symbol: "♊", date: "21 Mayıs - 20 Haziran", text: "İletişim becerileriniz sayesinde bugün tüm kapılar size açılıyor. Yeni tanışmalar ve sosyal projeler gündemde. Kendinizi ifade etmekten çekinmeyin." },
    "Yengeç": { symbol: "♋", date: "21 Haziran - 22 Temmuz", text: "Bugün sezgileriniz inanılmaz güçlü. Alacağınız kararlarda mantığınız kadar iç sesinize de güvenin. Hane içinde huzurlu ve keyifli anlar yaşanabilir." },
    "Aslan": { symbol: "♌", date: "23 Temmuz - 22 Ağustos", text: "Liderlik özelliklerinizin ön plana çıktığı bir gün. İş yerinde sorumluluk almaktan çekinmeyin, gözler üzerinizde olacak. Aşkta cesur adımlar kapıda." },
    "Başak": { symbol: "♍", date: "23 Ağustos - 22 Eylül", text: "Detaylara odaklanarak çözülmez denilen sorunları çözebilirsiniz. Düzen ve planlama yapmak için harika bir gün. Sağlığınıza biraz daha özen gösterin." },
    "Terazi": { symbol: "♎", date: "23 Eylül - 22 Ekim", text: "Hayatınızda dengeyi bulduğunuz bir gün. Sanatsal ve estetik konularla ilgilenebilirsiniz. İkili ilişkilerinizde uyum ve barış rüzgarları esiyor." },
    "Akrep": { symbol: "♏", date: "23 Ekim - 21 Kasım", text: "Gizemli ve çekici auranızla çevrenizdekileri etkiliyorsunuz. Bugün tutkularınızın peşinden gidebilirsiniz. Finansal ortaklıklarda temkinli olun." },
    "Yay": { symbol: "♐", date: "22 Kasım - 21 Aralık", text: "Macera ve keşfetme arzunuz tavan yapmış durumda. Yeni yerler görme veya yeni bir eğitim planlama isteğiniz artabilir. İyimserliğiniz size kazandıracak." },
    "Oğlak": { symbol: "♑", date: "22 Aralık - 19 Ocak", text: "Hedeflerinize odaklanmış durumdasınız. Disiplinli çalışmanızın meyvelerini almaya başlayacaksınız. Sabırlı olun, çabalarınız karşılıksız kalmayacak." },
    "Kova": { symbol: "♒", date: "20 Ocak - 18 Şubat", text: "Farklı ve özgün fikirlerinizle dikkat çekeceksiniz. Sosyal çevrenizden destek alabilir, toplumsal projelerde yer alabilirsiniz. Özgürlüğünüz bugün her şeyden önemli." },
    "Balık": { symbol: "♓", date: "19 Şubat - 20 Mart", text: "Duygusal derinliğiniz ve hayal gücünüz zirvede. Sanatsal çalışmalar yapmak veya meditasyon için mükemmel bir gün. Rüyalarınız bugün size yol gösterebilir." }
  };

  // Switch products
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  // Sync background gradient with active product
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--product-gradient",
      activeProduct.gradient
    );
  }, [currentIndex, activeProduct]);

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex])  // Call Google Gemini API to analyze coffee grounds images and generate interpretation
  // Call Google Gemini API to analyze coffee grounds images and generate interpretation
  // Call server-side API to analyze coffee grounds images and generate interpretation
  const generateFortune = async () => {
    try {
      const response = await fetch("/api/fal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          birthdate,
          gender,
          relStatus,
          wish,
          concept: activeProduct.name,
          imgInside1,
          imgInside2,
          imgPlate
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Gemini API call failed");
      }

      const data = await response.json();
      return data.text;
    } catch (error: any) {
      console.warn("Gemini API error, running local fallback:", error);
      alert("Hata Detayı: " + error.message);
      
      // Dynamic robust local fallback in case of key limits
      let fallbackText = "";
      if (activeProduct.id === "klasik") {
        fallbackText = `Sevgili ${name}, fincanındaki telveleri incelediğimde ilk gözüme çarpan aydınlık bir yol oldu. Üç vakte kadar seni ferahlatacak temiz bir haber kapını çalacak. Hanendeki bazı sıkıntılar geride kalıyor, niyetin olan "${wish || "huzur"}" yakında seninle olacak.`;
      } else if (activeProduct.id === "ask") {
        fallbackText = `Sevgili ${name}, fincanının kalbinde iki temiz kısmet ve bir kalp kabarması gördüm. İlişki durumundaki "${relStatus}" süreci, kalbinden geçen niyetin olan "${wish || "mutlu birliktelik"}" ile aydınlanacak. Sevdiğin insandan güzel bir adım bekleyebilirsin.`;
      } else {
        fallbackText = `Sevgili ${name}, fincanındaki tavus kuşu ve balık sembolleri çok güçlü bir finansal yükselişe işaret ediyor. İş hayatındaki niyetin olan "${wish || "başarı"}" basamaklarını hızla tırmanacaksın. Yeni bir kazanç kapısı görünüyor.`;
      }
      return fallbackText;
    }
  };

  // Handle form submit with real API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (!imgInside1 && !imgInside2 && !imgPlate) {
      alert("Lütfen falınız için en az 1 adet fincan veya tabak fotoğrafı yükleyin.");
      return;
    }

    setIsSubmitting(true);

    const generatedFortune = await generateFortune();

    if (generatedFortune.includes("GECERSIZ_GORSEL")) {
      setIsSubmitting(false);
      alert("Hata: Yüklediğiniz fotoğraflar geçerli bir kahve fincanı veya kahve tabağı içermiyor. Lütfen sadece kahve falı (fincan içi telve veya tabak) görselleri yükleyip tekrar deneyin.");
      return;
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setFortuneText(generatedFortune);
  };

  // Typing effect for the fortune outcome
  useEffect(() => {
    if (!submitted || !fortuneText) return;
    
    setTypedText("");
    let i = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fortuneText.charAt(i));
      i++;
      if (i >= fortuneText.length) {
        clearInterval(interval);
      }
    }, 20); // slightly faster typing for longer Gemini paragraphs

    return () => clearInterval(interval);
  }, [submitted, fortuneText]);

  // Reset modal when closed
  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setName("");
      setWish("");
      setSubmitted(false);
      setTypedText("");
      setFortuneText("");
      setImgInside1("");
      setImgInside2("");
      setImgPlate("");
    }, 300);
  };

  return (
    <div className="relative min-h-screen w-full select-none">
      <Navbar />

      {/* Product switching Arrow Navigation (Fixed Sides) */}
      <div 
        className={`fixed top-1/2 left-6 -translate-y-1/2 z-40 hidden md:block transition-all duration-500 ${
          isScrolled ? "opacity-0 pointer-events-none -translate-x-4" : "opacity-100 pointer-events-auto"
        }`}
      >
        <button
          onClick={handlePrev}
          className="flex items-center justify-center w-14 h-14 rounded-full border border-secondary/20 bg-[#131408]/60 backdrop-blur-md text-secondary hover:text-white hover:border-secondary/50 hover:bg-[#202013]/80 transition-all duration-300 shadow-lg cursor-pointer"
          aria-label="Önceki Yorum"
        >
          <span className="material-symbols-outlined text-[28px]">arrow_back</span>
        </button>
      </div>
      <div 
        className={`fixed top-1/2 right-6 -translate-y-1/2 z-40 hidden md:block transition-all duration-500 ${
          isScrolled ? "opacity-0 pointer-events-none translate-x-4" : "opacity-100 pointer-events-auto"
        }`}
      >
        <button
          onClick={handleNext}
          className="flex items-center justify-center w-14 h-14 rounded-full border border-secondary/20 bg-[#131408]/60 backdrop-blur-md text-secondary hover:text-white hover:border-secondary/50 hover:bg-[#202013]/80 transition-all duration-300 shadow-lg cursor-pointer"
          aria-label="Sonraki Yorum"
        >
          <span className="material-symbols-outlined text-[28px]">arrow_forward</span>
        </button>
      </div>

      {/* Bottom Switcher Pill Menu */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-[#0e0f04]/80 backdrop-blur-lg border border-secondary/20 px-4 py-2.5 rounded-full shadow-2xl">
        {products.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setCurrentIndex(idx)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
              idx === currentIndex
                ? "bg-secondary text-on-secondary shadow-md scale-105"
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            {p.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Main Scrollytelling Engine */}
      <main id="deneyim" className="relative z-10 w-full">
        <ProductBottleScroll product={activeProduct} />
      </main>

      {/* Container for subsequent sections to maintain grid and margins */}
      <div className="w-full px-5 md:px-[120px] max-w-7xl mx-auto space-y-20 pb-20 relative z-20">
        
        {/* Section 5: AI Interpretation Section (Studio AI Glassmorphism Card) */}
        <section id="ai-analysis" className="w-full relative">
          <div className="relative bg-primary-container/40 backdrop-blur-[20px] border-t border-l border-secondary/40 border-b border-r border-secondary/10 rounded-xl p-8 md:p-[64px] flex flex-col md:flex-row items-center gap-12 overflow-hidden group">
            {/* Decorative subtle motif in background */}
            <div className="absolute -bottom-24 -right-24 opacity-10 pointer-events-none transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
              <span className="material-symbols-outlined text-[300px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>

            <div className="w-full md:w-1/2 relative z-10 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-secondary/30 rounded-full bg-surface-container/50">
                <span className="material-symbols-outlined text-secondary text-[16px]">psychology</span>
                <span className="text-[10px] font-semibold tracking-widest text-secondary uppercase">
                  Google Studio AI
                </span>
              </div>
              <h2 className="font-headline text-3xl md:text-[40px] font-bold text-on-surface leading-tight">
                {activeProduct.detailsSection.title}
              </h2>
              <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
                {activeProduct.detailsSection.description}
              </p>

              {/* Stats listing */}
              <div className="grid grid-cols-3 gap-2 border-t border-b border-secondary/10 py-6 my-4">
                {activeProduct.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-neutral-500 text-[10px] font-semibold tracking-wider uppercase mb-1">
                      {stat.label}
                    </span>
                    <span className="text-xl md:text-2xl font-black text-secondary">
                      {stat.val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setIsOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-secondary text-secondary hover:bg-secondary/10 transition-all font-semibold text-xs tracking-wider uppercase relative overflow-hidden group/btn cursor-pointer"
                >
                  <span className="relative z-10">Hemen Yükle</span>
                  <span className="material-symbols-outlined relative z-10 text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Visual Representation of the "Cup" Reading Process */}
            <div className="w-full md:w-1/2 flex justify-center items-center relative z-10 min-h-[300px]">
              <div 
                onClick={() => setIsOpen(true)}
                className="relative w-64 h-64 rounded-full border border-secondary/20 flex items-center justify-center before:absolute before:inset-0 before:rounded-full before:border-t-2 before:border-secondary before:animate-spin cursor-pointer hover:scale-105 transition-transform duration-300"
                style={{ animationDuration: '3s' }}
              >
                <div 
                  className="w-[240px] h-[240px] rounded-full overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center group/circle bg-cover bg-center bg-upload-bg"
                >
                  {/* Dark overlay to make text/icon readable */}
                  <div className="absolute inset-0 bg-black/60 group-hover/circle:bg-black/40 transition-colors duration-300 z-0" />
                  
                  <div className="relative z-10 flex flex-col items-center justify-center opacity-75 group-hover/circle:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="material-symbols-outlined text-secondary text-[60px]">cloud_upload</span>
                    <span className="text-[10px] tracking-widest text-secondary font-bold uppercase mt-1 glow-text-gold">Görsel Seç</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Asymmetric Content Snippets */}
        <section id="horoscopes" className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* History Snippet (Large Card) */}
          <div id="tarihce" className="md:col-span-7 relative bg-surface-container-high rounded-xl overflow-hidden border border-white/5 group min-h-[400px] flex items-end">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-40 mix-blend-luminosity bg-ritual-history" 
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#131408] via-[#131408]/80 to-transparent"></div>
            <div className="relative z-10 p-8 w-full">
              <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-3">Türk Kahvesinin 500 Yıllık Tarihi</h3>
              <p className="text-sm text-on-surface-variant mb-4 max-w-lg leading-relaxed font-light">
                Saraylardan sokaklara, bir içeceğin ötesinde bir ritüelin doğuşu. Yemen'den İstanbul'a uzanan efsanevi serüveni keşfedin.
              </p>
              <button 
                onClick={() => setHistoryOpen(true)}
                className="inline-flex items-center gap-1.5 text-secondary font-semibold text-xs tracking-wider uppercase hover:underline decoration-secondary/50 underline-offset-4 transition-all cursor-pointer bg-transparent border-none outline-none"
              >
                Hikayeyi Oku <span className="material-symbols-outlined text-[16px]">menu_book</span>
              </button>
            </div>
          </div>

          {/* Horoscopes Snippet (Small Card) */}
          <div className="md:col-span-5 bg-surface-container/50 backdrop-blur-md rounded-xl p-8 border border-secondary/10 flex flex-col justify-between relative overflow-hidden group min-h-[360px]">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none">
              <span className="material-symbols-outlined text-[100px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            </div>

            {/* Dropdown / Grid selection overlay */}
            {horoscopeOpen ? (
              <div className="absolute inset-0 bg-[#131408] p-6 z-20 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-headline text-base font-bold text-secondary">Burcunuzu Seçin</h4>
                  <button 
                    onClick={() => setHoroscopeOpen(false)} 
                    className="text-neutral-500 hover:text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[260px] pr-1">
                  {Object.entries(dailyHoroscopes).map(([name, info]) => (
                    <button 
                      key={name}
                      onClick={() => {
                        setSelectedHoroscope(name);
                        setHoroscopeOpen(false);
                      }}
                      className="flex flex-col items-center p-2 rounded-lg bg-surface-container-high/30 hover:bg-secondary/15 hover:text-secondary border border-white/5 transition-all cursor-pointer"
                    >
                      <span className="text-xl mb-0.5">{info.symbol}</span>
                      <span className="text-[9px] font-medium tracking-wider">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedHoroscope ? (
              <div className="flex flex-col justify-between h-full z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-secondary/30 rounded-full bg-surface-container/50 mb-3.5 w-fit">
                    <span className="text-base text-secondary">{dailyHoroscopes[selectedHoroscope].symbol}</span>
                    <span className="text-[10px] font-semibold tracking-widest text-secondary uppercase">
                      {selectedHoroscope}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 block mb-2 font-mono">
                    {dailyHoroscopes[selectedHoroscope].date}
                  </span>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-2.5">Günlük Yorum</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed font-light mb-6 opacity-90">
                    {dailyHoroscopes[selectedHoroscope].text}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setHoroscopeOpen(true)}
                    className="flex-1 py-2.5 rounded-lg border border-secondary/30 text-secondary font-semibold text-xs tracking-wider uppercase hover:bg-secondary/10 transition-all cursor-pointer text-center"
                  >
                    Burç Değiştir
                  </button>
                  <button 
                    onClick={() => setSelectedHoroscope(null)}
                    className="px-3 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    aria-label="Geri Dön"
                  >
                    <span className="material-symbols-outlined text-[18px]">undo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full z-10">
                <div>
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                    <span className="material-symbols-outlined text-secondary">flare</span>
                  </div>
                  <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-2">Günün Burç Yorumları</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-light mb-8 opacity-80">
                    Yıldızların bugünkü konumu enerjinizi nasıl etkiliyor? Günlük rehberiniz sizi bekliyor.
                  </p>
                </div>
                <button 
                  onClick={() => setHoroscopeOpen(true)}
                  className="w-full py-2.5 rounded-lg border border-secondary/30 text-secondary font-semibold text-xs tracking-wider uppercase hover:bg-secondary/10 hover:border-secondary transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Burcunu Seç <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 7: Rituals & Traditions */}
        <section id="details" className="w-full relative mt-24 mb-12">
          <div className="flex flex-col gap-3 mb-10 text-center md:text-left">
            <h2 className="font-headline text-3xl md:text-[40px] font-bold text-on-surface">Ritüeller & Gelenekler</h2>
            <p className="text-sm md:text-base text-on-surface-variant font-light max-w-2xl">
              Bir fincan kahvenin ardındaki gizemli dünya. Yüzyıllardır süregelen eşsiz ritüelleri ve kahve falının sırlarını keşfedin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Tradition Cards Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="relative rounded-2xl overflow-hidden h-48 border border-secondary/20 shadow-lg group mb-8">
                <img 
                  src="/assets/ritual_tradition.webp" 
                  alt="Geleneksel Sunum" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131408] via-transparent to-transparent" />
              </div>
              
              <div className="grid gap-4">
                <div className="bg-surface-container/40 p-5 rounded-xl border border-secondary/10 hover:border-secondary/30 transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-secondary text-[24px]">favorite</span>
                    <h4 className="font-headline text-lg font-bold text-on-surface">Kız İsteme & Tuzlu Kahve</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                    Damadın sabrını ve sevgisini ölçmek için kahvesine şeker yerine tuz atılır. Damat kahveyi gülümseyerek içerse, zorluklara göğüs gerebileceği kabul edilir.
                  </p>
                </div>
                <div className="bg-surface-container/40 p-5 rounded-xl border border-secondary/10 hover:border-secondary/30 transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-secondary text-[24px]">handshake</span>
                    <h4 className="font-headline text-lg font-bold text-on-surface">Misafir Karşılama</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                    "Bir fincan kahvenin 40 yıl hatırı vardır." Türk kültüründe eve gelen misafire değer verildiğinin en zarif göstergesi özenle hazırlanan bol köpüklü kahvedir.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* How to Read Fortune Guide */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-primary-container/20 backdrop-blur-md rounded-2xl p-8 border border-secondary/20 flex flex-col justify-between shadow-2xl"
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-secondary/30 rounded-full bg-surface-container/50 mb-4">
                  <span className="material-symbols-outlined text-secondary text-[16px]">visibility</span>
                  <span className="text-[10px] font-semibold tracking-widest text-secondary uppercase">
                    Adım Adım
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Kahve Falı Nasıl Bakılır?</h3>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[15px] before:w-px before:bg-secondary/20">
                {[
                  { icon: "local_cafe", title: "İçim ve Niyet", desc: "Kahvenizi yavaşça, sadece bir taraftan içerek bitirin ve içinizden niyetinizi tutun." },
                  { icon: "motion_photos_pause", title: "Kapatma", desc: "Fincanı tabağın üzerine ters çevirin. Hızlı soğuması için üzerine metal bir para veya yüzük koyabilirsiniz." },
                  { icon: "hourglass_empty", title: "Soğuma", desc: "Telvenin şekil alıp kuruması için yaklaşık 5-10 dakika bekleyin. Fincanın soğuduğundan emin olun." },
                  { icon: "photo_camera", title: "Analiz", desc: "Fincanı açın, içindeki yolları ve şekilleri net bir şekilde fotoğraflayarak FalBaz'a yükleyin." }
                ].map((step, idx) => (
                  <div key={idx} className="relative flex gap-4 items-start z-10 group">
                    <div className="w-8 h-8 rounded-full bg-[#131408] border-2 border-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[14px] text-secondary">{step.icon}</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-on-surface mb-0.5">{step.title}</h5>
                      <p className="text-xs text-on-surface-variant font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-secondary/20 flex flex-col md:flex-row gap-4 items-center justify-between">
                <img 
                  src="/assets/ritual_fortune.webp" 
                  alt="Fal Hazırlığı" 
                  className="w-32 h-20 object-cover rounded-lg border border-secondary/30 opacity-80 shadow-md"
                />
                <button 
                  onClick={() => {
                    const targetElement = document.getElementById("ai-analysis");
                    if (!targetElement) return;

                    // Force instant scroll behavior to bypass browser queuing delays
                    document.documentElement.style.scrollBehavior = "auto";
                    document.body.style.scrollBehavior = "auto";

                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const startPosition = window.scrollY;
                    const distance = targetPosition - startPosition;
                    if (distance === 0) return;
                    let startTime: number | null = null;

                    const easeOutQuad = (t: number) => {
                      return t * (2 - t);
                    };

                    const animation = (currentTime: number) => {
                      if (startTime === null) startTime = currentTime;
                      const timeElapsed = currentTime - startTime;
                      const progress = Math.min(timeElapsed / 8000, 1);
                      const run = easeOutQuad(progress) * distance + startPosition;

                      window.scrollTo(0, run);

                      if (timeElapsed < 8000) {
                        requestAnimationFrame(animation);
                      } else {
                        window.history.pushState(null, "", "#ai-analysis");
                      }
                    };

                    requestAnimationFrame(animation);
                  }}
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-secondary/15 hover:bg-secondary text-secondary hover:text-on-secondary border border-secondary transition-all font-semibold text-xs tracking-wider uppercase text-center cursor-pointer shadow-[0_0_15px_rgba(202,176,128,0.15)] hover:shadow-[0_0_20px_rgba(202,176,128,0.4)]"
                >
                  Görsel Yükle & Yorumla
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Evrenin Niyetini Al & Evrene Niyetini Gönder Banners */}
        <section className="w-full border-t border-secondary/20 flex flex-col gap-6 mt-16">
          {/* Banner 1: Evrenin Niyetini Al */}
          <button
            onClick={() => setNiyetOpen(true)}
            className="group w-full py-12 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 hover:bg-[#1C132E]/40 transition-all duration-500 relative overflow-hidden rounded-xl border border-transparent hover:border-[#B19FFB]/35 cursor-pointer shadow-[0_0_20px_rgba(177,159,251,0.05)] text-left"
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-1000 bg-mystical-cosmos" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B19FFB]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 z-10">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#B19FFB] uppercase drop-shadow-md">
                Evrenin Niyetini Al
              </span>
              <span className="font-headline text-2xl md:text-4xl font-bold text-white group-hover:text-[#B19FFB] transition-colors duration-300 drop-shadow-lg">
                Evrenden Gelen Niyetleri Kalbinize Alın
              </span>
            </div>

            <div className="flex items-center gap-3 mt-6 md:mt-0 text-[#B19FFB] group-hover:text-white transition-colors z-10">
              <span className="text-xs font-bold tracking-widest uppercase drop-shadow-md">Niyeti Al</span>
              <div className="w-10 h-10 rounded-full border border-[#B19FFB]/50 flex items-center justify-center group-hover:border-[#B19FFB] group-hover:bg-[#B19FFB]/20 group-hover:translate-x-2 transition-all duration-300 shadow-[0_0_15px_rgba(177,159,251,0.2)]">
                <span className="material-symbols-outlined text-[20px]">psychology_alt</span>
              </div>
            </div>
          </button>

          {/* Banner 2: Evrene Niyetini Gönder */}
          <button
            onClick={() => setNiyetGonderOpen(true)}
            className="group w-full py-12 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 hover:bg-[#201D13]/40 transition-all duration-500 relative overflow-hidden rounded-xl border border-transparent hover:border-[#E6C475]/35 cursor-pointer shadow-[0_0_20px_rgba(230,196,117,0.05)] text-left"
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-1000 bg-mystical-cosmos" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E6C475]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 z-10">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#E6C475] uppercase drop-shadow-md">
                Evrene Niyetini Gönder
              </span>
              <span className="font-headline text-2xl md:text-4xl font-bold text-white group-hover:text-[#E6C475] transition-colors duration-300 drop-shadow-lg">
                İçinizden Geçenleri Evrene Bırakın
              </span>
            </div>

            <div className="flex items-center gap-3 mt-6 md:mt-0 text-[#E6C475] group-hover:text-white transition-colors z-10">
              <span className="text-xs font-bold tracking-widest uppercase drop-shadow-md">Niyet Et</span>
              <div className="w-10 h-10 rounded-full border border-[#E6C475]/50 flex items-center justify-center group-hover:border-[#E6C475] group-hover:bg-[#E6C475]/20 group-hover:translate-x-2 transition-all duration-300 shadow-[0_0_15px_rgba(230,196,117,0.2)]">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              </div>
            </div>
          </button>
        </section>
      </div>

      <Footer />
      
      <NiyetciModal isOpen={niyetOpen} onClose={() => setNiyetOpen(false)} />
      <NiyetGonderModal isOpen={niyetGonderOpen} onClose={() => setNiyetGonderOpen(false)} />

      {/* Order Modal (Submission & AI Generation) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e0f04]/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-secondary/35 bg-[#131408] p-6 md:p-8 flex flex-col gap-6 shadow-2xl text-on-surface"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white p-2 text-xs font-semibold rounded-full border border-secondary/20 bg-surface-container hover:bg-surface-container-high transition-all duration-200 cursor-pointer"
              >
                Kapat
              </button>

              {!submitted ? (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-secondary/30 rounded-full bg-surface-container/50 w-fit">
                      <span className="material-symbols-outlined text-secondary text-[16px] animate-pulse">local_cafe</span>
                      <span className="text-[10px] font-semibold tracking-widest text-secondary uppercase">
                        {activeProduct.name}
                      </span>
                    </div>
                    <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mt-2">
                      Fal Niyetinizi Belirtin
                    </h3>
                    <p className="text-xs text-on-surface-variant font-light">
                      Fincan detaylarınızla size özel yorumu hazırlamak için bilgilerinizi girin.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                        Adınız
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Örn. Selin"
                        className="w-full bg-[#0e0f04] border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder-neutral-700 focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>

                    {/* Birthdate & Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                          Doğum Tarihiniz
                        </label>
                        <input
                          type="date"
                          required
                          value={birthdate}
                          onChange={(e) => setBirthdate(e.target.value)}
                          className="w-full bg-[#0e0f04] border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                          Cinsiyetiniz
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-[#0e0f04] border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary transition-colors"
                        >
                          <option value="Kadın">Kadın</option>
                          <option value="Erkek">Erkek</option>
                          <option value="Belirtmek istemiyorum">Belirtmek İstemiyorum</option>
                        </select>
                      </div>
                    </div>

                    {/* Relationship Status */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                        İlişki Durumunuz
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["İlişkisi yok", "İlişkisi var", "Evli"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setRelStatus(status)}
                            className={`py-2.5 rounded-xl border text-xs font-semibold transition-all duration-350 cursor-pointer ${
                              relStatus === status
                                ? "bg-secondary/15 border-secondary text-secondary"
                                : "bg-[#0e0f04] border-secondary/15 text-neutral-500 hover:border-secondary/35"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Wish/Niyet */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                        Niyetiniz / Sorunuz (Opsiyonel)
                      </label>
                      <textarea
                        value={wish}
                        onChange={(e) => setWish(e.target.value)}
                        placeholder="Örn. Kariyerimde yükseliş olacak mı? Veya aşk hayatım ne zaman düzene girecek?"
                        className="w-full bg-[#0e0f04] border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder-neutral-700 focus:outline-none focus:border-secondary transition-colors h-24 resize-none"
                      />
                    </div>

                    {/* Cup Image Upload Grid */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                        Fincan Fotoğrafları (En az 1 adet)
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Fincan İçi 1", state: imgInside1, setter: setImgInside1 },
                          { label: "Fincan İçi 2", state: imgInside2, setter: setImgInside2 },
                          { label: "Tabak", state: imgPlate, setter: setImgPlate },
                        ].map((item, idx) => (
                          <label
                            key={idx}
                            className="relative h-24 rounded-xl border border-dashed border-secondary/25 hover:border-secondary/50 bg-[#0e0f04] flex flex-col items-center justify-center cursor-pointer group transition-all overflow-hidden"
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const base64String = await compressImage(file);
                                    item.setter(base64String);
                                  } catch (err) {
                                    console.error("Görsel sıkıştırma hatası:", err);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const fallbackBase64 = (reader.result as string).split(",")[1];
                                      item.setter(fallbackBase64);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }
                              }}
                            />
                            {item.state ? (
                              <>
                                <img
                                  src={`data:image/jpeg;base64,${item.state}`}
                                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity"
                                  alt={item.label}
                                />
                                <span className="absolute bottom-2 left-2 right-2 text-center text-[8px] bg-black/60 text-secondary py-0.5 rounded uppercase font-semibold tracking-wider backdrop-blur-xs z-10">
                                  Yüklendi
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-neutral-600 group-hover:text-secondary transition-colors mb-1">camera</span>
                                <span className="text-[9px] text-neutral-500 group-hover:text-neutral-400 transition-colors font-semibold uppercase">
                                  {item.label}
                                </span>
                              </>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 mt-2 rounded-xl font-bold text-on-secondary bg-secondary hover:bg-secondary-fixed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:cursor-not-allowed text-xs tracking-wider uppercase font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                          <span>Mistik Bağ Kuruluyor...</span>
                        </>
                      ) : (
                        <span>Falımı Yorumla</span>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Fortune Interpretation Result Panel */
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-secondary/15 border border-secondary/35 text-secondary">
                      <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-xl font-bold text-on-surface">Falınız Hazır!</h4>
                      <p className="text-xs text-neutral-500 font-light">
                        Mistik telve analiz raporu.
                      </p>
                    </div>
                  </div>

                  {/* Reading typewriter text box */}
                  <div className="bg-[#0e0f04]/60 border border-secondary/15 rounded-2xl p-6 min-h-[220px] max-h-[300px] overflow-y-auto text-on-surface-variant text-sm md:text-base leading-relaxed font-light scrollbar-thin">
                    <p className="whitespace-pre-wrap">{typedText}</p>
                    {typedText.length < fortuneText.length && (
                      <span className="inline-block w-1.5 h-4 bg-secondary ml-0.5 animate-pulse" />
                    )}
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <button
                      onClick={closeModal}
                      className="w-full py-3.5 rounded-xl font-bold text-on-secondary bg-secondary hover:bg-secondary-fixed transition-all duration-300 text-center shadow-lg cursor-pointer text-xs tracking-wider uppercase font-semibold"
                    >
                      Teşekkürler, Fincanı Kapat
                    </button>
                    <span className="text-[10px] text-neutral-600 text-center font-mono uppercase tracking-wider">
                      Mystic Grounds AI // Tüm sırlar aydınlandı.
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Turkish Coffee 500-Year History Modal */}
      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e0f04]/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-secondary/35 bg-[#131408] p-6 md:p-10 flex flex-col gap-8 shadow-2xl text-on-surface scrollbar-thin scrollbar-thumb-secondary/30"
            >
              {/* Close Button */}
              <button
                onClick={() => setHistoryOpen(false)}
                className="absolute top-6 right-6 text-on-surface-variant hover:text-white p-2.5 rounded-full border border-secondary/20 bg-surface-container hover:bg-surface-container-high transition-all duration-200 cursor-pointer flex items-center justify-center z-10"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              {/* Modal Header */}
              <div className="flex flex-col gap-2 mt-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-secondary/30 rounded-full bg-surface-container/50 w-fit">
                  <span className="material-symbols-outlined text-secondary text-[16px] animate-pulse">menu_book</span>
                  <span className="text-[10px] font-semibold tracking-widest text-secondary uppercase">
                    Kültürel Miras
                  </span>
                </div>
                <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-secondary to-white">
                  Türk Kahvesinin 500 Yıllık Tarihi
                </h2>
                <p className="text-sm md:text-base text-on-surface-variant/95 font-light leading-relaxed max-w-3xl mt-2">
                  Osmanlı İmparatorluğu dönemine uzanan bu efsanevi öykü, bugün Türkiye'nin en önemli kültürel miraslarından biri olarak kabul edilmektedir. Sarayların ihtişamından mahalle kahvehanelerinin sıcaklığına, nesiller boyu aktarılan ritüeli keşfedin.
                </p>
              </div>

              <div className="h-px bg-secondary/15 w-full my-1" />

              {/* Section 1: 16. Yüzyılda Başlangıcı */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20">
                      1543 - 1555
                    </span>
                    <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface">16. Yüzyılda Başlangıcı</h3>
                  </div>
                  <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
                    Kahvenin anavatanı Etiyopya'dır. Daha sonra Yemen'de yetiştirilmeye başlanmış ve buradan Osmanlı topraklarına ulaşmıştır. 
                  </p>
                  <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
                    Yaklaşık 1543–1555 yılları arasında, <strong>Yemen Valisi Özdemir Paşa'nın</strong> kahveyi İstanbul'a getirdiği rivayet edilir. Osmanlı sarayında kahve kısa sürede büyük ilgi görmüş, sarayın en kıymetli ikramı haline gelerek özel kahve hazırlama yöntemleri geliştirilmiştir.
                  </p>
                </div>
                <div className="relative h-[220px] md:h-[280px] w-full rounded-xl overflow-hidden border border-secondary/20 shadow-lg group">
                  <img 
                    src="/assets/history_palace.webp" 
                    alt="Osmanlı Sarayında Kahve" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>

              {/* Section 2: Türk Kahvesinin Doğuşu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[220px] md:h-[280px] w-full rounded-xl overflow-hidden border border-secondary/20 shadow-lg group md:order-1 order-2">
                  <img 
                    src="/assets/history_brewing.webp" 
                    alt="Türk Kahvesi Pişirme Tekniği" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                <div className="space-y-4 md:order-2 order-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20">
                      Pişirme Sanatı
                    </span>
                    <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface">Türk Kahvesinin Doğuşu</h3>
                  </div>
                  <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
                    Osmanlılar, kahveyi diğer toplumların hazırlama yöntemlerinden tamamen farklı bir ritüele dönüştürdüler:
                  </p>
                  <ul className="space-y-2.5 text-sm text-on-surface-variant font-light leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✦</span>
                      <span><strong>Çok ince öğütmüş,</strong> çekirdekleri adeta un kıvamına getirmişlerdir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✦</span>
                      <span><strong>Cezvede suyla birlikte</strong> kısık ateşte yavaşça pişirerek lezzetini ortaya çıkarmışlardır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✦</span>
                      <span><strong>Köpüğüyle birlikte</strong> küçük fincanlarda telvesiyle servis etmişlerdir.</span>
                    </li>
                  </ul>
                  <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed pt-1">
                    Bu özel pişirme tekniği, telvesiyle servis edilen tek kahve türü olarak zamanla "Türk kahvesi" adıyla dünyaya yayılmıştır.
                  </p>
                </div>
              </div>

              {/* Section 3: Kahvehanelerin Ortaya Çıkışı */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20">
                      1550'ler
                    </span>
                    <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface">Kahvehanelerin Ortaya Çıkışı</h3>
                  </div>
                  <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
                    1550'li yıllarda İstanbul'da ilk kahvehaneler açıldı. Bu mekânlar sadece birer içecek noktası değil, Osmanlı entelektüel hayatının kalbi haline geldi.
                  </p>
                  <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
                    Şairlerin, sanatçıların, devlet adamlarının ve halkın bir araya gelip sohbet ettiği, satranç oynadığı, şiirler okuduğu bu sosyal merkezler, Osmanlı kültürünün en önemli sosyalleşme alanlarından biri oldu.
                  </p>
                </div>
                <div className="relative h-[220px] md:h-[280px] w-full rounded-xl overflow-hidden border border-secondary/20 shadow-lg group">
                  <img 
                    src="/assets/history_cafe.webp" 
                    alt="Tarihi İstanbul Kahvehanesi" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>

              {/* Grid 4: Avrupa'ya Yayılış & Gelenek ve Kültür */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avrupa'ya Yayılış Card */}
                <div className="bg-surface-container-high/40 border border-secondary/10 rounded-xl p-6 hover:border-secondary/20 transition-all space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">explore</span>
                    <h4 className="font-headline text-lg font-bold text-on-surface">Avrupa'ya Yayılışı</h4>
                  </div>
                  <p className="text-xs md:text-sm text-on-surface-variant font-light leading-relaxed">
                    17. yüzyılda Osmanlı ile Avrupa arasındaki ticaret sayesinde kahve; <strong>Venedik, Paris, Londra ve Viyana</strong> gibi şehirlere ulaştı. Avrupa'daki ilk kahvehanelerin açılmasında ve kahve kültürünün yerleşmesinde Osmanlı kahve kültürünün büyük etkisi oldu.
                  </p>
                </div>

                {/* Gelenek ve Kültür Card */}
                <div className="bg-surface-container-high/40 border border-secondary/10 rounded-xl p-6 hover:border-secondary/20 transition-all space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">family_history</span>
                    <h4 className="font-headline text-lg font-bold text-on-surface">Gelenek ve Kültür</h4>
                  </div>
                  <p className="text-xs md:text-sm text-on-surface-variant font-light leading-relaxed">
                    Türk kahvesi yalnızca bir içecek değildir. Yüzyıllardır:
                  </p>
                  <ul className="grid grid-cols-2 gap-2 text-[11px] md:text-xs text-on-surface-variant font-light">
                    <li className="flex items-center gap-1.5">
                      <span className="text-secondary">✦</span> Misafire ikram edilir.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-secondary">✦</span> Kız istemede tuzlu kahve sunulur.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-secondary">✦</span> Bayramlarda hazırlanır.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-secondary">✦</span> Telveden fal bakılır.
                    </li>
                  </ul>
                </div>
              </div>

              {/* UNESCO Section */}
              <div className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent border border-secondary/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/35 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[32px]">workspace_premium</span>
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="font-headline text-base font-bold text-secondary uppercase tracking-wider">UNESCO Somut Olmayan Kültürel Miras</h4>
                  <p className="text-xs md:text-sm text-on-surface-variant font-light leading-relaxed">
                    <strong>2013 yılında</strong> UNESCO, "Türk Kahvesi Kültürü ve Geleneği"ni İnsanlığın Somut Olmayan Kültürel Mirası listesine dahil etti. Bu karar, Türk kahvesinin sadece bir içecek değil, nesilden nesile aktarılan bir kültürel miras olduğunu uluslararası düzeyde tescilledi.
                  </p>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="space-y-4">
                <h4 className="font-headline text-lg font-bold text-on-surface text-center md:text-left">Kısa Zaman Çizelgesi</h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {[
                    { date: "15. Yüzyıl", text: "Yemen'de yaygınlaşma" },
                    { date: "1540–1555", text: "Osmanlı sarayına gelişi" },
                    { date: "1550'ler", text: "İstanbul'da ilk kahvehaneler" },
                    { date: "17. Yüzyıl", text: "Avrupa'ya yayılış" },
                    { date: "19.-20. Yüzyıl", text: "Kültür simgesi olması" },
                    { date: "2013", text: "UNESCO Tescili" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-surface-container/60 border border-secondary/5 rounded-lg p-3.5 flex flex-col items-center text-center gap-1 group/item hover:border-secondary/20 transition-all">
                      <span className="text-[10px] font-bold text-secondary font-mono tracking-wider">{item.date}</span>
                      <span className="text-[11px] text-on-surface-variant font-light leading-snug">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-secondary/15 w-full my-1" />

              {/* Footer text and Close Button */}
              <div className="text-center max-w-3xl mx-auto py-2">
                <p className="text-xs md:text-sm text-on-surface-variant italic font-light leading-relaxed">
                  "Bugün Türk kahvesi, yaklaşık 500 yıllık geçmişiyle Türkiye'nin en köklü geleneklerinden biri olarak yaşamaya devam etmekte; hazırlama biçimi, sunumu, sohbet kültürü ve kahve falı geleneğiyle dünya çapında tanınmaktadır."
                </p>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="mt-6 px-8 py-3 rounded-full bg-secondary text-on-secondary font-bold text-xs tracking-wider uppercase hover:bg-secondary-fixed transition-all duration-300 shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Hikayeyi Kapat</span>
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
