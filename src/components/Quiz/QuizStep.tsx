'use client';

import { QuizStep as QuizStepType } from '@/lib/quiz-data';
import PhoneInput from '@/components/PhoneInput';

interface QuizStepProps {
  step: QuizStepType;
  selectedValue: string | string[] | undefined;
  contactInfo: {
    fullName: string;
    phone: string;
    contactMethod: string;
  };
  onSelect: (value: string) => void;
  onContactChange: (field: string, value: string) => void;
}

export default function QuizStep({
  step,
  selectedValue,
  contactInfo,
  onSelect,
  onContactChange,
}: QuizStepProps) {
  const isSelected = (optionValue: string) => {
    if (step.type === 'contact') {
      return contactInfo.contactMethod === optionValue;
    }
    return selectedValue === optionValue;
  };

  return (
    <div className="quiz-step-animate">
      {/* Step Title with decorative elements */}
      <div className="relative mb-12">
        <div className="absolute right-1/2 translate-x-1/2 -top-4 w-16 h-[2px] bg-gradient-to-l from-transparent via-[#a39466] to-transparent" />
        <h2 className="text-2xl md:text-4xl text-white text-center font-bold leading-relaxed">
          {step.title}
        </h2>
        <div className="absolute right-1/2 translate-x-1/2 -bottom-4 w-24 h-[2px] bg-gradient-to-l from-transparent via-[#a39466] to-transparent" />
      </div>

      {/* Options Grid */}
      {step.options && (
        <div className={`grid gap-5 max-w-3xl mx-auto ${
          step.options.length <= 3
            ? 'grid-cols-1 md:grid-cols-3'
            : step.options.length === 4
              ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-2 md:grid-cols-3'
        }`}>
          {step.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => {
                if (step.type === 'contact') {
                  onContactChange('contactMethod', option.value);
                } else {
                  onSelect(option.value);
                }
              }}
              className={`
                quiz-card group relative px-6 py-5 rounded-2xl transition-all duration-500 flex items-center justify-center min-h-[70px]
                ${isSelected(option.value)
                  ? 'quiz-card-selected bg-gradient-to-br from-[#a39466]/20 to-[#a39466]/5 border-[#a39466] shadow-[0_0_30px_rgba(163,148,102,0.4)]'
                  : 'bg-[#1f1f1f] border-[#333] hover:border-[#a39466]/50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1'
                }
                border-2 overflow-hidden
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect on selected */}
              {isSelected(option.value) && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#a39466]/10 to-transparent pointer-events-none" />
              )}

              {/* Label */}
              <span className={`text-lg font-medium transition-colors duration-300 relative z-10 ${
                isSelected(option.value) ? 'text-[#a39466]' : 'text-white group-hover:text-[#a39466]'
              }`}>
                {option.label}
              </span>

              {/* Selection indicator */}
              <div className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                isSelected(option.value)
                  ? 'border-[#a39466] bg-[#a39466]'
                  : 'border-[#444] group-hover:border-[#a39466]/50'
              }`}>
                {isSelected(option.value) && (
                  <svg className="w-4 h-4 text-[#171717]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Corner accent */}
              <div className={`absolute bottom-0 right-0 w-12 h-12 transition-opacity duration-300 ${
                isSelected(option.value) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
              }`}>
                <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#a39466]/30 to-transparent rounded-tl-full" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Contact Fields */}
      {step.type === 'contact' && step.fields && (
        <div className="max-w-lg mx-auto mt-10 space-y-6">
          {step.fields.map((field) => (
            <div key={field.name} className="group">
              <label className="block text-[#a39466] text-sm font-medium mb-3 tracking-wide">
                {field.label}
              </label>
              {field.type === 'tel' ? (
                <PhoneInput
                  value={contactInfo.phone}
                  onChange={(value) => onContactChange('phone', value)}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  type={field.type}
                  value={contactInfo.fullName}
                  onChange={(e) => onContactChange('fullName', e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-[#1f1f1f] border-2 border-[#333] rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-[#a39466] focus:shadow-[0_0_20px_rgba(163,148,102,0.2)] transition-all duration-300 placeholder:text-[#555]"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
