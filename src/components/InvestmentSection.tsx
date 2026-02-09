'use client';

import Image from 'next/image';

const benefits = [
  'طلب مرتفع على الإيجار طوال العام',
  'عائدات سنوية نموذجية بين 6-9% (حسب الموقع وفئة الأصل)',
  'تملك حر للأجانب في مناطق محددة',
  'رقابة هيئة التنظيم العقاري وحسابات ضمان للمشاريع على الخارطة',
  'ارتباط الدرهم الإماراتي بالدولار الأمريكي يقلل مخاطر سعر الصرف',
  'خطط سداد مرنة من المطور (تشمل خيارات ما بعد التسليم)',
  'بنية تحتية عالمية واتصال عالمي',
  'أسواق أولية وثانوية عالية السيولة',
  'عمولة 0% عند الشراء مباشرة من المطور',
];

export default function InvestmentSection() {
  return (
    <section className="relative bg-[#171717] py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(163,148,102,0.12),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05),transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="absolute -inset-6 bg-[radial-gradient(circle,rgba(163,148,102,0.2),transparent_65%)] blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden border border-[#2b2b2b] shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
              <Image
                src="/images/dubai-skyline.jpg"
                alt="أفق دبي"
                width={900}
                height={900}
                className="w-full h-auto object-cover"
                priority={false}
              />
            </div>
          </div>

          <div>
            <p className="text-[#a39466] text-sm tracking-[0.2em] mb-4">الاستثمار العقاري في الإمارات</p>
            <h2 className="text-3xl md:text-4xl text-white font-semibold leading-tight mb-6">
              استثمر في الإمارات بأمان وربحية
            </h2>
            <ul className="space-y-4">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#c9c9c9]">
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#a39466] shadow-[0_0_10px_rgba(163,148,102,0.6)]" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
