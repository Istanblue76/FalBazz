"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NiyetGonderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const rituals = [
  {
    id: "yakmak",
    title: "Yakmak (Serbest Bırakma)",
    emoji: "🔥",
    desc: "En yaygın ritüellerden biridir. Yazılan niyetin ateşte yakılarak dumanıyla birlikte evrene ulaştığına ve enerjinin serbest kaldığına inanılır. Bu, aynı zamanda bir şeye olan takıntıyı veya direnci kırmak (letting go) için de yapılır.",
    color: "from-red-500/20 to-orange-500/20",
    borderColor: "border-orange-500/40"
  },
  {
    id: "su_toprak",
    title: "Suya veya Toprağa Bırakmak",
    emoji: "🌊",
    desc: "Akarsu, deniz veya toprağa gömme ritüelidir. Özellikle Türk kültüründeki Hıdırellez geleneğinde, gül dalına asılan niyetlerin ertesi gün suya bırakılması, dileğin su gibi akıp yolunu bulmasını veya toprak gibi bereketlenip yeşermesini sembolize eder.",
    color: "from-blue-500/20 to-emerald-500/20",
    borderColor: "border-emerald-500/40"
  },
  {
    id: "yastik",
    title: "Yastık Altına Koymak",
    emoji: "🛏️",
    desc: "Niyetin yazıldığı kağıdı uyurken yastığın altına koymak, bilinçaltını o hedefe veya düşünceye programlamak amacıyla yapılır.",
    color: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-indigo-500/40"
  },
  {
    id: "tutsu_saklamak",
    title: "Tütsülemek veya Katlayıp Saklamak",
    emoji: "💨",
    desc: "Niyet kağıdını adaçayı veya palo santo gibi tütsülerle arındırdıktan sonra bir cüzdanda, kolyede veya özel bir kutuda 'tılsım' gibi taşımaktır.",
    color: "from-yellow-500/20 to-amber-500/20",
    borderColor: "border-amber-500/40"
  }
];

