"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { Product } from "@/data/products";

interface ProductTextOverlaysProps {
  scrollYProgress: MotionValue<number>;
  product: Product;
}

export default function ProductTextOverlays({
  scrollYProgress,
  product,
}: ProductTextOverlaysProps) {
  // Translate scroll progress to opacity and translation for each text section
  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.22], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.22], [0, -100]);

  const opacity2 = useTransform(
    scrollYProgress,
    [0.2, 0.28, 0.42, 0.48],
    [0, 1, 1, 0]
  );
  const y2 = useTransform(scrollYProgress, [0.2, 0.28, 0.42, 0.48], [100, 0, 0, -100]);

  const opacity3 = useTransform(
    scrollYProgress,
    [0.46, 0.54, 0.68, 0.74],
    [0, 1, 1, 0]
  );
  const y3 = useTransform(scrollYProgress, [0.46, 0.54, 0.68, 0.74], [100, 0, 0, -100]);

  const opacity4 = useTransform(
    scrollYProgress,
    [0.72, 0.8, 0.92, 0.99],
    [0, 1, 1, 0]
  );
  const y4 = useTransform(scrollYProgress, [0.72, 0.8, 0.92, 0.99], [100, 0, 0, -100]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 w-full h-full">
      {/* Section 1: Hero */}
      <motion.div
        style={{ opacity: opacity1, y: y1 }}
        className="absolute inset-0 flex flex-col items-center justify-start pt-[12vh] md:pt-[15vh] text-center px-6 h-screen"
      >
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-secondary mb-3 flex items-center gap-1.5 glow-text-gold">
          <span className="material-symbols-outlined text-[16px]">flare</span>
          Mistik Fal Deneyimi
        </span>
      </motion.div>
 
      {/* Section 2: Telve Description */}
      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-[120px] h-screen max-w-2xl text-left"
      >
        <div className="bg-[#131408]/65 backdrop-blur-md border border-secondary/15 rounded-2xl p-6 md:p-8 shadow-xl pointer-events-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-secondary/30 rounded-full bg-surface-container/50 mb-4">
            <span className="material-symbols-outlined text-secondary text-[16px]">psychology</span>
            <span className="text-[10px] font-semibold tracking-widest text-secondary uppercase">
              01 / SIRLAR
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface mb-4 leading-tight">
            {product.section2.title}
          </h2>
          <p className="text-base md:text-lg text-on-surface-variant leading-relaxed font-light">
            {product.section2.subtitle}
          </p>
        </div>
      </motion.div>
 
      {/* Section 3: Gelecek & Kısmet */}
      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="absolute inset-0 flex flex-col items-end justify-center px-6 md:px-[120px] h-screen w-full text-right ml-auto max-w-7xl"
      >
        <div className="max-w-xl bg-[#131408]/65 backdrop-blur-md border border-secondary/15 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col items-end pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 border border-secondary/30 rounded-full bg-surface-container/50 mb-4">
            <span className="material-symbols-outlined text-secondary text-[16px]">stars</span>
            <span className="text-[10px] font-semibold tracking-widest text-secondary uppercase">
              02 / KISMET
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface mb-4 leading-tight">
            {product.section3.title}
          </h2>
          <p className="text-base md:text-lg text-on-surface-variant leading-relaxed font-light">
            {product.section3.subtitle}
          </p>
        </div>
      </motion.div>
 
      {/* Section 4: Gerçek Hissiyat */}
      <motion.div
        style={{ opacity: opacity4, y: y4 }}
        className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-[120px] h-screen max-w-2xl text-left"
      >
        <div className="bg-[#131408]/65 backdrop-blur-md border border-secondary/20 rounded-2xl p-6 md:p-8 shadow-xl pointer-events-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-secondary/30 rounded-full bg-surface-container/50 mb-4 self-start">
            <span className="material-symbols-outlined text-secondary text-[16px]">auto_awesome</span>
            <span className="text-[10px] font-semibold tracking-widest text-secondary uppercase">
              03 / SEZGİ
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface mb-4">
            Telvelerin Dili
          </h2>
          <p className="text-base md:text-lg text-on-surface-variant max-w-xl font-light leading-relaxed">
            Fincandaki her kıvrım, her gölge bir hikaye anlatır. Doğru niyetle, doğru yoruma ulaşın.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
