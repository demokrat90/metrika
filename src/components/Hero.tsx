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
          backgroundImage: "url('/images/dubai-skyline.jpg')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal text-white leading-tight mb-6 animate-fade-in">
          شقق جديدة للبيع في دبي
          <br />
          <span className="text-[#a39466]">
            بأسعار تبدأ من 750,000 درهم إماراتي
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#c9c9c9] mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          استثمر في العقارات الفاخرة في دبي مع خبراء السوق المحليين
        </p>

        <button
          onClick={onCtaClick}
          className="btn-flash text-[#171717] font-bold text-lg md:text-xl px-10 py-4 rounded transition-all duration-300 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          اختيار العقارات
        </button>

      </div>
    </section>
  );
}
