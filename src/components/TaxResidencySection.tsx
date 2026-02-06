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
    <section className="relative bg-[#111822] py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(163,148,102,0.1),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#2a3240] bg-[#10161f]/90 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <p className="text-sm text-[#a39466] tracking-widest">وفّر في الضرائب</p>
            <div className="mt-6 space-y-6">
              {taxItems.map((item, index) => (
                <div key={item.text}>
                  <div className="grid grid-cols-[auto,1fr] gap-6 items-center">
                    <div className="text-4xl md:text-5xl font-bold text-[#a39466]">
                      {item.value}
                    </div>
                    <p className="text-[#c9c9c9] leading-relaxed">{item.text}</p>
                  </div>
                  {index === 0 ? <div className="mt-6 h-px bg-[#2a3240]" /> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#2a3240] bg-[#10161f]/90 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <p className="text-sm text-[#a39466] tracking-widest">الإقامة عبر التملك</p>
            <div className="mt-6 space-y-6">
              {residencyItems.map((item, index) => (
                <div key={item.title}>
                  <p className="text-white font-bold mb-2">{item.title}</p>
                  <p className="text-[#c9c9c9] leading-relaxed">{item.text}</p>
                  {index === 0 ? <div className="mt-6 h-px bg-[#2a3240]" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
