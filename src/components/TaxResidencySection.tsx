'use client';

const taxItems = [
  {
    value: '0%',
    text: 'ضريبة أرباح رأس المال عند إعادة البيع (للأفراد)',
  },
  {
    value: '0%',
    text: 'ضريبة الدخل الشخصي على دخل الإيجار',
  },
];

const residencyItems = [
  {
    title: 'تأشيرة مستثمر (سنتان):',
    text: 'ابتداءً من قيمة عقار 750,000 درهم إماراتي',
  },
  {
    title: 'الإقامة الذهبية (10 سنوات):',
    text: 'ابتداءً من قيمة عقار 2,000,000 درهم إماراتي',
  },
];

export default function TaxResidencySection() {
  return (
    <section className="relative bg-[#171717] py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(163,148,102,0.06),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.03),transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#333] bg-[#1b1b1b] p-8 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <p className="text-sm text-[#a39466] tracking-widest">وفّر في الضرائب</p>
            <div className="mt-6 grid gap-6">
              <div className="min-h-[88px] md:min-h-[120px] flex items-center">
                <div className="grid grid-cols-[auto,1fr] gap-6 items-center w-full">
                  <div className="text-4xl md:text-5xl font-bold text-[#a39466]">
                    {taxItems[0].value}
                  </div>
                  <p className="text-[#c9c9c9] leading-relaxed">{taxItems[0].text}</p>
                </div>
              </div>
              <div className="my-6 h-px bg-[#2b2b2b]" />
              <div className="min-h-[88px] md:min-h-[120px] flex items-center">
                <div className="grid grid-cols-[auto,1fr] gap-6 items-center w-full">
                  <div className="text-4xl md:text-5xl font-bold text-[#a39466]">
                    {taxItems[1].value}
                  </div>
                  <p className="text-[#c9c9c9] leading-relaxed">{taxItems[1].text}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#333] bg-[#1b1b1b] p-8 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <p className="text-sm text-[#a39466] tracking-widest">الإقامة عبر التملك</p>
            <div className="mt-6 grid gap-6">
              <div className="min-h-[88px] md:min-h-[120px] flex flex-col justify-center">
                <p className="text-white font-bold mb-2">{residencyItems[0].title}</p>
                <p className="text-[#c9c9c9] leading-relaxed">{residencyItems[0].text}</p>
              </div>
              <div className="my-6 h-px bg-[#2b2b2b]" />
              <div className="min-h-[88px] md:min-h-[120px] flex flex-col justify-center">
                <p className="text-white font-bold mb-2">{residencyItems[1].title}</p>
                <p className="text-[#c9c9c9] leading-relaxed">{residencyItems[1].text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
