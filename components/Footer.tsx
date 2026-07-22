"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-secondary/20 mt-20 z-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 px-5 md:px-[120px] py-16 w-full mx-auto max-w-full">
        {/* Brand Info */}
        <div className="flex flex-col gap-4 max-w-xs">
          <img 
            src="/assets/logo.png" 
            alt="FalBaz Logo" 
            className="h-10 w-auto object-contain self-start"
          />
          <p className="text-on-surface-variant/60 text-sm leading-relaxed">
            © {currentYear} FalBaz. Modern Ruhlar İçin Dijital Fal Deneyimi.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-x-12 gap-y-3 mt-6 md:mt-0">
          <a 
            className="text-sm font-semibold tracking-wider text-on-surface-variant/60 hover:text-secondary hover:translate-x-1 transition-all duration-300 transform" 
            href="#"
          >
            Kahvenin Tarihçesi
          </a>
          <a 
            className="text-sm font-semibold tracking-wider text-on-surface-variant/60 hover:text-secondary hover:translate-x-1 transition-all duration-300 transform" 
            href="#"
          >
            Demleme Ritüelleri
          </a>
          <a 
            className="text-sm font-semibold tracking-wider text-on-surface-variant/60 hover:text-secondary hover:translate-x-1 transition-all duration-300 transform" 
            href="#"
          >
            Burç Yorumları
          </a>
          <a 
            className="text-sm font-semibold tracking-wider text-on-surface-variant/60 hover:text-secondary hover:translate-x-1 transition-all duration-300 transform" 
            href="#"
          >
            Kader Koşulları
          </a>
          <a 
            className="text-sm font-semibold tracking-wider text-on-surface-variant/60 hover:text-secondary hover:translate-x-1 transition-all duration-300 transform" 
            href="#"
          >
            Gizlilik Politikası
          </a>
        </div>
      </div>
    </footer>
  );
}
