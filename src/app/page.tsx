'use client';

import { useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import InvestmentSection from '@/components/InvestmentSection';
import { QuizContainer } from '@/components/Quiz';
import Footer from '@/components/Footer';
import { QuizAnswers } from '@/lib/quiz-data';
import { pushEvent } from '@/lib/gtm';

export default function Home() {
  const quizRef = useRef<HTMLDivElement>(null);

  const scrollToQuiz = () => {
    quizRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuizComplete = (answers: QuizAnswers) => {
    pushEvent('quiz_complete', { quizAnswers: answers });
  };

  return (
    <main className="min-h-screen bg-[#171717]">
      <Header />

      <Hero onCtaClick={scrollToQuiz} />

      <InvestmentSection />

      <div ref={quizRef}>
        <QuizContainer onComplete={handleQuizComplete} />
      </div>

      <Footer />
    </main>
  );
}
