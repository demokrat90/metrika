'use client';

import { useState, useCallback } from 'react';
import { quizSteps, QuizAnswers } from '@/lib/quiz-data';
import { pushEvent, trackConversion } from '@/lib/gtm';
import QuizStep from './QuizStep';

interface QuizContainerProps {
  onComplete: (answers: QuizAnswers) => void;
}

export default function QuizContainer({ onComplete }: QuizContainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    privacyAgreed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const totalSteps = quizSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSelect = useCallback((value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep]: value,
    }));
    // Auto-advance to next step after selection
    if (currentStep < totalSteps - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 250);
    }
  }, [currentStep, totalSteps]);

  const handleContactChange = useCallback((field: string, value: string | boolean) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const canProceed = () => {
    if (currentStep === totalSteps - 1) {
      return (
        contactInfo.fullName.trim() !== '' &&
        contactInfo.phone.trim() !== '' &&
        contactInfo.privacyAgreed
      );
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setSubmitError('');
    setIsSubmitting(true);

    const finalAnswers: QuizAnswers = {
      ...answers,
      fullName: contactInfo.fullName,
      phone: contactInfo.phone,
      email: contactInfo.email,
      trackingCookies: typeof document !== 'undefined' ? document.cookie : '',
    };

    try {
      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalAnswers),
      });

      const responsePayload = await response.json().catch(() => null);
      if (response.ok) {
        setIsCompleted(true);
        pushEvent('quiz_complete', {
          formName: 'quiz',
          contactMethod: answers[5],
        });
        trackConversion();
        onComplete(finalAnswers);
      } else {
        setSubmitError(
          responsePayload?.message || 'تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.'
        );
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setSubmitError('تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <section id="quiz" className="relative min-h-screen flex items-center justify-center bg-[#171717] overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#a39466]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#a39466]/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center quiz-success-animate">
            {/* Success Icon */}
            <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#a39466] to-[#8a7d55] flex items-center justify-center shadow-[0_0_60px_rgba(163,148,102,0.5)]">
              <svg
                className="w-14 h-14 text-[#171717]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-4xl md:text-5xl text-white mb-6 font-bold">
              شكراً لك!
            </h2>
            <p className="text-xl md:text-2xl text-[#c9c9c9] leading-relaxed">
              سنتواصل معك قريباً لمساعدتك في اختيار العقار المثالي
            </p>

            {/* Decorative line */}
            <div className="mt-10 w-32 h-1 mx-auto bg-gradient-to-l from-transparent via-[#a39466] to-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="relative min-h-screen flex flex-col justify-center bg-[#171717] py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top right glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#a39466]/5 rounded-full blur-3xl" />
        {/* Bottom left glow */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#a39466]/5 rounded-full blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#a39466 1px, transparent 1px), linear-gradient(90deg, #a39466 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Step Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-16">
          {/* Step numbers */}
          <div className="flex justify-between items-center mb-4">
            {quizSteps.map((_, index) => (
              <div
                key={index}
                className={`flex items-center justify-center transition-all duration-500 ${
                  index === currentStep ? 'scale-110' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    index < currentStep
                      ? 'bg-[#a39466] text-[#171717]'
                      : index === currentStep
                        ? 'bg-gradient-to-br from-[#a39466] to-[#8a7d55] text-[#171717] shadow-[0_0_20px_rgba(163,148,102,0.5)]'
                        : 'bg-[#292929] text-[#666]'
                  }`}
                >
                  {index < currentStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[#292929] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-[#a39466] to-[#d4c896] transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step info */}
          <div className="flex justify-between text-sm mt-3">
            <span className="text-[#a39466] font-medium">الخطوة {currentStep + 1} من {totalSteps}</span>
            <span className="text-[#666]">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Current Step */}
        <div className="quiz-content-wrapper" style={{ minHeight: '340px' }}>
          <QuizStep
            key={currentStep}
            step={quizSteps[currentStep]}
            selectedValue={answers[currentStep]}
            contactInfo={contactInfo}
            onSelect={handleSelect}
            onContactChange={handleContactChange}
            onPrivacyChange={(checked) => handleContactChange('privacyAgreed', checked)}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-3xl mx-auto mt-16 flex justify-between gap-6">
          {currentStep === totalSteps - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className={`group relative px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden ${
                canProceed() && !isSubmitting
                  ? 'quiz-btn-glow bg-gradient-to-l from-[#a39466] to-[#b8a775] text-[#171717] hover:shadow-[0_8px_32px_rgba(163,148,102,0.4)] hover:-translate-y-0.5'
                  : 'bg-[#333] text-[#555] cursor-not-allowed'
              }`}
            >
              <span className="relative z-10">
                {isSubmitting ? 'جارٍ الإرسال...' : 'احصل على الخيارات'}
              </span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="group relative px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden bg-gradient-to-l from-[#a39466] to-[#b8a775] text-[#171717] shadow-none hover:shadow-[0_0_0_1px_rgba(212,200,150,0.55),0_10px_34px_rgba(163,148,102,0.55)] hover:brightness-105 hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:brightness-100 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">التالي</span>
            </button>
          )}

          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`group relative px-10 py-4 rounded-xl font-medium text-lg transition-all duration-300 overflow-hidden ${
              currentStep === 0
                ? 'border-2 border-[#333] text-[#444] cursor-not-allowed'
                : 'border-2 border-[#a39466] text-[#a39466] hover:bg-[#a39466]/10 hover:shadow-[0_4px_20px_rgba(163,148,102,0.2)]'
            }`}
          >
            <span className="relative z-10">السابق</span>
          </button>
        </div>
        {submitError && (
          <p className="mt-4 text-center text-sm text-[#ff8d8d]">{submitError}</p>
        )}

      </div>
    </section>
  );
}
