'use client';

import { useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import InvestmentSection from '@/components/InvestmentSection';
import TaxResidencySection from '@/components/TaxResidencySection';
import { QuizContainer } from '@/components/Quiz';
import Footer from '@/components/Footer';
import { QuizAnswers } from '@/lib/quiz-data';

export default function Home() {
  const quizRef = useRef<HTMLDivElement>(null);

  const scrollToQuiz = () => {
    quizRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuizComplete = (answers: QuizAnswers) => {
    // GTM data layer push
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: 'quiz_complete',
        quizAnswers: answers,
      });
    }
    console.log('Quiz completed:', answers);
  };

  return (
    <main className="min-h-screen bg-[#171717]">
      <Header />

      <Hero onCtaClick={scrollToQuiz} />

      <InvestmentSection />

      <TaxResidencySection />

      <div ref={quizRef}>
        <QuizContainer onComplete={handleQuizComplete} />
      </div>

      <Footer />
    </main>
  );
}
