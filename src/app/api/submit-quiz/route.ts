import { NextRequest, NextResponse } from 'next/server';

// AmoCRM configuration - set these environment variables
const AMOCRM_SUBDOMAIN = process.env.AMOCRM_SUBDOMAIN;
const AMOCRM_ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN;
const AMOCRM_PIPELINE_ID = process.env.AMOCRM_PIPELINE_ID;

interface QuizData {
  fullName?: string;
  phone?: string;
  email?: string;
  [key: number]: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: QuizData = await request.json();

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
      phone: data.phone,
      contactMethod: data[5],
      email: data.email,
      quizAnswers,
    });

    // If AmoCRM is configured, send the lead
    if (AMOCRM_SUBDOMAIN && AMOCRM_ACCESS_TOKEN) {
      try {
        const leadData = {
          source_name: 'Quiz - Arabic Landing',
          source_uid: `quiz-${Date.now()}`,
          pipeline_id: AMOCRM_PIPELINE_ID ? parseInt(AMOCRM_PIPELINE_ID) : undefined,
          created_at: Math.floor(Date.now() / 1000),
          metadata: {
            form_name: 'Quiz Form',
            form_page: 'metrika-clone.vercel.app',
          },
          _embedded: {
            leads: [
              {
                name: `Quiz Lead - ${data.fullName}`,
                custom_fields_values: Object.entries(quizAnswers).map(([key, value]) => ({
                  field_name: key,
                  values: [{ value }],
                })),
              },
            ],
            contacts: [
              {
                name: data.fullName,
                first_name: data.fullName?.split(' ')[0] || '',
                last_name: data.fullName?.split(' ').slice(1).join(' ') || '',
                custom_fields_values: [
                  {
                    field_code: 'PHONE',
                    values: [{ value: data.phone, enum_code: 'MOB' }],
                  },
                  {
                    field_name: 'طريقة التواصل المفضلة',
                    values: [{ value: data[5] }],
                  },
                  ...(data.email ? [{
                    field_code: 'EMAIL',
                    values: [{ value: data.email, enum_code: 'WORK' }],
                  }] : []),
                ],
              },
            ],
          },
        };

        const response = await fetch(
          `https://${AMOCRM_SUBDOMAIN}/api/v4/leads/unsorted/forms`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${AMOCRM_ACCESS_TOKEN}`,
            },
            body: JSON.stringify([leadData]),
          }
        );

        if (!response.ok) {
          console.error('AmoCRM API error:', await response.text());
        }
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
