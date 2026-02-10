import { NextRequest, NextResponse } from 'next/server';
import { isAmoConfigured, submitAmoLead } from '@/lib/amocrm';

interface LeadData {
  fullName: string;
  phone: string;
  category: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: LeadData = await request.json();

    // Log the submission (for development)
    console.log('Lead submission:', {
      name: data.fullName,
      phone: data.phone,
      category: data.category,
      source: data.source,
    });

    // If AmoCRM is configured, send the lead
    if (isAmoConfigured()) {
      try {
        await submitAmoLead({
          leadName: `${data.category} - ${data.fullName}`,
          leadFields: [
            {
              field_name: 'فئة العقار',
              values: [{ value: data.category }],
            },
            {
              field_name: 'مصدر الطلب',
              values: [{ value: data.source }],
            },
          ],
          contact: {
            fullName: data.fullName,
            phone: data.phone,
          },
        });
      } catch (amoCrmError) {
        console.error('Error sending to AmoCRM:', amoCrmError);
        // Don't fail the request if AmoCRM fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      gtmEvent: {
        event: 'lead_submit',
        formName: 'popup',
        category: data.category,
      },
    });
  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing submission' },
      { status: 500 }
    );
  }
}
