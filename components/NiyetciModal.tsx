"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

interface NiyetciModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cards = [
  { name: "Kozmik Yıldız", emoji: "⭐", desc: "Umut, yenilenme ve ilahi rehberliğin sembolü." },
  { name: "Zümrüdü Anka", emoji: "🦅", desc: "Küllerinden yeniden doğuş, güç ve yenilenme sembolü." },
  { name: "Gizemli Dolunay", emoji: "🌕", desc: "Duyguların doruk noktası, sezgilerin gücü ve sırların aydınlanması." },
  { name: "Kozmik Pusula", emoji: "🧭", desc: "Hayat yolculuğunda doğru yönü bulma ve kadersel seçimler." },
  { name: "Altın Anahtar", emoji: "🔑", desc: "Yeni kapıların, gizli fırsatların ve çözümlerin anahtarı." },
  { name: "Yüce Güneş", emoji: "☀️", desc: "Netlik, canlılık, başarı ve hayat enerjisinin zirvesi." }
];

export default function NiyetciModal({ isOpen, onClose }: NiyetciModalProps) {
  const [step, setStep] = useState<'welcome' | 'form' | 'animation' | 'result'>('welcome');
  const [selectedCategory, setSelectedCategory] = useState('Genel');
  const [selectedCategoryEmoji, setSelectedCategoryEmoji] = useState('🔮');
  const [age, setAge] = useState("");
  const [marital, setMarital] = useState("");
  const [gender, setGender] = useState("");
  const [intention, setIntention] = useState("");
  
  // Load saved data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCategory = localStorage.getItem("niyet_category");
      const savedAge = localStorage.getItem("niyet_age");
      const savedMarital = localStorage.getItem("niyet_marital");
      const savedGender = localStorage.getItem("niyet_gender");
      const savedIntention = localStorage.getItem("niyet_intention");
      
      if (savedCategory) {
        setSelectedCategory(savedCategory);
        const cat = categoryOptions.find(c => c.name === savedCategory);
        if (cat) setSelectedCategoryEmoji(cat.emoji);
      }
      if (savedAge) setAge(savedAge);
      if (savedMarital) setMarital(savedMarital);
      if (savedGender) setGender(savedGender);
      if (savedIntention) setIntention(savedIntention);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("niyet_category", selectedCategory);
      localStorage.setItem("niyet_age", age);
      localStorage.setItem("niyet_marital", marital);
      localStorage.setItem("niyet_gender", gender);
      localStorage.setItem("niyet_intention", intention);
    }
  }, [selectedCategory, age, marital, gender, intention]);
  
  const [animFrame, setAnimFrame] = useState(1);
  const [resultData, setResultData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const resultRef = useRef<HTMLDivElement>(null);

  // Preload frames
  useEffect(() => {
    if (isOpen) {
      for (let i = 1; i <= 41; i++) {
        const img = new Image();
        img.src = `/assets/niyetci/frame_${i.toString().padStart(3, '0')}.png`;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'animation') {
      let current = 1;
      setAnimFrame(current);
      const interval = setInterval(() => {
        current++;
        if (current > 41) {
          clearInterval(interval);
          setStep('result');
        } else {
          setAnimFrame(current);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleStartDraw = async () => {
    setStep('animation');
    setIsGenerating(true);
    
    // Pick a card
    const card = cards[Math.floor(Math.random() * cards.length)];
    
    // Generate Lucky numbers
    const nums: number[] = [];
    while(nums.length < 3) {
      let r = Math.floor(Math.random() * 99) + 1;
      if(nums.indexOf(r) === -1) nums.push(r);
    }
    
    // Generate Energy
    const energy = Math.floor(Math.random() * 51) + 50;

    // Fetch from Gemini
    try {
      const res = await fetch('/api/niyet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          intention: intention || 'Genel',
          age: age || 'Genç',
          cardName: card.name,
          marital: marital || 'Belirtilmedi',
          gender: gender || 'Belirtilmedi'
        })
      });
      const data = await res.json();
      
      let reading = "✨ Niyetin temiz, yolun açık olsun...";
      let advice = "Gülümse ve akışa güven.";
      
      if (data.text) {
        const niyetMatch = data.text.match(/NIYET:\s*([\s\S]+?)(?:\n([\s\S]+?))?\s*TAVSIYE:/);
        const tavsiyeMatch = data.text.match(/TAVSIYE:\s*([\s\S]+)/);
        if (niyetMatch) {
            reading = niyetMatch[1].trim() + (niyetMatch[2] ? '\n' + niyetMatch[2].trim() : '');
        }
        if (tavsiyeMatch) {
            advice = tavsiyeMatch[1].trim();
        }
      }

      if (data.error) {
        throw new Error(data.error);
      }
      
      setResultData({
        card, nums, energy, reading, advice,
        mani: "Yıldızlar sana gülümsüyor,\nNiyetine kapı aralar,\nKaderden yana dert etme,\nŞansın seninle her an var."
      });
    } catch (e: any) {
      console.error(e);
      setResultData({
        card, nums, energy, 
        reading: `Hata oluştu: ${e.message || 'Bilinmeyen hata'}\nLütfen API anahtarını kontrol et.`, 
        advice: "Sistem şu anda yanıt veremiyor.",
        mani: "Yıldızlar şu an kapalı..."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!resultRef.current) return;
    try {
      const watermark = document.getElementById('shareWatermark');
      if (watermark) watermark.classList.remove('hidden');
      
      const buttons = document.getElementById('resultButtons');
      if (buttons) buttons.classList.add('hidden');

      const canvas = await html2canvas(resultRef.current, { backgroundColor: '#0F021C', scale: 2 });
      
      if (watermark) watermark.classList.add('hidden');
      if (buttons) buttons.classList.remove('hidden');

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'gunun-niyeti.png', { type: 'image/png' });
        const shareText = `🌟 Günün Niyeti 🌟\nSen de kendi niyetini seç!`;
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Günün Niyeti', text: shareText });
        } else {
          navigator.clipboard.writeText(shareText);
          alert('Niyet metniniz kopyalandı! (Görsel paylaşımı bu cihazda desteklenmiyor)');
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
      alert('Paylaşım sırasında bir hata oluştu.');
    }
  };

  const categoryOptions = [
    { name: 'Genel', emoji: '🔮' },
    { name: 'Aşk', emoji: '❤️' },
    { name: 'Kariyer', emoji: '💼' },
    { name: 'Sağlık', emoji: '🧘' },
    { name: 'Para', emoji: '💰' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-[url('/assets/mystical_cosmos.png')] bg-cover bg-center opacity-40 pointer-events-none" />
        
        <motion.div 
          className="relative w-full max-w-md bg-gradient-to-b from-[#0F021C] to-[#05010B] rounded-2xl shadow-2xl border border-[#B19FFB]/20 overflow-hidden h-[85vh] flex flex-col"
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
        >
          {/* Close Button */}
          {step !== 'animation' && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-[#B19FFB] hover:text-white z-50 p-2"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}

          <header className="text-center py-4 relative z-10 border-b border-[#B19FFB]/10">
            <div className="text-[#E6C475] font-bold text-lg tracking-widest uppercase">✨ NİYETCİ ✨</div>
          </header>

          <div className="flex-grow flex flex-col relative z-10 overflow-y-auto" ref={resultRef}>
            
            {/* WELCOME */}
            {step === 'welcome' && (
              <div className="flex-grow flex flex-col justify-end items-center text-center p-6 relative">
                <img 
                  src="/assets/mystical_cosmos.png" 
                  alt="Niyetci" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05010B] via-[#05010B]/20 to-transparent" />
                <button 
                  onClick={() => setStep('form')}
                  className="w-full h-16 relative z-10 shrink-0 bg-[#E6C475] hover:bg-yellow-500 text-[#0F021C] font-extrabold text-lg rounded-2xl shadow-[0_4px_20px_rgba(230,196,117,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  Niyet Et ve Kart Çek
                </button>
              </div>
            )}

            {/* FORM */}
            {step === 'form' && (
              <div className="flex-grow flex flex-col p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-[#E6C475]">Bilgileriniz</h2>
                  <button onClick={() => setStep('welcome')} className="text-[#B19FFB] text-sm">Geri Dön</button>
                </div>
                <p className="text-[#B19FFB] text-xs mb-4">Size en doğru yorumu sunabilmemiz için detayları doldurun.</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-[#E6C475] font-bold text-xs mb-1.5">Niyet Odak Alanını Seç:</label>
                    <div className="grid grid-cols-5 gap-2">
                      {categoryOptions.map(cat => (
                        <button 
                          key={cat.name}
                          onClick={() => { setSelectedCategory(cat.name); setSelectedCategoryEmoji(cat.emoji); }}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedCategory === cat.name ? 'border-[#E6C475] bg-[#E6C475]/20 text-[#E6C475]' : 'border-[#B19FFB]/20 bg-black/40 text-[#B19FFB]'}`}
                        >
                          <span className="text-lg mb-1">{cat.emoji}</span>
                          <span className="text-[9px] font-semibold">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#E6C475] font-bold text-xs mb-1.5">Yaşınız:</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Örn: 25" className="w-full h-11 px-4 rounded-xl border border-[#B19FFB]/30 bg-black/40 text-white text-sm focus:outline-none focus:border-[#E6C475]" />
                  </div>
                  <div>
                    <label className="block text-[#E6C475] font-bold text-xs mb-1.5">Medeni Durumunuz:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Bekar', 'Evli', 'İlişkisi Var'].map(status => (
                        <button key={status} onClick={() => setMarital(status)} className={`h-10 rounded-xl border text-xs font-medium transition-all ${marital === status ? 'border-[#E6C475] bg-[#E6C475]/20 text-[#E6C475]' : 'border-[#B19FFB]/20 bg-black/40 text-[#B19FFB]'}`}>{status}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#E6C475] font-bold text-xs mb-1.5">Cinsiyetiniz:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Kadın', 'Erkek', 'Belirtme'].map(g => (
                        <button key={g} onClick={() => setGender(g)} className={`h-10 rounded-xl border text-xs font-medium transition-all ${gender === g ? 'border-[#E6C475] bg-[#E6C475]/20 text-[#E6C475]' : 'border-[#B19FFB]/20 bg-black/40 text-[#B19FFB]'}`}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#E6C475] font-bold text-xs mb-1.5">Niyetiniz (İsteğe bağlı):</label>
                    <input type="text" value={intention} onChange={e => setIntention(e.target.value)} placeholder="Örn: Yeni iş teklifi hayırlı olacak mı?" className="w-full h-11 px-4 rounded-xl border border-[#B19FFB]/30 bg-black/40 text-white text-sm focus:outline-none focus:border-[#E6C475]" />
                  </div>
                </div>

                <button 
                  onClick={handleStartDraw}
                  className="w-full h-12 mt-auto shrink-0 bg-[#E6C475] hover:bg-yellow-500 text-[#0F021C] font-extrabold text-sm rounded-2xl shadow-[0_4px_15px_rgba(230,196,117,0.3)] transition-all"
                >
                  Şimdi Kartını Seçtir
                </button>
              </div>
            )}

            {/* ANIMATION */}
            {step === 'animation' && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
                <img 
                  src={`/assets/niyetci/frame_${animFrame.toString().padStart(3, '0')}.png`} 
                  alt="Drawing Card"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* RESULT */}
            {step === 'result' && (
              <div className="flex-grow flex flex-col justify-center p-6 relative">
                {isGenerating && !resultData ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#E6C475]">
                    <span className="material-symbols-outlined text-4xl animate-spin mb-4">refresh</span>
                    <p className="font-bold">Yıldızlar okunuyor...</p>
                  </div>
                ) : resultData && (
                  <div className="space-y-5 w-full">
                    <div className="flex flex-col items-center drop-shadow-2xl">
                      <div className="w-20 h-28 bg-gradient-to-b from-[#342456] to-[#160D2A] border-2 border-[#E6C475] rounded-xl flex flex-col justify-center items-center text-[#E6C475] mb-2 shadow-[0_0_20px_rgba(230,196,117,0.5)]">
                        <span className="text-3xl mb-1">{resultData.card.emoji}</span>
                        <span className="text-[10px] font-bold tracking-wide uppercase text-center leading-tight px-1">{resultData.card.name}</span>
                      </div>
                      <span className="text-[11px] text-white italic font-semibold">Kategori: {selectedCategoryEmoji} {selectedCategory}</span>
                    </div>

                    <div className="text-center relative px-2">
                      <p className="text-[#E6C475] font-bold italic text-sm whitespace-pre-line leading-relaxed">{resultData.mani}</p>
                    </div>

                    <div className="text-center py-2">
                      <p className="text-white font-extrabold text-base leading-normal whitespace-pre-line">{resultData.reading}</p>
                    </div>

                    <div>
                      <h3 className="text-[#E6C475] font-extrabold text-[10px] uppercase tracking-wider mb-1 text-center">🌟 Günün Tavsiyesi</h3>
                      <p className="text-white font-medium text-xs leading-relaxed text-center">{resultData.advice}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#B19FFB]/20">
                      <div className="text-center">
                        <span className="block text-[10px] text-[#E6C475] font-extrabold uppercase mb-1">Uğurlu Sayıların</span>
                        <div className="flex justify-center gap-1.5">
                          {resultData.nums.map((n: number, i: number) => (
                            <span key={i} className="w-5 h-5 text-white text-[11px] font-bold flex items-center justify-center">{n}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="block text-[10px] text-[#E6C475] font-extrabold uppercase mb-1">Günün Enerjisi</span>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-white text-lg font-extrabold">%{resultData.energy}</span>
                          <span className="text-xs">⚡</span>
                        </div>
                      </div>
                    </div>

                    <div id="shareWatermark" className="hidden text-center mt-4 pt-2 border-t border-[#B19FFB]/20">
                      <p className="text-[#E6C475] font-extrabold text-sm">✨ Günün Niyeti ✨</p>
                      <p className="text-white font-bold text-xs mt-1">falbaz.com</p>
                    </div>

                    <div id="resultButtons" className="flex flex-col gap-3 mt-4">
                      <button onClick={handleShare} className="w-full h-11 bg-[#2d1b4e]/80 hover:bg-[#342456] text-[#E6C475] border border-[#E6C475]/50 font-extrabold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(230,196,117,0.2)]">
                        ✨ Niyetimi Paylaş
                      </button>
                      <button onClick={() => setStep('welcome')} className="w-full h-11 bg-black/60 hover:bg-[#B19FFB]/30 text-white border border-[#B19FFB]/50 font-bold text-xs rounded-xl transition-all">
                        Yeniden Niyet Et
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