export default function NiyetGonderModal({ isOpen, onClose }: NiyetGonderModalProps) {
  const [step, setStep] = useState<'intro' | 'write' | 'animation' | 'result'>('intro');
  const [intention, setIntention] = useState("");
  const [selectedRitual, setSelectedRitual] = useState(rituals[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState("");
  const [adviceText, setAdviceText] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setIntention("");
      setResultText("");
      setAdviceText("");
    }
  }, [isOpen]);

  const handlePerformRitual = async () => {
    if (!intention.trim()) return;
    setStep('animation');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/niyet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: "Kağıt Ritüeli",
          intention: intention,
          cardName: selectedRitual.title,
          ritualType: selectedRitual.id
        })
      });
      const data = await res.json();
      
      let reading = "✨ Niyetiniz gök kubbede yerini aldı. Kozmik frekanslar dileğiniz doğrultusunda hizalanıyor.";
      let advice = "Zihninizi serbest bırakın ve akışın getireceği mucizelere kapınızı açık tutun.";
      
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

      setResultText(reading);
      setAdviceText(advice);
    } catch (e) {
      console.error(e);
      setResultText("✨ Kozmik bağ kuruldu. Yazılan niyetin enerjisi serbest kalarak evrensel döngüye karıştı.");
      setAdviceText("İnancınızı yüksek tutun, doğru zamanda kapılar açılacaktır.");
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setStep('result');
      }, 3500); // Allow animation to play
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-[url('/assets/mystical_cosmos.png')] bg-cover bg-center opacity-30 pointer-events-none" />

        <motion.div
          className="relative w-full max-w-lg bg-gradient-to-b from-[#131408] to-[#0a0a04] rounded-2xl shadow-2xl border border-secondary/20 overflow-hidden min-h-[500px] flex flex-col p-6 md:p-8 text-on-surface"
          initial={{ scale: 0.95, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 30, opacity: 0 }}
        >
          {/* Close Button */}
          {step !== 'animation' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white p-2 text-xs font-semibold rounded-full border border-secondary/20 bg-surface-container hover:bg-surface-container-high transition-all duration-200 cursor-pointer"
            >
              Kapat
            </button>
          )}

          {/* INTRO */}
          {step === 'intro' && (
            <div className="flex-grow flex flex-col justify-between gap-6 py-4">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-secondary/30 rounded-full bg-surface-container/50 w-fit">
                  <span className="material-symbols-outlined text-secondary text-[16px] animate-pulse">auto_awesome</span>
                  <span className="text-[10px] font-semibold tracking-widest text-secondary uppercase">
                    Kağıda Dökme Ritüeli
                  </span>
                </div>
                <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
                  Niyetinizi Evrene Bırakın
                </h2>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                  Niyetleri kağıda dökmek, düşünceleri somutlaştırmanın ve zihni belirli bir hedefe odaklamanın en bilinen yollarından biridir.
                </p>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                  Niyet yazıldıktan sonra kağıda ne yapılacağı, kişinin bu sürece psikolojik, spiritüel veya geleneksel bir açıdan yaklaşmasına bağlı olarak değişiklik gösterir.
                </p>
              </div>

              <button
                onClick={() => setStep('write')}
                className="w-full py-4 mt-4 rounded-xl font-bold text-on-secondary bg-secondary hover:bg-secondary-fixed transition-all duration-300 shadow-lg cursor-pointer text-xs tracking-wider uppercase"
              >
                Ritüeli Başlat
              </button>
            </div>
          )}

          {/* WRITE & SELECT */}
          {step === 'write' && (
            <div className="flex-grow flex flex-col justify-between gap-5 py-2">
              <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">
                    Niyetinizi Kağıda Yazın
                  </label>
                  <div className="relative rounded-xl border border-secondary/20 p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d1e0f] to-[#0e0f04] shadow-inner">
                    {/* Lines effect on paper */}
                    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(202,176,128,0.15)_1px,_transparent_1px)] bg-[size:100%_24px] mt-4" />
                    
                    <textarea
                      required
                      value={intention}
                      onChange={(e) => setIntention(e.target.value)}
                      placeholder="Buraya içinizden geçen, gerçekleşmesini dilediğiniz niyetinizi tüm samimiyetinizle yazın..."
                      className="w-full bg-transparent text-on-surface placeholder-neutral-700 focus:outline-none text-sm leading-relaxed h-28 resize-none relative z-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
                    Niyet Kağıdına Ne Yapılacak?
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {rituals.map((rit) => (
                      <button
                        key={rit.id}
                        onClick={() => setSelectedRitual(rit)}
                        className={`p-3.5 rounded-xl border text-left transition-all duration-350 cursor-pointer flex gap-3.5 ${
                          selectedRitual.id === rit.id
                            ? `bg-gradient-to-r ${rit.color} border-secondary text-on-surface shadow-md`
                            : "bg-[#0e0f04] border-secondary/15 text-neutral-400 hover:border-secondary/35"
                        }`}
                      >
                        <span className="text-2xl mt-0.5 shrink-0">{rit.emoji}</span>
                        <div className="space-y-0.5">
                          <h4 className={`text-xs font-bold ${selectedRitual.id === rit.id ? "text-secondary" : "text-on-surface"}`}>
                            {rit.title}
                          </h4>
                          <p className="text-[10px] leading-relaxed font-light text-on-surface-variant/80">
                            {rit.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('intro')}
                  className="px-4 py-3.5 rounded-xl border border-secondary/20 text-neutral-400 hover:text-white hover:bg-surface-container/50 transition-all text-xs tracking-wider uppercase font-semibold cursor-pointer"
                >
                  Geri
                </button>
                <button
                  type="button"
                  disabled={!intention.trim()}
                  onClick={handlePerformRitual}
                  className="flex-1 py-3.5 rounded-xl font-bold text-on-secondary bg-secondary hover:bg-secondary-fixed transition-all duration-300 shadow-lg cursor-pointer text-xs tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ritüeli Gerçekleştir
                </button>
              </div>
            </div>
          )}

          {/* ANIMATION SIMULATION */}
          {step === 'animation' && (
            <div className="flex-grow flex flex-col items-center justify-center py-12 relative overflow-hidden">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Ritual Simulation Visuals */}
                {selectedRitual.id === "yakmak" && (
                  <>
                    <motion.div 
                      className="absolute bottom-6 w-24 h-32 bg-gradient-to-t from-orange-600 via-red-500 to-yellow-300 rounded-full blur-md opacity-70"
                      animate={{ scale: [1, 1.15, 0.95, 1], rotate: [-2, 3, -1, 2] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                    <motion.div 
                      className="w-24 h-16 bg-neutral-200/90 border border-amber-800 rounded-sm relative z-10 shadow-lg"
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -60, scale: 0.7, rotate: 10 }}
                      transition={{ duration: 3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-amber-950/20 to-transparent" />
                    </motion.div>
                  </>
                )}

                {selectedRitual.id === "su_toprak" && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <motion.div 
                      className="w-16 h-10 bg-neutral-200/80 border rounded-sm shadow-md"
                      animate={{ y: [0, 15, 30, 45], opacity: [1, 0.8, 0.4, 0], rotate: [0, 8, -5, 5] }}
                      transition={{ duration: 3 }}
                    />
                    <div className="absolute bottom-4 w-32 h-6 bg-blue-600/30 rounded-full blur-sm animate-pulse" />
                  </div>
                )}

                {selectedRitual.id === "yastik" && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <motion.div 
                      className="w-28 h-12 bg-indigo-950/60 border border-indigo-500/30 rounded-lg shadow-inner flex items-center justify-center relative"
                      animate={{ scale: [0.95, 1.05, 0.95] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <span className="text-xl">🛏️</span>
                    </motion.div>
                    <motion.div 
                      className="w-14 h-8 bg-neutral-200/90 border rounded-xs absolute"
                      initial={{ y: -40, opacity: 0 }}
                      animate={{ y: 5, opacity: [0, 1, 1, 0.7] }}
                      transition={{ duration: 2.5 }}
                    />
                  </div>
                )}

                {selectedRitual.id === "tutsu_saklamak" && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <motion.div 
                      className="absolute bottom-2 text-2xl"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      🪵
                    </motion.div>
                    <motion.div 
                      className="w-20 h-1 bg-white/40 rounded-full blur-xs"
                      animate={{ y: [-15, -45], opacity: [0.7, 0], scale: [1, 1.8], x: [-5, 5, -2] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                    />
                    <motion.div 
                      className="w-12 h-8 bg-neutral-200/90 border rounded-sm relative z-10"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3 }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-8 text-center space-y-2 z-10">
                <h4 className="font-headline text-lg font-bold text-secondary animate-pulse">
                  {selectedRitual.id === "yakmak" && "Niyetiniz Serbest Kalıyor..."}
                  {selectedRitual.id === "su_toprak" && "Doğanın Kollarına Bırakılıyor..."}
                  {selectedRitual.id === "yastik" && "Bilinçaltınıza Mühürleniyor..."}
                  {selectedRitual.id === "tutsu_saklamak" && "Enerjisi Arındırılıyor..."}
                </h4>
                <p className="text-xs text-on-surface-variant font-light max-w-xs leading-relaxed">
                  Evrensel döngü ile rezonans kuruluyor. Lütfen gözlerinizi kapatın ve niyetinizin gerçekleştiğini imgeleyin.
                </p>
              </div>
            </div>
          )}

          {/* RESULT BLESSING */}
          {step === 'result' && (
            <div className="flex-grow flex flex-col justify-between gap-6 py-2">
              <div className="space-y-5 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary flex items-center justify-center text-3xl shadow-lg">
                    {selectedRitual.emoji}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                    Ritüel Gerçekleştirildi ({selectedRitual.title})
                  </span>
                  <h3 className="font-headline text-2xl font-bold text-secondary">
                    Niyetiniz Kozmosa İletildi
                  </h3>
                </div>

                <div className="bg-[#0e0f04] border border-secondary/15 rounded-xl p-5 shadow-inner relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <span className="material-symbols-outlined text-[60px] text-secondary">auto_awesome</span>
                  </div>
                  
                  <p className="text-sm md:text-base text-on-surface font-light leading-relaxed whitespace-pre-line">
                    {resultText}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Evrensel Tavsiye
                  </h4>
                  <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                    {adviceText}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 mt-2 rounded-xl font-bold text-on-secondary bg-secondary hover:bg-secondary-fixed transition-all duration-300 shadow-lg cursor-pointer text-xs tracking-wider uppercase"
              >
                Teşekkürler, Kabul Olsun
              </button>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
