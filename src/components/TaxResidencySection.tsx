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
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-[#2b2b2b] bg-[#171717]/75 p-6 backdrop-blur-[1px]">
        <p className="text-sm text-[#a39466] tracking-widest">وفّر في الضرائب</p>
        <div className="mt-4 grid gap-4">
          <div className="h-16 md:h-20 flex items-center">
            <div className="flex items-center gap-4 w-full">
              <div className="text-4xl md:text-5xl font-bold text-[#a39466]">
                {taxItems[0].value}
              </div>
              <p className="text-[#c9c9c9] text-sm md:text-base leading-relaxed whitespace-nowrap">
                {taxItems[0].text}
              </p>
            </div>
          </div>
          <div className="my-4 h-px bg-[#2b2b2b]" />
          <div className="h-16 md:h-20 flex items-center">
            <div className="flex items-center gap-4 w-full">
              <div className="text-4xl md:text-5xl font-bold text-[#a39466]">
                {taxItems[1].value}
              </div>
              <p className="text-[#c9c9c9] text-sm md:text-base leading-relaxed whitespace-nowrap">
                {taxItems[1].text}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#2b2b2b] bg-[#171717]/75 p-6 backdrop-blur-[1px]">
        <p className="text-sm text-[#a39466] tracking-widest">الإقامة عبر التملك</p>
        <div className="mt-4 grid gap-4">
          <div className="min-h-[64px] md:min-h-[80px] flex flex-col justify-center">
            <p className="text-white font-bold mb-1">{residencyItems[0].title}</p>
            <p className="text-[#c9c9c9] text-sm md:text-base leading-relaxed whitespace-nowrap">{residencyItems[0].text}</p>
          </div>
          <div className="my-4 h-px bg-[#2b2b2b]" />
          <div className="min-h-[64px] md:min-h-[80px] flex flex-col justify-center">
            <p className="text-white font-bold mb-1">{residencyItems[1].title}</p>
            <p className="text-[#c9c9c9] text-sm md:text-base leading-relaxed whitespace-nowrap">{residencyItems[1].text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
