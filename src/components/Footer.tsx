'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#171717] border-t border-[#333]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:justify-items-center md:text-center">
          {/* Logo */}
          <div className="flex justify-center md:justify-center md:mt-10">
            <Image
              src="/images/logo.png"
              alt="Metrika"
              width={190}
              height={64}
              className="h-12 md:h-14 w-auto mb-4"
            />
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-[#c9c9c9]">
              <li className="flex items-start gap-2 md:justify-center">
                <svg className="w-5 h-5 text-[#a39466] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>دبي، برج أونيكس 2، مكتب 1004</span>
              </li>
              <li className="flex items-center gap-2 md:justify-center">
                <svg className="w-5 h-5 text-[#a39466]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:metrika.realestate@metrika.ae" className="hover:text-[#a39466] transition-colors">
                  metrika.realestate@metrika.ae
                </a>
              </li>
              <li className="flex items-center gap-2 md:justify-center">
                <svg className="w-5 h-5 text-[#a39466]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+97143376775" className="hover:text-[#a39466] transition-colors">
                  +971 4 337 67 75
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-bold mb-4">السياسات</h4>
            <ul className="space-y-2 text-[#c9c9c9]">
              <li>
                <a href="#" className="hover:text-[#a39466] transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#a39466] transition-colors">
                  سياسة ملفات تعريف الارتباط
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#a39466] transition-colors">
                  شروط الاستخدام
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#333] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#666] text-sm">
            © 2026 Metrika. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
