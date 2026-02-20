'use client';

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/112233.jpg')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal text-white leading-tight mb-6 animate-fade-in">
          شقق جديدة للبيع في دبي بأسعار تبدأ من 750,000 درهم إماراتي
        </h1>

        <p className="text-lg md:text-xl text-[#c9c9c9] mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          مجموعة كاملة من العقارات من المطور. وفر وقتك في استكشاف السوق ، مع استشارة مجانية حول جميع المشاريع في مكان واحد
        </p>

        <button
          onClick={onCtaClick}
          className="quiz-btn-glow bg-gradient-to-l from-[#a39466] to-[#b8a775] text-[#171717] font-bold text-lg md:text-xl px-10 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(163,148,102,0.4)] hover:-translate-y-0.5 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          اختيار العقارات
        </button>

      </div>
    </section>
  );
}
