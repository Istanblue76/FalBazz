"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Product } from "@/data/products";
import ProductTextOverlays from "./ProductTextOverlays";

interface ProductBottleScrollProps {
  product: Product;
}

const heroImageMap: Record<string, string> = {
  klasik: "/assets/hero_geleneksel.jpg",
  ask: "/assets/hero_yildiz.jpg",
  bereket: "/assets/hero_sarayli.jpg",
};

export default function ProductBottleScroll({ product }: ProductBottleScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalFrames = 41;

  // Track the current frame index via ref to avoid React re-render overhead during fast scrolls
  const currentFrameRef = useRef(0);

  // Hook into framer-motion scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background pouring image fades out as we scroll down at the very end of the scroll container
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85, 0.95], [0.6, 0.6, 0]);

  // Track viewport width for responsive transforms
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Transform canvas scale (scale)
  const canvasScale = useTransform(
    scrollYProgress,
    [0, 0.22, 0.9, 1.0],
    isMobile
      ? [1.35, 1.6, 1.6, 1.15]
      : [1.2, 1.3, 1.3, 0.85]
  );

  // Preload images
  useEffect(() => {
    setIsLoaded(false);
    setLoadedCount(0);
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      // Assets are under /assets/turk-kahvasi_frames/{i}.webp
      img.src = `/assets/turk-kahvasi_frames/${i}.webp`;
      img.onload = () => {
        count++;
        setLoadedCount(count);
        if (count === totalFrames) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        console.error(`Failed to load coffee frame: ${img.src}`);
        count++;
        setLoadedCount(count);
        if (count === totalFrames) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      loadedImages.push(img);
    }
  }, []);

  // Draw frame to canvas
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[frameIndex];
    if (!img) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions for "contain" fit
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let drawX = 0;
    let drawY = 0;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.width / imgRatio;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawX = (canvas.width - drawWidth) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  };

  // Handle resizing
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    drawFrame(currentFrameRef.current);
  };

  // Resize listener
  useEffect(() => {
    if (!isLoaded) return;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isLoaded, images]);

  // Scroll listener mapped to frame index
  useEffect(() => {
    if (!isLoaded) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map scroll progress (0-1) to frame index (0-40)
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(latest * totalFrames)
      );

      if (currentFrameRef.current !== frameIndex) {
        currentFrameRef.current = frameIndex;
        requestAnimationFrame(() => drawFrame(frameIndex));
      }
    });

    // Draw the initial frame
    drawFrame(0);

    return () => unsubscribe();
  }, [isLoaded, images, scrollYProgress]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "450vh" }}>
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#131408] text-[#e5e3ce]">
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-secondary animate-pulse">local_cafe</span>
              <div className="absolute inset-0 w-full h-full bg-secondary/10 rounded-full blur-xl animate-pulse" />
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <img 
                src="/assets/logo.webp" 
                alt="FalBaz Logo" 
                className="h-14 w-auto object-contain animate-pulse"
              />
              <p className="text-sm text-on-surface-variant/80 font-light mt-1">
                Hanenizin sırları telvelere işleniyor...
              </p>
            </div>
            <div className="w-64 bg-surface-container border border-white/5 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-secondary to-amber-300 h-full transition-all duration-300 ease-out"
                style={{ width: `${(loadedCount / totalFrames) * 100}%` }}
              />
            </div>
            <span className="text-xs text-secondary/85 font-mono tracking-widest">
              {Math.round((loadedCount / totalFrames) * 100)}% YÜKLENDİ
            </span>
          </div>
        </div>
      )}

      {/* Sticky Canvas Viewport */}
      <div 
        className="w-full flex items-center justify-center overflow-hidden z-10"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        {/* Pouring Coffee Background Image (Sticky) */}
        <motion.div 
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
          style={{ 
            opacity: bgOpacity,
            backgroundImage: `url('${heroImageMap[product.id] || "/assets/hero_geleneksel.jpg"}')`
          }}
        />
        {/* Gradient overlay to blend into the background surface color (Sticky) */}
        <motion.div 
          className="absolute inset-0 z-0 bg-gradient-to-b from-[#131408]/20 via-[#131408]/60 to-[#131408] pointer-events-none"
          style={{ opacity: bgOpacity }}
        />
        {/* Soft radial glow behind coffee cup */}
        <div 
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[140px] opacity-15 pointer-events-none transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle, ${product.themeColor} 0%, transparent 70%)` 
          }}
        />

        <motion.canvas
          ref={canvasRef}
          style={{ 
            scale: canvasScale 
          }}
          className="w-full h-full max-h-[65vh] max-w-[100vw] md:max-h-[90vh] md:max-w-[45vw] object-contain pointer-events-none z-10"
        />

        {/* Text Overlays linked to scroll */}
        {isLoaded && (
          <ProductTextOverlays
            scrollYProgress={scrollYProgress}
            product={product}
          />
        )}
      </div>
    </div>
  );
}
