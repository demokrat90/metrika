import { NextRequest, NextResponse } from 'next/server';
import { isAmoConfigured, submitAmoLead } from '@/lib/amocrm';

interface QuizData {
  fullName?: string;
  phone?: string;
  email?: string;
  [key: number]: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: QuizData = await request.json();
    const fullName = data.fullName?.trim() || 'Unknown';
    const phone = data.phone?.trim() || '';

    // Build quiz answers summary
    const quizAnswersLabels: Record<number, string> = {
      0: 'نوع العقار',
      1: 'هدف الشراء',
      2: 'عدد غرف النوم',
      3: 'نطاق السعر',
      4: 'موعد التسليم',
      5: 'طريقة التواصل المفضلة',
    };

    const quizAnswers: Record<string, string> = {};
    for (let i = 0; i <= 5; i++) {
      if (data[i]) {
        quizAnswers[quizAnswersLabels[i]] = data[i];
      }
    }

    // Log the submission (for development)
    console.log('Quiz submission:', {
      name: data.fullName,
      phone,
      contactMethod: data[5],
      email: data.email,
      quizAnswers,
    });

    // If AmoCRM is configured, send the lead
    if (isAmoConfigured()) {
      try {
        await submitAmoLead({
          leadName: `Quiz Lead - ${fullName}`,
          leadFields: Object.entries(quizAnswers).map(([key, value]) => ({
            field_name: key,
            values: [{ value }],
          })),
          contact: {
            fullName,
            phone,
            email: data.email,
            extraFields: [
              {
                field_name: 'طريقة التواصل المفضلة',
                values: [{ value: data[5] }],
              },
            ],
          },
        });
      } catch (amoCrmError) {
        console.error('Error sending to AmoCRM:', amoCrmError);
        // Don't fail the request if AmoCRM fails
      }
    }

    // Push to GTM data layer (client-side will handle this)
    return NextResponse.json({
      success: true,
      message: 'Quiz submitted successfully',
      gtmEvent: {
        event: 'quiz_complete',
        formName: 'quiz',
        contactMethod: data[5],
      },
    });
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing submission' },
      { status: 500 }
    );
  }
}
