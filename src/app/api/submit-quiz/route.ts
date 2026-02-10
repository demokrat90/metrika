import { NextRequest, NextResponse } from 'next/server';
import { isAmoConfigured, submitAmoLead } from '@/lib/amocrm';
import { buildRequestContextNote, extractRequestTracking } from '@/lib/request-context';

interface QuizData {
  fullName?: string;
  phone?: string;
  email?: string;
  trackingCookies?: string;
  [key: number]: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: QuizData = await request.json();
    const requestContextNote = buildRequestContextNote(request);
    const requestTracking = extractRequestTracking(request, {
      rawCookieHeader: data.trackingCookies,
    });
    const fullName = data.fullName?.trim() || 'Unknown';
    const phone = data.phone?.trim() || '';
    const amoConfigured = isAmoConfigured();
    let amoSynced = !amoConfigured;
    let amoError = '';

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
    if (amoConfigured) {
      try {
        const LRM = '\u200E';
        const answersText = Object.entries(quizAnswersLabels)
          .map(([index, label], itemIndex) => {
            const answer = data[Number(index)] || '-';
            return [
              `${LRM}Q${itemIndex + 1}${LRM}: ${label}`,
              `${LRM}A${itemIndex + 1}${LRM}: ${answer}`,
            ].join('\n');
          })
          .join('\n\n');

        await submitAmoLead({
          leadName: `Quiz Lead - ${fullName}`,
          tags: ['Arab'],
          noteText: [
            'Lead source: quiz form',
            `Full name: ${fullName}`,
            `Contact method: ${data[5] || '-'}`,
            `Phone: ${phone || '-'}`,
            `Email: ${data.email || '-'}`,
            '',
            'Quiz answers:',
            answersText || '-',
            '',
            requestContextNote,
          ].join('\n'),
          tracking: requestTracking,
          contact: {
            fullName,
            phone,
            email: data.email,
          },
        });
        amoSynced = true;
      } catch (amoCrmError) {
        console.error('Error sending to AmoCRM:', amoCrmError);
        amoError = amoCrmError instanceof Error ? amoCrmError.message : 'Unknown AmoCRM error';
      }
    }

    if (!amoSynced) {
      return NextResponse.json(
        {
          success: false,
          message: 'AmoCRM rejected the lead',
          amoSynced: false,
          amoError,
        },
        { status: 502 }
      );
    }

    // Push to GTM data layer (client-side will handle this)
    return NextResponse.json({
      success: true,
      message: 'Quiz submitted successfully',
      amoSynced: true,
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
